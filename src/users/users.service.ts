import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';
import { SimPlayer } from '../market/entities/sim-player.entity';
import { User } from './user.entity';

const GUEST_STARTING_CASH = 1000;
const ACCOUNT_STARTING_CASH = 0;
const AD_TOKEN_REWARD = 150;
const DAILY_LOGIN_TOKEN_REWARD = 25;
const MAX_AD_REWARD_CLAIMS = 2;
const TRADING_GAME_ID = 'trading';

type AuthDto = {
  email: string;
  password: string;
  display_name?: string;
  guest_player_id?: number;
};

type VerifyEmailDto = {
  email: string;
  code: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SimPlayer)
    private playersRepository: Repository<SimPlayer>,
  ) {}

  async register(dto: AuthDto) {
    const email = this.normalizeEmail(dto.email);
    const password = this.validatePassword(dto.password);
    const displayName = this.normalizeDisplayName(dto.display_name, email);
    const guestRewardTokens = await this.getGuestPendingTokens(
      dto.guest_player_id,
    );

    const existing = await this.usersRepository.findOneBy({ email });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.usersRepository.save(
      this.usersRepository.create({
        email,
        display_name: displayName,
        password_hash: this.hashPassword(password),
        email_verified: false,
        account_tokens: guestRewardTokens,
        lifetime_tokens_earned: guestRewardTokens,
        email_verification_code: this.createVerificationCode(),
        email_verification_sent_at: new Date(),
      }),
    );

    return this.pendingVerificationResponse(user);
  }

  async login(dto: AuthDto) {
    const email = this.normalizeEmail(dto.email);
    const user = await this.usersRepository.findOneBy({ email });

    if (!user || !this.verifyPassword(dto.password || '', user.password_hash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.email_verified) {
      if (!user.email_verification_code) {
        user.email_verification_code = this.createVerificationCode();
        user.email_verification_sent_at = new Date();
        await this.usersRepository.save(user);
      }
      return this.pendingVerificationResponse(user);
    }

    let player = await this.playersRepository.findOneBy({ user_id: user.id });
    if (!player) {
      player = await this.playersRepository.save(
        this.playersRepository.create({
          user_id: user.id,
          game_id: TRADING_GAME_ID,
          display_name: user.display_name,
          cash_balance: ACCOUNT_STARTING_CASH,
          premium_credits: 0,
        }),
      );
    }

    await this.applyDailyLoginReward(user);
    return this.authResponse(user, player, 'account');
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const email = this.normalizeEmail(dto.email);
    const code = this.normalizeVerificationCode(dto.code);
    const user = await this.usersRepository.findOneBy({ email });

    if (!user || user.email_verification_code !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    user.email_verified = true;
    user.email_verified_at = new Date();
    user.email_verification_code = null;
    await this.applyDailyLoginReward(user);
    const savedUser = await this.usersRepository.save(user);

    const existingPlayer = await this.playersRepository.findOneBy({
      user_id: savedUser.id,
    });
    const player =
      existingPlayer ||
      (await this.playersRepository.save(
        this.playersRepository.create({
          user_id: savedUser.id,
          game_id: TRADING_GAME_ID,
          display_name: savedUser.display_name,
          cash_balance: ACCOUNT_STARTING_CASH,
          premium_credits: 0,
        }),
      ));

    return this.authResponse(savedUser, player, 'account');
  }

  async claimAdReward(playerId: number) {
    if (!Number.isInteger(playerId)) {
      throw new BadRequestException('player_id must be a number');
    }

    const player = await this.playersRepository.findOneBy({ id: playerId });
    if (!player) {
      throw new BadRequestException('Player was not found');
    }

    if (!player.user_id) {
      throw new BadRequestException(
        'Register and verify email before claiming ad rewards',
      );
    }

    const user = await this.usersRepository.findOneBy({ id: player.user_id });
    if (!user?.email_verified) {
      throw new BadRequestException('Verify email before claiming ad rewards');
    }

    if (player.ad_reward_claims >= MAX_AD_REWARD_CLAIMS) {
      throw new BadRequestException(
        'All starter ad rewards are already claimed',
      );
    }

    player.ad_reward_claims += 1;
    const savedPlayer = await this.playersRepository.save(player);
    user.account_tokens = Number(user.account_tokens) + AD_TOKEN_REWARD;
    user.lifetime_tokens_earned =
      Number(user.lifetime_tokens_earned || 0) + AD_TOKEN_REWARD;
    const savedUser = await this.usersRepository.save(user);

    return {
      player: savedPlayer,
      user: this.publicUser(savedUser),
      reward_tokens: AD_TOKEN_REWARD,
      remaining_claims: Math.max(
        0,
        MAX_AD_REWARD_CLAIMS - savedPlayer.ad_reward_claims,
      ),
    };
  }

  async createGuest(displayName?: string) {
    const player = await this.playersRepository.save(
      this.playersRepository.create({
        game_id: TRADING_GAME_ID,
        display_name: this.normalizeDisplayName(displayName, 'Guest Trader'),
        cash_balance: GUEST_STARTING_CASH,
        premium_credits: 0,
        first_session_started_at: new Date(),
      }),
    );

    return {
      mode: 'guest',
      user: null,
      player,
    };
  }

  findAll() {
    return this.usersRepository.find({
      select: {
        id: true,
        email: true,
        display_name: true,
        email_verified: true,
        account_tokens: true,
        preferred_language: true,
        account_level: true,
        total_play_seconds: true,
        activity_score: true,
        login_streak: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  private authResponse(user: User, player: SimPlayer, mode: 'account') {
    return {
      mode,
      user: this.publicUser(user),
      player,
    };
  }

  private pendingVerificationResponse(user: User) {
    return {
      mode: 'pending_verification',
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        email_verified: false,
        account_tokens: Number(user.account_tokens || 0),
        preferred_language: user.preferred_language || 'ru',
        account_level: user.account_level || 1,
        login_streak: user.login_streak || 0,
      },
      message:
        'Verification code was generated. In production this code should be emailed.',
      dev_verification_code: user.email_verification_code,
    };
  }

  private normalizeEmail(email?: string) {
    const normalized = email?.trim().toLowerCase();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new BadRequestException('Valid email is required');
    }
    return normalized;
  }

  private validatePassword(password?: string) {
    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    return password;
  }

  private normalizeVerificationCode(code?: string) {
    const normalized = code?.trim();
    if (!normalized || !/^\d{6}$/.test(normalized)) {
      throw new BadRequestException('Verification code must be 6 digits');
    }
    return normalized;
  }

  private normalizeDisplayName(
    displayName: string | undefined,
    fallback: string,
  ) {
    const normalized =
      displayName?.trim() || fallback.split('@')[0] || 'Trader';
    return normalized.slice(0, 24);
  }

  private async getGuestPendingTokens(guestPlayerId?: number) {
    const playerId = Number(guestPlayerId);
    if (!Number.isInteger(playerId)) return 0;

    const guest = await this.playersRepository.findOneBy({ id: playerId });
    if (!guest || guest.user_id) return 0;

    return Number(guest.first_session_reward_tokens || 0);
  }

  private async applyDailyLoginReward(user: User) {
    const today = new Date().toISOString().slice(0, 10);
    const lastLoginDay = user.last_daily_login_at?.toISOString().slice(0, 10);
    if (lastLoginDay === today) {
      return;
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    user.login_streak =
      lastLoginDay === yesterday ? Number(user.login_streak || 0) + 1 : 1;
    user.last_daily_login_at = new Date();
    user.account_tokens =
      Number(user.account_tokens || 0) + DAILY_LOGIN_TOKEN_REWARD;
    user.lifetime_tokens_earned =
      Number(user.lifetime_tokens_earned || 0) + DAILY_LOGIN_TOKEN_REWARD;
    await this.usersRepository.save(user);
  }

  private publicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      email_verified: user.email_verified,
      account_tokens: Number(user.account_tokens || 0),
      preferred_language: user.preferred_language || 'ru',
      account_level: user.account_level || 1,
      total_play_seconds: user.total_play_seconds || 0,
      activity_score: user.activity_score || 0,
      login_streak: user.login_streak || 0,
    };
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString(
      'hex',
    );
    return `pbkdf2:${salt}:${hash}`;
  }

  private createVerificationCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private verifyPassword(password: string, storedHash: string) {
    const [method, salt, hash] = storedHash.split(':');
    if (method !== 'pbkdf2' || !salt || !hash) return false;

    const candidate = pbkdf2Sync(password, salt, 120000, 32, 'sha256');
    const expected = Buffer.from(hash, 'hex');
    return (
      expected.length === candidate.length &&
      timingSafeEqual(candidate, expected)
    );
  }
}
