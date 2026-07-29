export const PLATFORM_GAMES = [
  {
    game_id: 'trading',
    name: 'Trading Simulator',
    status: 'active',
    sort_order: 10,
  },
  {
    game_id: 'chess',
    name: 'Chess',
    status: 'planned',
    sort_order: 20,
  },
  {
    game_id: 'checkers',
    name: 'Checkers',
    status: 'planned',
    sort_order: 30,
  },
  {
    game_id: 'backgammon',
    name: 'Backgammon',
    status: 'planned',
    sort_order: 40,
  },
];

export const GLOBAL_ACHIEVEMENT_DEFINITIONS = [
  {
    code: 'platform_first_payment',
    title: 'First payment',
    metric: 'payments',
    target: 1,
    token_reward: 50,
  },
  {
    code: 'platform_100_hours',
    title: '100 hours across the platform',
    metric: 'play_seconds',
    target: 360000,
    token_reward: 250,
  },
  {
    code: 'platform_100_wins',
    title: '100 wins',
    metric: 'wins',
    target: 100,
    token_reward: 200,
  },
  {
    code: 'platform_first_tournament',
    title: 'First tournament',
    metric: 'tournaments',
    target: 1,
    token_reward: 100,
  },
];

export const DEV_LOG_ENTRIES = [
  {
    version: '0.4.0-public-launch',
    title: 'Public launch infrastructure',
    summary:
      'Added early access, referral invites, DevLog, What\'s New, and one-click sharing foundations.',
    body: 'Trading Academy now has the public launch layer needed before a wider release. Players can join the early access list, invite friends, read product updates, and share achievements or portfolio results.',
    tags_json: JSON.stringify([
      'launch',
      'early access',
      'referrals',
      'sharing',
    ]),
    published_at: new Date('2026-07-29T00:00:00.000Z'),
  },
  {
    version: '0.3.0-platform',
    title: 'Multi-app platform architecture',
    summary:
      'Prepared one account, one token wallet, global achievements, and game profiles for future apps.',
    body: 'Trading Simulator is now the first app inside a larger ecosystem. The backend can track platform games, per-game profiles, friends, shared wallet data, global achievements, and activity stats.',
    tags_json: JSON.stringify(['platform', 'wallet', 'achievements']),
    published_at: new Date('2026-07-28T00:00:00.000Z'),
  },
  {
    version: '0.2.0-retention',
    title: 'First session and retention loop',
    summary:
      'Improved the first session with a guided trade, reward card, achievement, and learning follow-up.',
    body: 'The new first session helps beginners understand a simple profitable trade, receive tokens, unlock the first achievement, and continue learning without feeling punished.',
    tags_json: JSON.stringify(['onboarding', 'retention', 'tokens']),
    published_at: new Date('2026-07-27T00:00:00.000Z'),
  },
];

export const PRODUCT_UPDATES = [
  {
    version: '0.4.0',
    title: 'Public launch layer is ready',
    summary:
      'Early access, referrals, DevLog, What\'s New, and sharing are now available.',
    body: 'This update prepares the project for public development and future launch. You can collect early users, give them referral links, publish transparent development updates, and let players share their results.',
    highlights_json: JSON.stringify([
      'Coming Soon page with early access form',
      'Referral invite system',
      'DevLog and What\'s New pages',
      'One-click sharing foundation',
    ]),
  },
  {
    version: '0.3.0',
    title: 'Platform foundation',
    summary:
      'The backend is ready for multiple future apps under one account.',
    body: 'Trading remains the first product, while Chess, Checkers, and Backgammon are represented as planned apps in the platform architecture.',
    highlights_json: JSON.stringify([
      'One user profile across apps',
      'Shared token wallet',
      'Global and game achievements',
      'Per-game activity stats',
    ]),
  },
];
