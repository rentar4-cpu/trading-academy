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
