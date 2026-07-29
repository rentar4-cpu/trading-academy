import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AchievementProgress } from '../market/entities/achievement-progress.entity';
import { MonetizationOffer } from '../market/entities/monetization-offer.entity';
import { User } from '../users/user.entity';
import { AchievementEvent } from './entities/achievement-event.entity';
import { PlatformGame } from './entities/platform-game.entity';
import { UserFriend } from './entities/user-friend.entity';
import { UserGameProfile } from './entities/user-game-profile.entity';
import {
  GLOBAL_ACHIEVEMENT_DEFINITIONS,
  PLATFORM_GAMES,
} from './platform.data';

export type PlatformActivityDto = {
  game_id: string;
  play_seconds?: number;
  sessions_played?: number;
  wins?: number;
  losses?: number;
  draws?: number;
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
  ) {}

  async onModuleInit() {
    await this.seedGames();
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
      preferred_language: user.preferred_language || 'ru',
      account_level: user.account_level || 1,
      email_verified: user.email_verified,
      login_streak: user.login_streak || 0,
    };
  }

  private calculateAccountLevel(activityScore: number) {
    return Math.max(1, Math.floor(Math.sqrt(activityScore || 0) / 10) + 1);
  }
}
