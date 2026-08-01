import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AchievementProgress } from '../market/entities/achievement-progress.entity';
import { MonetizationOffer } from '../market/entities/monetization-offer.entity';
import { User } from '../users/user.entity';
import { AchievementEvent } from './entities/achievement-event.entity';
import { DevLogEntry } from './entities/dev-log-entry.entity';
import { EarlyAccessSignup } from './entities/early-access-signup.entity';
import { PlatformGame } from './entities/platform-game.entity';
import { ProductUpdate } from './entities/product-update.entity';
import { ReferralInvite } from './entities/referral-invite.entity';
import { ShareEvent } from './entities/share-event.entity';
import { TesterFeedback } from './entities/tester-feedback.entity';
import { UserFriend } from './entities/user-friend.entity';
import { UserGameProfile } from './entities/user-game-profile.entity';
import {
  DEV_LOG_ENTRIES,
  GLOBAL_ACHIEVEMENT_DEFINITIONS,
  PLATFORM_GAMES,
  PRODUCT_UPDATES,
} from './platform.data';

export type PlatformActivityDto = {
  game_id: string;
  play_seconds?: number;
  sessions_played?: number;
  wins?: number;
  losses?: number;
  draws?: number;
};

export type EarlyAccessDto = {
  email: string;
  display_name?: string;
  referral_code?: string;
  source?: string;
  locale?: string;
};

export type ReferralInviteDto = {
  inviter_user_id?: number;
  inviter_email?: string;
};

export type ShareDto = {
  user_id?: number;
  player_id?: number;
  game_id?: string;
  kind?: string;
  title: string;
  payload?: Record<string, unknown>;
};

export type TesterFeedbackDto = {
  name?: string;
  email?: string;
  device?: string;
  tested_version?: string;
  answers?: Record<string, string>;
  confusion_comment?: string;
  interesting_feature?: string;
  clarity_rating?: number;
  first_improvement?: string;
  additional_comments?: string;
  source?: string;
};

@Injectable()
export class PlatformService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PlatformGame)
    private readonly gamesRepository: Repository<PlatformGame>,
    @InjectRepository(UserGameProfile)
    private readonly gameProfilesRepository: Repository<UserGameProfile>,
    @InjectRepository(UserFriend)
    private readonly friendsRepository: Repository<UserFriend>,
    @InjectRepository(AchievementProgress)
    private readonly achievementsRepository: Repository<AchievementProgress>,
    @InjectRepository(AchievementEvent)
    private readonly achievementEventsRepository: Repository<AchievementEvent>,
    @InjectRepository(MonetizationOffer)
    private readonly offersRepository: Repository<MonetizationOffer>,
    @InjectRepository(EarlyAccessSignup)
    private readonly earlyAccessRepository: Repository<EarlyAccessSignup>,
    @InjectRepository(ReferralInvite)
    private readonly referralsRepository: Repository<ReferralInvite>,
    @InjectRepository(DevLogEntry)
    private readonly devLogRepository: Repository<DevLogEntry>,
    @InjectRepository(ProductUpdate)
    private readonly updatesRepository: Repository<ProductUpdate>,
    @InjectRepository(ShareEvent)
    private readonly shareEventsRepository: Repository<ShareEvent>,
    @InjectRepository(TesterFeedback)
    private readonly testerFeedbackRepository: Repository<TesterFeedback>,
  ) {}

  async onModuleInit() {
    await this.seedGames();
    await this.seedLaunchContent();
  }

  async seedGames() {
    for (const gameSeed of PLATFORM_GAMES) {
      const existing = await this.gamesRepository.findOne({
        where: { game_id: gameSeed.game_id },
      });

      if (!existing) {
        await this.gamesRepository.save(this.gamesRepository.create(gameSeed));
        continue;
      }

      await this.gamesRepository.save({ ...existing, ...gameSeed });
    }
  }

  getGames() {
    return this.gamesRepository.find({ order: { sort_order: 'ASC' } });
  }

  async getPlatformProfile(userId: number) {
    const user = await this.findUser(userId);
    const [games, profiles, friends, achievements] = await Promise.all([
      this.getGames(),
      this.gameProfilesRepository.find({ where: { user_id: user.id } }),
      this.getFriends(user.id),
      this.getAchievements(user.id),
    ]);

    return {
      user: this.publicUser(user),
      wallet: this.wallet(user),
      games: games.map((game) => {
        const profile = profiles.find((item) => item.game_id === game.game_id);
        return {
          ...game,
          installed: profile?.installed || false,
          play_seconds: profile?.play_seconds || 0,
          sessions_played: profile?.sessions_played || 0,
          wins: profile?.wins || 0,
          losses: profile?.losses || 0,
          draws: profile?.draws || 0,
          activity_score: profile?.activity_score || 0,
        };
      }),
      friends,
      achievements,
      stats: this.platformStats(user, profiles),
    };
  }

  async getWallet(userId: number) {
    return this.wallet(await this.findUser(userId));
  }

  async getStats(userId: number) {
    const user = await this.findUser(userId);
    const profiles = await this.gameProfilesRepository.find({
      where: { user_id: user.id },
    });
    return this.platformStats(user, profiles);
  }

  async getAchievements(userId: number) {
    const [progress, events] = await Promise.all([
      this.achievementsRepository.find({ where: { user_id: userId } }),
      this.achievementEventsRepository.find({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
        take: 50,
      }),
    ]);

    return {
      global: GLOBAL_ACHIEVEMENT_DEFINITIONS.map((definition) => {
        const item = progress.find(
          (entry) =>
            entry.scope === 'global' &&
            entry.game_id === 'global' &&
            entry.code === definition.code,
        );
        return {
          ...definition,
          scope: 'global',
          game_id: 'global',
          progress: Number(item?.progress || 0),
          completed: item?.completed || false,
          completed_at: item?.completed_at || null,
        };
      }),
      history: events,
    };
  }

  async installGame(userId: number, gameId: string) {
    await this.findUser(userId);
    await this.ensureGame(gameId);

    let profile = await this.gameProfilesRepository.findOne({
      where: { user_id: userId, game_id: gameId },
    });

    if (!profile) {
      profile = this.gameProfilesRepository.create({
        user_id: userId,
        game_id: gameId,
        installed: true,
        installed_at: new Date(),
      });
    }

    profile.installed = true;
    profile.installed_at = profile.installed_at || new Date();
    return this.gameProfilesRepository.save(profile);
  }

  async recordActivity(userId: number, dto: PlatformActivityDto) {
    const user = await this.findUser(userId);
    await this.ensureGame(dto.game_id);
    const profile = await this.getOrCreateGameProfile(user.id, dto.game_id);

    const playSeconds = Math.max(0, Math.floor(Number(dto.play_seconds || 0)));
    const sessionsPlayed = Math.max(
      0,
      Math.floor(Number(dto.sessions_played || 0)),
    );
    const wins = Math.max(0, Math.floor(Number(dto.wins || 0)));
    const losses = Math.max(0, Math.floor(Number(dto.losses || 0)));
    const draws = Math.max(0, Math.floor(Number(dto.draws || 0)));

    profile.installed = true;
    profile.installed_at = profile.installed_at || new Date();
    profile.play_seconds += playSeconds;
    profile.sessions_played += sessionsPlayed;
    profile.wins += wins;
    profile.losses += losses;
    profile.draws += draws;
    profile.activity_score += sessionsPlayed * 10 + wins * 15 + draws * 5;

    user.total_play_seconds += playSeconds;
    user.activity_score += sessionsPlayed * 10 + wins * 15 + draws * 5;
    user.account_level = this.calculateAccountLevel(user.activity_score);

    await Promise.all([
      this.gameProfilesRepository.save(profile),
      this.usersRepository.save(user),
      this.incrementGlobalMetric(user, 'play_seconds', playSeconds),
      this.incrementGlobalMetric(user, 'wins', wins),
    ]);

    return this.getPlatformProfile(user.id);
  }

  async getFriends(userId: number) {
    const relations = await this.friendsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    const friendIds = relations.map((relation) => relation.friend_user_id);
    const users = friendIds.length
      ? await this.usersRepository.find({ where: { id: In(friendIds) } })
      : [];

    return relations.map((relation) => {
      const friend = users.find((user) => user.id === relation.friend_user_id);
      return {
        id: relation.id,
        status: relation.status,
        friend_user_id: relation.friend_user_id,
        display_name: friend?.display_name || 'Unknown',
        account_level: friend?.account_level || 1,
      };
    });
  }

  async addFriend(userId: number, friendUserId: number) {
    if (userId === friendUserId) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }

    await Promise.all([this.findUser(userId), this.findUser(friendUserId)]);
    const existing = await this.friendsRepository.findOne({
      where: { user_id: userId, friend_user_id: friendUserId },
    });

    if (existing) return existing;

    return this.friendsRepository.save(
      this.friendsRepository.create({
        user_id: userId,
        friend_user_id: friendUserId,
        status: 'pending',
      }),
    );
  }

  async getStoreOffers() {
    return this.offersRepository.find({
      where: { is_active: true },
      order: { price_usd: 'ASC' },
    });
  }

  async joinEarlyAccess(dto: EarlyAccessDto) {
    const email = this.normalizeEmail(dto.email);
    const referralCode = this.normalizeOptionalCode(dto.referral_code);
    const locale = dto.locale?.trim().slice(0, 8) || 'en';
    const source = dto.source?.trim().slice(0, 40) || 'coming-soon';

    let signup = await this.earlyAccessRepository.findOne({
      where: { email },
    });

    if (!signup) {
      signup = this.earlyAccessRepository.create({
        email,
        display_name: dto.display_name?.trim().slice(0, 80) || undefined,
        referred_by_code: referralCode,
        referral_code: this.makeReferralCode(email),
        locale,
        source,
      });

      if (referralCode) await this.incrementReferralUse(referralCode);
    } else {
      signup.display_name =
        dto.display_name?.trim().slice(0, 80) || signup.display_name;
      signup.locale = locale;
      signup.source = source;
      signup.referred_by_code = signup.referred_by_code || referralCode;
    }

    const saved = await this.earlyAccessRepository.save(signup);
    const invite = await this.getOrCreateReferralInvite({
      inviter_email: saved.email,
    });

    return {
      signup: saved,
      referral: {
        code: invite.code,
        reward_tokens: invite.reward_tokens,
        uses: invite.uses,
        max_uses: invite.max_uses,
      },
    };
  }

  async createReferralInvite(dto: ReferralInviteDto) {
    return this.getOrCreateReferralInvite(dto);
  }

  async getReferralInvite(code: string) {
    const invite = await this.referralsRepository.findOne({
      where: { code: this.normalizeReferralCode(code) },
    });
    if (!invite) throw new BadRequestException('Referral code was not found');
    return invite;
  }

  async getDevLog() {
    const entries = await this.devLogRepository.find({
      where: { is_published: true },
      order: { published_at: 'DESC', created_at: 'DESC' },
    });

    return entries.map((entry) => ({
      ...entry,
      tags: this.parseJsonList(entry.tags_json),
    }));
  }

  async getWhatsNew() {
    const updates = await this.updatesRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });

    return updates.map((update) => ({
      ...update,
      highlights: this.parseJsonList(update.highlights_json),
    }));
  }

  async recordShare(dto: ShareDto) {
    if (!dto.title?.trim()) {
      throw new BadRequestException('Share title is required');
    }

    const event = await this.shareEventsRepository.save(
      this.shareEventsRepository.create({
        user_id: dto.user_id ? Number(dto.user_id) : undefined,
        player_id: dto.player_id ? Number(dto.player_id) : undefined,
        game_id: dto.game_id?.trim().toLowerCase() || 'trading',
        kind: dto.kind?.trim().slice(0, 40) || 'result',
        title: dto.title.trim().slice(0, 140),
        payload_json: JSON.stringify(dto.payload || {}),
      }),
    );

    return {
      id: event.id,
      title: event.title,
      text: `${event.title} | Mentavio`,
      url: '/game/coming-soon.html',
      created_at: event.created_at,
    };
  }

  async recordTesterFeedback(dto: TesterFeedbackDto) {
    const answers = dto.answers || {};
    const hasUsefulFeedback =
      Object.values(answers).some((value) => String(value || '').trim()) ||
      dto.confusion_comment?.trim() ||
      dto.interesting_feature?.trim() ||
      dto.first_improvement?.trim() ||
      dto.additional_comments?.trim();

    if (!hasUsefulFeedback) {
      throw new BadRequestException('Feedback is empty');
    }

    const email = dto.email?.trim()
      ? this.normalizeEmail(dto.email)
      : undefined;
    const rating = Number(dto.clarity_rating || 0);

    const feedback = await this.testerFeedbackRepository.save(
      this.testerFeedbackRepository.create({
        name: dto.name?.trim().slice(0, 120) || undefined,
        email,
        device: dto.device?.trim().slice(0, 160) || undefined,
        tested_version:
          dto.tested_version?.trim().slice(0, 120) || undefined,
        answers_json: JSON.stringify(answers),
        confusion_comment:
          dto.confusion_comment?.trim().slice(0, 4000) || undefined,
        interesting_feature:
          dto.interesting_feature?.trim().slice(0, 4000) || undefined,
        clarity_rating:
          Number.isFinite(rating) && rating >= 1 && rating <= 5
            ? rating
            : undefined,
        first_improvement:
          dto.first_improvement?.trim().slice(0, 4000) || undefined,
        additional_comments:
          dto.additional_comments?.trim().slice(0, 4000) || undefined,
        source: dto.source?.trim().slice(0, 60) || 'web-checklist',
      }),
    );

    return {
      id: feedback.id,
      status: 'received',
      message: 'Thank you. Your feedback was saved.',
      created_at: feedback.created_at,
    };
  }

  private async seedLaunchContent() {
    for (const seed of DEV_LOG_ENTRIES) {
      const existing = await this.devLogRepository.findOne({
        where: { version: seed.version },
      });
      await this.devLogRepository.save(
        existing ? { ...existing, ...seed } : this.devLogRepository.create(seed),
      );
    }

    for (const seed of PRODUCT_UPDATES) {
      const existing = await this.updatesRepository.findOne({
        where: { version: seed.version },
      });
      await this.updatesRepository.save(
        existing ? { ...existing, ...seed } : this.updatesRepository.create(seed),
      );
    }
  }

  private async seedGlobalAchievementEvent(
    user: User,
    code: string,
    title: string,
  ) {
    const existing = await this.achievementEventsRepository.findOne({
      where: { user_id: user.id, scope: 'global', game_id: 'global', code },
    });
    if (existing) return;

    await this.achievementEventsRepository.save(
      this.achievementEventsRepository.create({
        user_id: user.id,
        scope: 'global',
        game_id: 'global',
        code,
        title,
      }),
    );
  }

  private async incrementGlobalMetric(
    user: User,
    metric: string,
    amount: number,
  ) {
    if (amount <= 0) return;

    const definitions = GLOBAL_ACHIEVEMENT_DEFINITIONS.filter(
      (definition) => definition.metric === metric,
    );

    for (const definition of definitions) {
      let progress = await this.achievementsRepository.findOne({
        where: {
          user_id: user.id,
          game_id: 'global',
          scope: 'global',
          code: definition.code,
        },
      });

      if (!progress) {
        progress = this.achievementsRepository.create({
          user_id: user.id,
          game_id: 'global',
          scope: 'global',
          code: definition.code,
          progress: 0,
          completed: false,
        });
      }

      if (!progress.completed) {
        progress.progress = Number(progress.progress || 0) + amount;
        if (Number(progress.progress) >= definition.target) {
          progress.completed = true;
          progress.completed_at = new Date();
          user.account_tokens =
            Number(user.account_tokens || 0) + definition.token_reward;
          user.lifetime_tokens_earned =
            Number(user.lifetime_tokens_earned || 0) + definition.token_reward;
          await this.usersRepository.save(user);
          await this.seedGlobalAchievementEvent(
            user,
            definition.code,
            definition.title,
          );
        }
      }

      await this.achievementsRepository.save(progress);
    }
  }

  private async getOrCreateGameProfile(userId: number, gameId: string) {
    const existing = await this.gameProfilesRepository.findOne({
      where: { user_id: userId, game_id: gameId },
    });
    if (existing) return existing;

    return this.gameProfilesRepository.create({
      user_id: userId,
      game_id: gameId,
      installed: true,
      installed_at: new Date(),
    });
  }

  private async findUser(userId: number) {
    if (!Number.isInteger(userId)) {
      throw new BadRequestException('user_id must be a number');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    return user;
  }

  private async getOrCreateReferralInvite(dto: ReferralInviteDto) {
    if (dto.inviter_user_id) await this.findUser(Number(dto.inviter_user_id));
    const inviterEmail = dto.inviter_email
      ? this.normalizeEmail(dto.inviter_email)
      : undefined;

    const existing = await this.referralsRepository.findOne({
      where: dto.inviter_user_id
        ? { inviter_user_id: Number(dto.inviter_user_id) }
        : { inviter_email: inviterEmail },
    });
    if (existing) return existing;

    return this.referralsRepository.save(
      this.referralsRepository.create({
        inviter_user_id: dto.inviter_user_id
          ? Number(dto.inviter_user_id)
          : undefined,
        inviter_email: inviterEmail,
        code: this.makeReferralCode(
          inviterEmail || `user-${dto.inviter_user_id || Date.now()}`,
        ),
      }),
    );
  }

  private async incrementReferralUse(code: string) {
    const invite = await this.referralsRepository.findOne({
      where: { code: this.normalizeReferralCode(code) },
    });
    if (!invite || invite.status !== 'active') return;
    if (invite.uses >= invite.max_uses) return;

    invite.uses += 1;
    await this.referralsRepository.save(invite);
  }

  private async ensureGame(gameId: string) {
    const normalized = this.normalizeGameId(gameId);
    const game = await this.gamesRepository.findOne({
      where: { game_id: normalized },
    });
    if (!game) {
      throw new BadRequestException(`Unknown game_id: ${gameId}`);
    }
    return game;
  }

  private normalizeGameId(gameId?: string) {
    const normalized = gameId?.trim().toLowerCase();
    if (!normalized) {
      throw new BadRequestException('game_id is required');
    }
    return normalized;
  }

  private normalizeEmail(email?: string) {
    const normalized = email?.trim().toLowerCase();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new BadRequestException('Valid email is required');
    }
    return normalized;
  }

  private normalizeOptionalCode(code?: string) {
    return code ? this.normalizeReferralCode(code) : undefined;
  }

  private normalizeReferralCode(code: string) {
    const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!normalized) throw new BadRequestException('Referral code is required');
    return normalized.slice(0, 16);
  }

  private makeReferralCode(seed: string) {
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
      hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
    }
    return `TA${hash.toString(36).toUpperCase().slice(0, 8)}`;
  }

  private parseJsonList(value: string) {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private platformStats(user: User, profiles: UserGameProfile[]) {
    const installedProfiles = profiles.filter((profile) => profile.installed);
    return {
      installed_games: installedProfiles.length,
      total_play_seconds: user.total_play_seconds || 0,
      total_play_hours: Number(
        ((user.total_play_seconds || 0) / 3600).toFixed(2),
      ),
      activity_score: user.activity_score || 0,
      account_level: user.account_level || 1,
      total_wins: profiles.reduce((total, profile) => total + profile.wins, 0),
      total_sessions: profiles.reduce(
        (total, profile) => total + profile.sessions_played,
        0,
      ),
    };
  }

  private wallet(user: User) {
    return {
      user_id: user.id,
      currency: 'tokens',
      balance: Number(user.account_tokens || 0),
      lifetime_earned: Number(user.lifetime_tokens_earned || 0),
      lifetime_spent: Number(user.lifetime_tokens_spent || 0),
    };
  }

  private publicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      preferred_language: user.preferred_language || 'en',
      account_level: user.account_level || 1,
      email_verified: user.email_verified,
      login_streak: user.login_streak || 0,
    };
  }

  private calculateAccountLevel(activityScore: number) {
    return Math.max(1, Math.floor(Math.sqrt(activityScore || 0) / 10) + 1);
  }
}
