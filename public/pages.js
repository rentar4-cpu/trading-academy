const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const page = document.body.dataset.page;
const statusNode = document.querySelector('#pageStatus');
const clockNode = document.querySelector('#pageClock');
let currentLanguage = localStorage.getItem('market_language') || 'en';
let lastIntelInsights = [];
let selectedIntelSymbol = localStorage.getItem('market_intel_symbol') || '';
let selectedIntelRange = localStorage.getItem('market_intel_range') || '1D';
let intelInteractionsBound = false;
let isPageRefreshRunning = false;
let lastPortfolio = null;
let portfolioCompanies = [];
let portfolioTradeSide = 'buy';
let portfolioTradeInteractionsBound = false;
let storeInteractionsBound = false;
let storeSessionStarters = [];

const pageTranslations = {
  en: {
    language: 'Language',
    navMarket: 'Market',
    navIntel: 'Intel',
    navTrades: 'Trades',
    navNews: 'News',
    navPortfolio: 'Portfolio',
    navStore: 'Store',
    navAuth: 'Account',
    brand: 'Mentavio',
    intelTitle: 'Market Intel',
    tradesTitle: 'Recent Trades',
    portfolioTitle: 'Portfolio',
    storeTitle: 'Store',
    signals: 'Signals',
    tradingSignals: 'Trading Signals',
    marketChart: 'Market Chart',
    priceMap: 'Price Map',
    chartChange: 'Change %',
    marketOpen: 'Market Open',
    closesIn: 'Closes in',
    tape: 'Tape',
    tradeTape: 'Trade Tape',
    noHistory: 'No trades yet. Bot traders are warming up the market.',
    offers: 'Offers',
    currency: 'Tokens',
    customCash: 'Session cash',
    gameCash: 'Game cash',
    buyCash: 'Start session',
    customCashNote:
      'Game cash belongs only to one session and is not sold directly.',
    cashPurchaseRecorded: 'Session started with cash: {amount}',
    noPositions: 'No positions yet',
    noPlayer: 'No player',
    createPlayerFirst: 'Create a player on the Market page first',
    verifiedAccountRequired: 'Register and verify email before buying currency',
    portfolioUpdated: 'Portfolio updated',
    marketIntelUpdated: 'Market intel updated',
    tradeTapeUpdated: 'Trade tape updated',
    storeLoaded: 'Store loaded',
    purchaseRecorded: 'Tokens added: {amount}',
    buyPressure: 'Buy pressure',
    support: 'Support',
    companyProfile: 'Company Profile',
    sector: 'Sector',
    owner: 'Owner',
    workers: 'Workers',
    opened: 'Opened',
    governmentSupport: 'Government Support',
    noSupport: 'No active support',
    amount: 'Amount',
    tax: 'Tax',
    loan: 'Loan',
    until: 'Until',
    risk: 'Risk',
    tokens: 'tokens',
    symbol: 'Symbol',
    trader: 'Trader',
    side: 'Side',
    qty: 'Qty',
    price: 'Price',
    value: 'Value',
    avg: 'Avg',
    pnl: 'PnL',
    cash: 'Cash',
    positions: 'Positions',
    credits: 'Tokens',
    netWorth: 'Net Worth',
    nextTick: 'Next tick',
    quickTrade: 'Quick Trade',
    buyOrSell: 'Buy or Sell',
    availableCash: 'Available cash',
    selectCompany: 'Select a company',
    company: 'Company',
    quantity: 'Quantity',
    buy: 'Buy',
    sell: 'Sell',
    owned: 'Owned',
    placeOrder: 'Place Order',
    orderPlaced: '{side} order completed: {quantity} {symbol}',
    accountWallet: 'Account Wallet',
    permanentTokens: 'Permanent tokens',
    walletCopy: 'Tokens stay with your account between all game sessions.',
    tokenBalance: 'Token balance',
    tokenPacks: 'Token Packs',
    buyTokens: 'Buy tokens',
    paymentNote:
      'Test purchases are simulated until secure payments are connected.',
    sessionFunding: 'Session Funding',
    useTokensForCash: 'Use tokens for game cash',
    sessionFundingNote:
      'Starting a new session replaces current cash and positions.',
    free: 'Free',
    startSession: 'Start session',
    sessionConfirm:
      'Start a new session with {amount}? Current cash and positions will be replaced.',
    shareResult: 'Share Result',
    shareReady: 'Share text ready.',
    portfolioShareTitle: '{name} portfolio: {netWorth}',
    portfolioShareText:
      'My Mentavio portfolio is {netWorth}. Open PnL: {pnl}.',
  },
  ru: {
    language: 'Ð¯Ð·Ñ‹Ðº',
    navMarket: 'Ð Ñ‹Ð½Ð¾Ðº',
    navIntel: 'ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ°',
    navTrades: 'Ð¡Ð´ÐµÐ»ÐºÐ¸',
    navNews: 'ÐÐ¾Ð²Ð¾ÑÑ‚Ð¸',
    navPortfolio: 'ÐŸÐ¾Ñ€Ñ‚Ñ„ÐµÐ»ÑŒ',
    navStore: 'ÐœÐ°Ð³Ð°Ð·Ð¸Ð½',
    navAuth: 'ÐÐºÐºÐ°ÑƒÐ½Ñ‚',
    brand: 'Mentavio',
    intelTitle: 'ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ñ€Ñ‹Ð½ÐºÐ°',
    tradesTitle: 'ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ ÑÐ´ÐµÐ»ÐºÐ¸',
    portfolioTitle: 'ÐŸÐ¾Ñ€Ñ‚Ñ„ÐµÐ»ÑŒ',
    storeTitle: 'ÐœÐ°Ð³Ð°Ð·Ð¸Ð½',
    signals: 'Ð¡Ð¸Ð³Ð½Ð°Ð»Ñ‹',
    tradingSignals: 'Ð¢Ð¾Ñ€Ð³Ð¾Ð²Ñ‹Ðµ ÑÐ¸Ð³Ð½Ð°Ð»Ñ‹',
    marketChart: 'Ð“Ñ€Ð°Ñ„Ð¸Ðº Ñ€Ñ‹Ð½ÐºÐ°',
    priceMap: 'ÐšÐ°Ñ€Ñ‚Ð° Ñ†ÐµÐ½',
    chartChange: 'Ð˜Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ %',
    marketOpen: 'Ð Ñ‹Ð½Ð¾Ðº Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚',
    closesIn: 'Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ñ‡ÐµÑ€ÐµÐ·',
    tape: 'Ð›ÐµÐ½Ñ‚Ð°',
    tradeTape: 'Ð›ÐµÐ½Ñ‚Ð° ÑÐ´ÐµÐ»Ð¾Ðº',
    noHistory:
      'Ð¡Ð´ÐµÐ»Ð¾Ðº Ð¿Ð¾ÐºÐ° Ð½ÐµÑ‚. Ð‘Ð¾Ñ‚Ñ‹ Ñ€Ð°Ð·Ð¾Ð³Ñ€ÐµÐ²Ð°ÑŽÑ‚ Ñ€Ñ‹Ð½Ð¾Ðº.',
    offers: 'ÐŸÑ€ÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ',
    currency: 'Ð¢Ð¾ÐºÐµÐ½Ñ‹',
    customCash: 'Ð”ÐµÐ½ÑŒÐ³Ð¸ ÑÐµÑÑÐ¸Ð¸',
    gameCash: 'Ð˜Ð³Ñ€Ð¾Ð²Ñ‹Ðµ Ð´ÐµÐ½ÑŒÐ³Ð¸',
    buyCash: 'ÐÐ°Ñ‡Ð°Ñ‚ÑŒ ÑÐµÑÑÐ¸ÑŽ',
    customCashNote:
      'Ð˜Ð³Ñ€Ð¾Ð²Ñ‹Ðµ Ð´ÐµÐ½ÑŒÐ³Ð¸ Ð¿Ñ€Ð¸Ð½Ð°Ð´Ð»ÐµÐ¶Ð°Ñ‚ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¾Ð´Ð½Ð¾Ð¹ ÑÐµÑÑÐ¸Ð¸ Ð¸ Ð½Ðµ Ð¿Ñ€Ð¾Ð´Ð°ÑŽÑ‚ÑÑ Ð½Ð°Ð¿Ñ€ÑÐ¼ÑƒÑŽ.',
    cashPurchaseRecorded: 'Ð¡ÐµÑÑÐ¸Ñ Ð½Ð°Ñ‡Ð°Ñ‚Ð° Ñ Ð±Ð°Ð»Ð°Ð½ÑÐ¾Ð¼: {amount}',
    noPositions: 'ÐŸÐ¾Ð·Ð¸Ñ†Ð¸Ð¹ Ð¿Ð¾ÐºÐ° Ð½ÐµÑ‚',
    noPlayer: 'Ð˜Ð³Ñ€Ð¾Ðº Ð½Ðµ Ð²Ñ‹Ð±Ñ€Ð°Ð½',
    createPlayerFirst:
      'Ð¡Ð½Ð°Ñ‡Ð°Ð»Ð° ÑÐ¾Ð·Ð´Ð°Ð¹Ñ‚Ðµ Ð¸Ð³Ñ€Ð¾ÐºÐ° Ð½Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ðµ Ñ€Ñ‹Ð½ÐºÐ°',
    verifiedAccountRequired:
      'ÐŸÐµÑ€ÐµÐ´ Ð¿Ð¾ÐºÑƒÐ¿ÐºÐ¾Ð¹ Ð²Ð°Ð»ÑŽÑ‚Ñ‹ Ð·Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€ÑƒÐ¹Ñ‚ÐµÑÑŒ Ð¸ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð´Ð¸Ñ‚Ðµ email',
    portfolioUpdated: 'ÐŸÐ¾Ñ€Ñ‚Ñ„ÐµÐ»ÑŒ Ð¾Ð±Ð½Ð¾Ð²Ð»Ñ‘Ð½',
    marketIntelUpdated: 'ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ° Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð°',
    tradeTapeUpdated: 'Ð›ÐµÐ½Ñ‚Ð° ÑÐ´ÐµÐ»Ð¾Ðº Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð°',
    storeLoaded: 'ÐœÐ°Ð³Ð°Ð·Ð¸Ð½ Ð·Ð°Ð³Ñ€ÑƒÐ¶ÐµÐ½',
    purchaseRecorded: 'Ð¢Ð¾ÐºÐµÐ½Ñ‹ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ñ‹: {amount}',
    buyPressure: 'Ð”Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿Ð¾ÐºÑƒÐ¿Ð¾Ðº',
    support: 'ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ°',
    companyProfile: 'ÐŸÑ€Ð¾Ñ„Ð¸Ð»ÑŒ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸',
    sector: 'Ð¡ÐµÐºÑ‚Ð¾Ñ€',
    owner: 'Ð’Ð»Ð°Ð´ÐµÐ»ÐµÑ†',
    workers: 'Ð Ð°Ð±Ð¾Ñ‚Ð½Ð¸ÐºÐ¸',
    opened: 'ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ð°',
    governmentSupport: 'Ð“Ð¾ÑÐ¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ°',
    noSupport: 'ÐÐµÑ‚ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾Ð¹ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸',
    amount: 'Ð¡ÑƒÐ¼Ð¼Ð°',
    tax: 'ÐÐ°Ð»Ð¾Ð³',
    loan: 'ÐšÑ€ÐµÐ´Ð¸Ñ‚',
    until: 'Ð”Ð¾',
    risk: 'Ð Ð¸ÑÐº',
    tokens: 'Ñ‚Ð¾ÐºÐµÐ½Ð¾Ð²',
    symbol: 'Ð¢Ð¸ÐºÐµÑ€',
    trader: 'Ð¢Ñ€ÐµÐ¹Ð´ÐµÑ€',
    side: 'Ð¡Ñ‚Ð¾Ñ€Ð¾Ð½Ð°',
    qty: 'ÐšÐ¾Ð»-Ð²Ð¾',
    price: 'Ð¦ÐµÐ½Ð°',
    value: 'Ð¡ÑƒÐ¼Ð¼Ð°',
    avg: 'Ð¡Ñ€ÐµÐ´Ð½ÑÑ',
    pnl: 'ÐŸÑ€Ð¸Ð±./ÑƒÐ±Ñ‹Ñ‚Ð¾Ðº',
    cash: 'ÐšÑÑˆ',
    positions: 'ÐŸÐ¾Ð·Ð¸Ñ†Ð¸Ð¸',
    credits: 'Ð¢Ð¾ÐºÐµÐ½Ñ‹',
    netWorth: 'ÐšÐ°Ð¿Ð¸Ñ‚Ð°Ð»',
    nextTick: 'Ð¡Ð»ÐµÐ´. Ñ‚Ð¸Ðº',
  },
  he: {
    language: '×©×¤×”',
    navMarket: '×©×•×§',
    navIntel: '×ž×•×“×™×¢×™×Ÿ',
    navTrades: '×¢×¡×§××•×ª',
    navNews: '×—×“×©×•×ª',
    navPortfolio: '×ª×™×§',
    navStore: '×—× ×•×ª',
    navAuth: '×—×©×‘×•×Ÿ',
    brand: 'Mentavio',
    intelTitle: '×ž×•×“×™×¢×™×Ÿ ×©×•×§',
    tradesTitle: '×¢×¡×§××•×ª ××—×¨×•× ×•×ª',
    portfolioTitle: '×ª×™×§',
    storeTitle: '×—× ×•×ª',
    signals: '××•×ª×•×ª',
    tradingSignals: '××•×ª×•×ª ×ž×¡×—×¨',
    marketChart: '×’×¨×£ ×©×•×§',
    priceMap: '×ž×¤×ª ×ž×—×™×¨×™×',
    chartChange: '×©×™× ×•×™ %',
    marketOpen: '×”×©×•×§ ×¤×ª×•×—',
    closesIn: '× ×¡×’×¨ ×‘×¢×•×“',
    tape: '×¨×¦×•×¢×”',
    tradeTape: '×¨×¦×•×¢×ª ×¢×¡×§××•×ª',
    noHistory:
      '×¢×“×™×™×Ÿ ××™×Ÿ ×¢×¡×§××•×ª. ×”×‘×•×˜×™× ×ž×—×ž×ž×™× ××ª ×”×©×•×§.',
    offers: '×”×¦×¢×•×ª',
    currency: '×ž×˜×‘×¢',
    customCash: '×¡×›×•× ×ž×•×ª××',
    gameCash: '×›×¡×£ ×ž×©×—×§',
    buyCash: '×§× ×” ×›×¡×£',
    customCashNote:
      '×¨×›×™×©×” ×ž×“×•×ž×”. × ×™×ª×Ÿ ×œ×—×‘×¨ ×ª×©×œ×•×ž×™× ××ž×™×ª×™×™× ×‘×”×ž×©×š.',
    cashPurchaseRecorded: '× ×¨×›×© ×›×¡×£ ×ž×©×—×§: {amount}',
    noPositions: '××™×Ÿ ×¢×“×™×™×Ÿ ×¤×•×–×™×¦×™×•×ª',
    noPlayer: '××™×Ÿ ×©×—×§×Ÿ',
    createPlayerFirst: '×¦×•×¨ ×©×—×§×Ÿ ×‘×¢×ž×•×“ ×”×©×•×§ ×ª×—×™×œ×”',
    verifiedAccountRequired:
      '×™×© ×œ×”×™×¨×©× ×•×œ××ž×ª ××™×ž×™×™×œ ×œ×¤× ×™ ×§× ×™×™×ª ×ž×˜×‘×¢',
    portfolioUpdated: '×”×ª×™×§ ×¢×•×“×›×Ÿ',
    marketIntelUpdated: '×ž×•×“×™×¢×™×Ÿ ×”×©×•×§ ×¢×•×“×›×Ÿ',
    tradeTapeUpdated: '×¨×¦×•×¢×ª ×”×¢×¡×§××•×ª ×¢×•×“×›× ×”',
    storeLoaded: '×”×—× ×•×ª × ×˜×¢× ×”',
    purchaseRecorded: '× ×•×¡×¤×• ×˜×•×§× ×™×: {amount}',
    buyPressure: '×œ×—×¥ ×§× ×™×™×”',
    support: '×ª×ž×™×›×”',
    companyProfile: '×¤×¨×•×¤×™×œ ×—×‘×¨×”',
    sector: '×¡×§×˜×•×¨',
    owner: '×‘×¢×œ×™×',
    workers: '×¢×•×‘×“×™×',
    opened: '× ×¤×ª×—×”',
    governmentSupport: '×ª×ž×™×›×ª ×ž×“×™× ×”',
    noSupport: '××™×Ÿ ×ª×ž×™×›×” ×¤×¢×™×œ×”',
    amount: '×¡×›×•×',
    tax: '×ž×¡',
    loan: '×”×œ×•×•××”',
    until: '×¢×“',
    risk: '×¡×™×›×•×Ÿ',
    tokens: '×˜×•×§× ×™×',
    symbol: '×¡×™×ž×•×œ',
    trader: '×¡×•×—×¨',
    side: '×¦×“',
    qty: '×›×ž×•×ª',
    price: '×ž×—×™×¨',
    value: '×©×•×•×™',
    avg: '×ž×ž×•×¦×¢',
    pnl: '×¨×•×•×—/×”×¤×¡×“',
    cash: '×ž×–×•×ž×Ÿ',
    positions: '×¤×•×–×™×¦×™×•×ª',
    credits: '×˜×•×§× ×™×',
    netWorth: '×©×•×•×™ ×›×•×œ×œ',
    nextTick: '×˜×™×§ ×”×‘×',
  },
  de: {
    language: 'Sprache',
    navMarket: 'Markt',
    navIntel: 'Analyse',
    navTrades: 'Transaktionen',
    navNews: 'Nachrichten',
    navPortfolio: 'Depot',
    navStore: 'Shop',
    navAuth: 'Konto',
    brand: 'Mentavio',
    intelTitle: 'Marktanalyse',
    tradesTitle: 'Letzte Trades',
    portfolioTitle: 'Depot',
    storeTitle: 'Shop',
    signals: 'Signale',
    tradingSignals: 'Trading-Signale',
    marketChart: 'Marktchart',
    priceMap: 'Preiskarte',
    chartChange: 'Ã„nderung %',
    marketOpen: 'Markt offen',
    closesIn: 'SchlieÃŸt in',
    tape: 'Band',
    tradeTape: 'Trade-Band',
    noHistory: 'Noch keine Transaktionen. Bot-HÃ¤ndler starten den Markt.',
    offers: 'Angebote',
    currency: 'WÃ¤hrung',
    customCash: 'Eigener Betrag',
    gameCash: 'Spielgeld',
    buyCash: 'Geld kaufen',
    customCashNote:
      'Simulierter Kauf. Echte Zahlungen kÃ¶nnen spÃ¤ter verbunden werden.',
    cashPurchaseRecorded: 'Simuliertes Geld gekauft: {amount}',
    noPositions: 'Noch keine Positionen',
    noPlayer: 'Kein Spieler',
    createPlayerFirst: 'Erstelle zuerst einen Spieler auf der Marktseite',
    verifiedAccountRequired:
      'Registriere dich und bestÃ¤tige die E-Mail vor dem WÃ¤hrungskauf',
    portfolioUpdated: 'Portfolio aktualisiert',
    marketIntelUpdated: 'Marktanalyse aktualisiert',
    tradeTapeUpdated: 'Trade-Band aktualisiert',
    storeLoaded: 'Shop geladen',
    purchaseRecorded: 'Token hinzugefÃ¼gt: {amount}',
    buyPressure: 'Kaufdruck',
    support: 'UnterstÃ¼tzung',
    companyProfile: 'Firmenprofil',
    sector: 'Sektor',
    owner: 'EigentÃ¼mer',
    workers: 'Mitarbeiter',
    opened: 'GegrÃ¼ndet',
    governmentSupport: 'Staatliche UnterstÃ¼tzung',
    noSupport: 'Keine aktive UnterstÃ¼tzung',
    amount: 'Betrag',
    tax: 'Steuer',
    loan: 'Kredit',
    until: 'Bis',
    risk: 'Risiko',
    tokens: 'Token',
    symbol: 'Ticker',
    trader: 'HÃ¤ndler',
    side: 'Seite',
    qty: 'Menge',
    price: 'Preis',
    value: 'Wert',
    avg: 'Durchschn.',
    pnl: 'Gewinn/Verlust',
    cash: 'Bargeld',
    positions: 'Positionen',
    credits: 'Token',
    netWorth: 'NettovermÃ¶gen',
    nextTick: 'NÃ¤chster Tick',
  },
  fr: {
    language: 'Langue',
    navMarket: 'MarchÃ©',
    navIntel: 'Analyse',
    navTrades: 'Transactions',
    navNews: 'Infos',
    navPortfolio: 'Portefeuille',
    navStore: 'Boutique',
    navAuth: 'Compte',
    brand: 'Mentavio',
    intelTitle: 'Analyse du marchÃ©',
    tradesTitle: 'Trades rÃ©cents',
    portfolioTitle: 'Portefeuille',
    storeTitle: 'Boutique',
    signals: 'Signaux',
    tradingSignals: 'Signaux de trading',
    marketChart: 'Graphique du marchÃ©',
    priceMap: 'Carte des prix',
    chartChange: 'Variation %',
    marketOpen: 'MarchÃ© ouvert',
    closesIn: 'Ferme dans',
    tape: 'Ruban',
    tradeTape: 'Ruban des trades',
    noHistory:
      'Aucune transaction pour le moment. Les bots animent le marchÃ©.',
    offers: 'Offres',
    currency: 'Devise',
    customCash: 'Montant libre',
    gameCash: 'Argent du jeu',
    buyCash: 'Acheter',
    customCashNote:
      'Achat simulÃ©. Les vrais paiements peuvent Ãªtre connectÃ©s plus tard.',
    cashPurchaseRecorded: 'Argent de jeu achetÃ© : {amount}',
    noPositions: 'Aucune position',
    noPlayer: 'Aucun joueur',
    createPlayerFirst: 'CrÃ©ez dâ€™abord un joueur sur la page MarchÃ©',
    verifiedAccountRequired:
      'Inscrivez-vous et confirmez lâ€™email avant dâ€™acheter de la monnaie',
    portfolioUpdated: 'Portefeuille mis Ã  jour',
    marketIntelUpdated: 'Analyse mise Ã  jour',
    tradeTapeUpdated: 'Ruban des trades mis Ã  jour',
    storeLoaded: 'Boutique chargÃ©e',
    purchaseRecorded: 'Jetons ajoutÃ©s : {amount}',
    buyPressure: 'Pression acheteuse',
    support: 'Soutien',
    companyProfile: 'Profil sociÃ©tÃ©',
    sector: 'Secteur',
    owner: 'PropriÃ©taire',
    workers: 'EmployÃ©s',
    opened: 'CrÃ©Ã©e',
    governmentSupport: 'Soutien public',
    noSupport: 'Aucun soutien actif',
    amount: 'Montant',
    tax: 'ImpÃ´t',
    loan: 'CrÃ©dit',
    until: 'Jusquâ€™Ã ',
    risk: 'Risque',
    tokens: 'jetons',
    symbol: 'Symbole',
    trader: 'OpÃ©rateur',
    side: 'CÃ´tÃ©',
    qty: 'QtÃ©',
    price: 'Prix',
    value: 'Valeur',
    avg: 'Moy.',
    pnl: 'Gain/perte',
    cash: 'LiquiditÃ©s',
    positions: 'Lignes',
    credits: 'Jetons',
    netWorth: 'Valeur nette',
    nextTick: 'Prochain tick',
  },
};

const pageDataText = {
  signals: {
    'Thin history': {
      ru: 'ÐœÐ°Ð»Ð¾ Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸',
      he: '×”×™×¡×˜×•×¨×™×” ×“×§×”',
      de: 'DÃ¼nne Historie',
      fr: 'Historique limitÃ©',
    },
    Momentum: {
      ru: 'Ð˜Ð¼Ð¿ÑƒÐ»ÑŒÑ',
      he: '×ž×•×ž× ×˜×•×',
      de: 'Momentum',
      fr: 'Momentum',
    },
    Caution: {
      ru: 'ÐžÑÑ‚Ð¾Ñ€Ð¾Ð¶Ð½Ð¾',
      he: '×–×”×™×¨×•×ª',
      de: 'Vorsicht',
      fr: 'Prudence',
    },
    Accumulation: {
      ru: 'ÐÐ°ÐºÐ¾Ð¿Ð»ÐµÐ½Ð¸Ðµ',
      he: '×¦×‘×™×¨×”',
      de: 'Akkumulation',
      fr: 'Accumulation',
    },
    Distribution: {
      ru: 'Ð Ð°ÑÐ¿Ñ€ÐµÐ´ÐµÐ»ÐµÐ½Ð¸Ðµ',
      he: '×¤×™×–×•×¨',
      de: 'Distribution',
      fr: 'Distribution',
    },
    Balanced: {
      ru: 'Ð‘Ð°Ð»Ð°Ð½Ñ',
      he: '×ž××•×–×Ÿ',
      de: 'Ausgewogen',
      fr: 'Ã‰quilibrÃ©',
    },
    'State-backed': {
      ru: 'ÐŸÐ¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ° Ð³Ð¾ÑÑƒÐ´Ð°Ñ€ÑÑ‚Ð²Ð°',
      he: '× ×ª×ž×š ×ž×“×™× ×”',
      de: 'Staatlich gestÃ¼tzt',
      fr: 'Soutenu par lâ€™Ã‰tat',
    },
  },
  offers: {
    'Starter Pack': {
      ru: '????????? ?????',
      he: '????? ?????',
      de: 'Starter-Paket',
      fr: 'Pack de départ',
    },
    'Adds 250 permanent tokens to the verified account.': {
      ru: '????????? 250 ?????????? ??????? ?? ?????????????? ???????.',
      he: '????? 250 ?????? ?????? ?????? ?????.',
      de: 'Fügt dem bestätigten Konto 250 dauerhafte Token hinzu.',
      fr: 'Ajoute 250 jetons permanents au compte vérifié.',
    },
    'Trader Pack': {
      ru: '????? ????????',
      he: '????? ????',
      de: 'Trader-Paket',
      fr: 'Pack trader',
    },
    'Adds 800 permanent tokens for sessions, modes, and future features.': {
      ru: '????????? 800 ?????????? ??????? ??? ??????, ??????? ? ??????? ???????.',
      he: '????? 800 ?????? ?????? ??????, ????? ??????? ???????.',
      de: 'Fügt 800 dauerhafte Token für Sitzungen, Modi und künftige Funktionen hinzu.',
      fr: 'Ajoute 800 jetons permanents pour les sessions, modes et futures fonctions.',
    },
    'Investor Pack': {
      ru: '????? ?????????',
      he: '????? ?????',
      de: 'Investor-Paket',
      fr: 'Pack investisseur',
    },
    'Adds 2,200 permanent tokens for premium progression.': {
      ru: '????????? 2 200 ?????????? ??????? ??? ???????????? ?????????.',
      he: '????? 2,200 ?????? ?????? ???????? ???????.',
      de: 'Fügt 2.200 dauerhafte Token für Premium-Fortschritt hinzu.',
      fr: 'Ajoute 2 200 jetons permanents pour la progression premium.',
    },
  },
  sides: {
    buy: {
      en: 'BUY',
      ru: 'ÐšÑƒÐ¿Ð¸Ñ‚ÑŒ',
      he: '×§× ×™×™×”',
      de: 'Kauf',
      fr: 'Achat',
    },
    sell: {
      en: 'SELL',
      ru: 'ÐŸÑ€Ð¾Ð´Ð°Ñ‚ÑŒ',
      he: '×ž×›×™×¨×”',
      de: 'Verkauf',
      fr: 'Vente',
    },
  },
  sectors: {
    AI: { ru: 'Ð˜Ð˜', he: '×‘×™× ×” ×ž×œ××›×•×ª×™×ª', de: 'KI', fr: 'IA' },
    Energy: {
      ru: 'Ð­Ð½ÐµÑ€Ð³ÐµÑ‚Ð¸ÐºÐ°',
      he: '×× ×¨×’×™×”',
      de: 'Energie',
      fr: 'Ã‰nergie',
    },
    Healthcare: {
      ru: 'Ð—Ð´Ñ€Ð°Ð²Ð¾Ð¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ð¸Ðµ',
      he: '×‘×¨×™××•×ª',
      de: 'Gesundheit',
      fr: 'SantÃ©',
    },
    Gaming: { ru: 'Ð˜Ð³Ñ€Ñ‹', he: '×ž×©×—×§×™×', de: 'Gaming', fr: 'Jeux' },
    Aerospace: {
      ru: 'ÐÑÑ€Ð¾ÐºÐ¾ÑÐ¼Ð¾Ñ',
      he: '×ª×¢×•×¤×” ×•×—×œ×œ',
      de: 'Luft- und Raumfahrt',
      fr: 'AÃ©rospatial',
    },
    Agriculture: {
      ru: 'Ð¡ÐµÐ»ÑŒÑÐºÐ¾Ðµ Ñ…Ð¾Ð·ÑÐ¹ÑÑ‚Ð²Ð¾',
      he: '×—×§×œ××•×ª',
      de: 'Landwirtschaft',
      fr: 'Agriculture',
    },
    Fintech: {
      ru: 'Ð¤Ð¸Ð½Ñ‚ÐµÑ…',
      he: '×¤×™× ×˜×§',
      de: 'Fintech',
      fr: 'Fintech',
    },
    Education: {
      ru: 'ÐžÐ±Ñ€Ð°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ',
      he: '×—×™× ×•×š',
      de: 'Bildung',
      fr: 'Ã‰ducation',
    },
    Cybersecurity: {
      ru: 'ÐšÐ¸Ð±ÐµÑ€Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ',
      he: '×¡×™×™×‘×¨',
      de: 'Cybersicherheit',
      fr: 'CybersÃ©curitÃ©',
    },
    Logistics: {
      ru: 'Ð›Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÐ°',
      he: '×œ×•×’×™×¡×˜×™×§×”',
      de: 'Logistik',
      fr: 'Logistique',
    },
    Manufacturing: {
      ru: 'ÐŸÑ€Ð¾Ð¸Ð·Ð²Ð¾Ð´ÑÑ‚Ð²Ð¾',
      he: '×™×™×¦×•×¨',
      de: 'Produktion',
      fr: 'Industrie',
    },
    Consumer: {
      ru: 'ÐŸÐ¾Ñ‚Ñ€ÐµÐ±Ð¸Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÑÐµÐºÑ‚Ð¾Ñ€',
      he: '×¦×¨×›× ×•×ª',
      de: 'Konsum',
      fr: 'Consommation',
    },
  },
  supportTypes: {
    none: { ru: 'Ð½ÐµÑ‚', he: '××™×Ÿ', de: 'keine', fr: 'aucun' },
    'R&D grant': {
      ru: 'Ð“Ñ€Ð°Ð½Ñ‚ Ð½Ð° Ð¸ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ð½Ð¸Ñ',
      he: '×ž×¢× ×§ ×ž×•"×¤',
      de: 'Forschungszuschuss',
      fr: 'Subvention R&D',
    },
    'Green energy tax credit': {
      ru: 'ÐÐ°Ð»Ð¾Ð³Ð¾Ð²Ð°Ñ Ð»ÑŒÐ³Ð¾Ñ‚Ð° Ð½Ð° Ð·ÐµÐ»Ñ‘Ð½ÑƒÑŽ ÑÐ½ÐµÑ€Ð³Ð¸ÑŽ',
      he: '×–×™×›×•×™ ×ž×¡ ×œ×× ×¨×’×™×” ×™×¨×•×§×”',
      de: 'Steuergutschrift fÃ¼r grÃ¼ne Energie',
      fr: 'CrÃ©dit dâ€™impÃ´t Ã©nergie verte',
    },
    'Health innovation grant': {
      ru: 'Ð“Ñ€Ð°Ð½Ñ‚ Ð½Ð° Ð¼ÐµÐ´Ð¸Ñ†Ð¸Ð½ÑÐºÐ¸Ðµ Ð¸Ð½Ð½Ð¾Ð²Ð°Ñ†Ð¸Ð¸',
      he: '×ž×¢× ×§ ×—×“×©× ×•×ª ×‘×¨×™××•×ª',
      de: 'Zuschuss fÃ¼r Gesundheitsinnovation',
      fr: 'Subvention innovation santÃ©',
    },
    'Defense supplier credit line': {
      ru: 'ÐšÑ€ÐµÐ´Ð¸Ñ‚Ð½Ð°Ñ Ð»Ð¸Ð½Ð¸Ñ Ð¾Ð±Ð¾Ñ€Ð¾Ð½Ð½Ð¾Ð³Ð¾ Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ°',
      he: '×§×• ××©×¨××™ ×œ×¡×¤×§ ×‘×™×˜×—×•× ×™',
      de: 'Kreditlinie fÃ¼r Verteidigungslieferant',
      fr: 'Ligne de crÃ©dit fournisseur dÃ©fense',
    },
    'Food security subsidy': {
      ru: 'Ð¡ÑƒÐ±ÑÐ¸Ð´Ð¸Ñ Ð¿Ñ€Ð¾Ð´Ð¾Ð²Ð¾Ð»ÑŒÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ð¹ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚Ð¸',
      he: '×¡×‘×¡×•×“ ×‘×™×˜×—×•×Ÿ ×ž×–×•×Ÿ',
      de: 'Subvention fÃ¼r ErnÃ¤hrungssicherheit',
      fr: 'Subvention sÃ©curitÃ© alimentaire',
    },
    'Education modernization tender': {
      ru: 'Ð¢ÐµÐ½Ð´ÐµÑ€ Ð¼Ð¾Ð´ÐµÑ€Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸ Ð¾Ð±Ñ€Ð°Ð·Ð¾Ð²Ð°Ð½Ð¸Ñ',
      he: '×ž×›×¨×– ×ž×•×“×¨× ×™×–×¦×™×™×ª ×—×™× ×•×š',
      de: 'Ausschreibung Bildungsmodernisierung',
      fr: 'Appel dâ€™offres modernisation Ã©ducation',
    },
    'Critical infrastructure contract': {
      ru: 'ÐšÐ¾Ð½Ñ‚Ñ€Ð°ÐºÑ‚ ÐºÑ€Ð¸Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¾Ð¹ Ð¸Ð½Ñ„Ñ€Ð°ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñ‹',
      he: '×—×•×–×” ×ª×©×ª×™×ª ×§×¨×™×˜×™×ª',
      de: 'Vertrag fÃ¼r kritische Infrastruktur',
      fr: 'Contrat infrastructure critique',
    },
    'Port logistics loan': {
      ru: 'ÐšÑ€ÐµÐ´Ð¸Ñ‚ Ð½Ð° Ð¿Ð¾Ñ€Ñ‚Ð¾Ð²ÑƒÑŽ Ð»Ð¾Ð³Ð¸ÑÑ‚Ð¸ÐºÑƒ',
      he: '×”×œ×•×•××ª ×œ×•×’×™×¡×˜×™×§×ª × ×ž×œ×™×',
      de: 'Kredit fÃ¼r Hafenlogistik',
      fr: 'PrÃªt logistique portuaire',
    },
    'Manufacturing tax relief': {
      ru: 'ÐÐ°Ð»Ð¾Ð³Ð¾Ð²Ð°Ñ Ð»ÑŒÐ³Ð¾Ñ‚Ð° Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð¸Ð·Ð²Ð¾Ð´ÑÑ‚Ð²Ð°',
      he: '×”×§×œ×ª ×ž×¡ ×œ×™×™×¦×•×¨',
      de: 'Steuererleichterung Produktion',
      fr: 'AllÃ¨gement fiscal industriel',
    },
  },
  risks: {
    none: { ru: 'Ð½ÐµÑ‚', he: '××™×Ÿ', de: 'kein', fr: 'aucun' },
    low: { ru: 'Ð½Ð¸Ð·ÐºÐ¸Ð¹', he: '× ×ž×•×š', de: 'niedrig', fr: 'faible' },
    medium: {
      ru: 'ÑÑ€ÐµÐ´Ð½Ð¸Ð¹',
      he: '×‘×™× ×•× ×™',
      de: 'mittel',
      fr: 'moyen',
    },
    high: { ru: 'Ð²Ñ‹ÑÐ¾ÐºÐ¸Ð¹', he: '×’×‘×•×”', de: 'hoch', fr: 'Ã©levÃ©' },
  },
};

const fixedPageTranslations = {
  ru: {
    language: 'Язык',
    navMarket: 'Рынок',
    navIntel: 'Аналитика',
    navTrades: 'Сделки',
    navNews: 'Новости',
    navPortfolio: 'Портфель',
    navStore: 'Магазин',
    navAuth: 'Аккаунт',
    brand: 'Mentavio',
    intelTitle: 'Аналитика рынка',
    tradesTitle: 'Последние сделки',
    portfolioTitle: 'Портфель',
    storeTitle: 'Магазин',
    signals: 'Сигналы',
    tradingSignals: 'Торговые сигналы',
    marketChart: 'График рынка',
    priceMap: 'Карта цен',
    chartChange: 'Изменение %',
    marketOpen: 'Рынок открыт',
    closesIn: 'Закрытие через',
    tape: 'Лента',
    tradeTape: 'Лента сделок',
    noHistory: 'Сделок пока нет. Боты разогревают рынок.',
    offers: 'Предложения',
    currency: 'Токены',
    customCash: 'Деньги сессии',
    gameCash: 'Игровые деньги',
    buyCash: 'Начать сессию',
    customCashNote:
      'Игровые деньги принадлежат только одной сессии и не продаются напрямую.',
    cashPurchaseRecorded: 'Сессия начата с балансом: {amount}',
    noPositions: 'Позиций пока нет',
    noPlayer: 'Игрок не выбран',
    createPlayerFirst: 'Сначала создайте игрока на странице рынка',
    verifiedAccountRequired:
      'Перед покупкой токенов зарегистрируйтесь и подтвердите email',
    portfolioUpdated: 'Портфель обновлен',
    marketIntelUpdated: 'Аналитика обновлена',
    tradeTapeUpdated: 'Лента сделок обновлена',
    storeLoaded: 'Магазин загружен',
    purchaseRecorded: 'Токены добавлены: {amount}',
    buyPressure: 'Давление покупок',
    support: 'Поддержка',
    companyProfile: 'Профиль компании',
    sector: 'Сектор',
    owner: 'Владелец',
    workers: 'Работники',
    opened: 'Открыта',
    governmentSupport: 'Господдержка',
    noSupport: 'Нет активной поддержки',
    amount: 'Сумма',
    tax: 'Налог',
    loan: 'Кредит',
    until: 'До',
    risk: 'Риск',
    tokens: 'токенов',
    symbol: 'Тикер',
    trader: 'Трейдер',
    side: 'Сторона',
    qty: 'Кол-во',
    price: 'Цена',
    value: 'Сумма',
    avg: 'Средняя',
    pnl: 'Приб./убыток',
    cash: 'Кэш',
    positions: 'Позиции',
    credits: 'Токены',
    netWorth: 'Капитал',
    nextTick: 'След. тик',
    quickTrade: 'Быстрая сделка',
    buyOrSell: 'Купить или продать',
    availableCash: 'Доступные деньги',
    selectCompany: 'Выберите компанию',
    company: 'Компания',
    quantity: 'Количество',
    buy: 'Купить',
    sell: 'Продать',
    owned: 'В портфеле',
    placeOrder: 'Разместить заявку',
    orderPlaced: 'Заявка выполнена: {side} {quantity} {symbol}',
    accountWallet: 'Кошелек аккаунта',
    permanentTokens: 'Постоянные токены',
    walletCopy: 'Токены сохраняются в аккаунте между всеми игровыми сессиями.',
    tokenBalance: 'Баланс токенов',
    tokenPacks: 'Пакеты токенов',
    buyTokens: 'Купить токены',
    paymentNote:
      'Тестовые покупки имитируются до подключения безопасной оплаты.',
    sessionFunding: 'Финансирование сессии',
    useTokensForCash: 'Обменять токены на игровые деньги',
    sessionFundingNote:
      'Новая сессия заменяет текущие деньги и все позиции.',
    free: 'Бесплатно',
    startSession: 'Начать сессию',
    sessionConfirm:
      'Начать новую сессию с балансом {amount}? Текущие деньги и позиции будут заменены.',
    shareResult: 'Поделиться результатом',
    shareReady: 'Результат готов для отправки.',
    portfolioShareTitle: 'Портфель {name}: {netWorth}',
    portfolioShareText:
      'Мой портфель Mentavio: {netWorth}. Открытая прибыль: {pnl}.',
  },
  he: {
    language: 'שפה',
    navMarket: 'שוק',
    navIntel: 'מודיעין',
    navTrades: 'עסקאות',
    navNews: 'חדשות',
    navPortfolio: 'תיק',
    navStore: 'חנות',
    navAuth: 'חשבון',
    brand: 'Mentavio',
    intelTitle: 'מודיעין שוק',
    tradesTitle: 'עסקאות אחרונות',
    portfolioTitle: 'תיק',
    storeTitle: 'חנות',
    signals: 'אותות',
    tradingSignals: 'אותות מסחר',
    marketChart: 'גרף שוק',
    priceMap: 'מפת מחירים',
    chartChange: 'שינוי %',
    marketOpen: 'השוק פתוח',
    closesIn: 'נסגר בעוד',
    tape: 'רצועה',
    tradeTape: 'רצועת עסקאות',
    noHistory: 'אין עדיין עסקאות. הבוטים מחממים את השוק.',
    offers: 'הצעות',
    currency: 'טוקנים',
    customCash: 'כסף סשן',
    gameCash: 'כסף משחק',
    buyCash: 'התחל סשן',
    customCashNote: 'כסף משחק שייך רק לסשן אחד ואינו נמכר ישירות.',
    cashPurchaseRecorded: 'הסשן התחיל עם יתרה: {amount}',
    noPositions: 'אין עדיין פוזיציות',
    noPlayer: 'אין שחקן',
    createPlayerFirst: 'צור קודם שחקן בעמוד השוק',
    verifiedAccountRequired: 'יש להירשם ולאמת אימייל לפני קניית טוקנים',
    portfolioUpdated: 'התיק עודכן',
    marketIntelUpdated: 'מודיעין השוק עודכן',
    tradeTapeUpdated: 'רצועת העסקאות עודכנה',
    storeLoaded: 'החנות נטענה',
    purchaseRecorded: 'נוספו טוקנים: {amount}',
    buyPressure: 'לחץ קנייה',
    support: 'תמיכה',
    companyProfile: 'פרופיל חברה',
    sector: 'סקטור',
    owner: 'בעלים',
    workers: 'עובדים',
    opened: 'נפתחה',
    governmentSupport: 'תמיכת מדינה',
    noSupport: 'אין תמיכה פעילה',
    amount: 'סכום',
    tax: 'מס',
    loan: 'הלוואה',
    until: 'עד',
    risk: 'סיכון',
    tokens: 'טוקנים',
    symbol: 'סימול',
    trader: 'סוחר',
    side: 'צד',
    qty: 'כמות',
    price: 'מחיר',
    value: 'שווי',
    avg: 'ממוצע',
    pnl: 'רווח/הפסד',
    cash: 'מזומן',
    positions: 'פוזיציות',
    credits: 'טוקנים',
    netWorth: 'שווי כולל',
    nextTick: 'טיק הבא',
    quickTrade: 'מסחר מהיר',
    buyOrSell: 'קנייה או מכירה',
    availableCash: 'מזומן זמין',
    selectCompany: 'בחרו חברה',
    company: 'חברה',
    quantity: 'כמות',
    buy: 'קנייה',
    sell: 'מכירה',
    owned: 'בבעלות',
    placeOrder: 'שליחת הוראה',
    orderPlaced: 'ההוראה בוצעה: {side} {quantity} {symbol}',
    accountWallet: 'ארנק החשבון',
    permanentTokens: 'טוקנים קבועים',
    walletCopy: 'הטוקנים נשמרים בחשבון בין כל סשני המשחק.',
    tokenBalance: 'יתרת טוקנים',
    tokenPacks: 'חבילות טוקנים',
    buyTokens: 'קניית טוקנים',
    paymentNote: 'רכישות בדיקה מדומות עד לחיבור תשלום מאובטח.',
    sessionFunding: 'מימון סשן',
    useTokensForCash: 'המרת טוקנים לכסף משחק',
    sessionFundingNote: 'סשן חדש מחליף את המזומן ואת כל הפוזיציות.',
    free: 'חינם',
    startSession: 'התחלת סשן',
    sessionConfirm:
      'להתחיל סשן חדש עם {amount}? המזומן והפוזיציות הנוכחיים יוחלפו.',
    shareResult: 'שיתוף תוצאה',
    shareReady: 'התוצאה מוכנה לשיתוף.',
    portfolioShareTitle: 'התיק של {name}: {netWorth}',
    portfolioShareText: 'תיק Mentavio שלי: {netWorth}. רווח פתוח: {pnl}.',
  },
  de: {
    language: 'Sprache',
    navMarket: 'Markt',
    navIntel: 'Analyse',
    navTrades: 'Trades',
    navNews: 'Nachrichten',
    navPortfolio: 'Depot',
    navStore: 'Shop',
    navAuth: 'Konto',
    brand: 'Mentavio',
    intelTitle: 'Marktanalyse',
    tradesTitle: 'Letzte Trades',
    portfolioTitle: 'Depot',
    storeTitle: 'Shop',
    signals: 'Signale',
    tradingSignals: 'Trading-Signale',
    marketChart: 'Marktchart',
    priceMap: 'Preiskarte',
    chartChange: 'Änderung %',
    marketOpen: 'Markt offen',
    closesIn: 'Schließt in',
    tape: 'Band',
    tradeTape: 'Trade-Band',
    noHistory: 'Noch keine Trades. Bots wärmen den Markt auf.',
    offers: 'Angebote',
    currency: 'Token',
    customCash: 'Sitzungsgeld',
    gameCash: 'Spielgeld',
    buyCash: 'Sitzung starten',
    customCashNote:
      'Spielgeld gehört nur zu einer Sitzung und wird nicht direkt verkauft.',
    cashPurchaseRecorded: 'Sitzung mit Bargeld gestartet: {amount}',
    noPositions: 'Noch keine Positionen',
    noPlayer: 'Kein Spieler',
    createPlayerFirst: 'Erstelle zuerst einen Spieler auf der Marktseite',
    verifiedAccountRequired:
      'Registriere dich und bestätige die E-Mail, bevor du Token kaufst',
    portfolioUpdated: 'Depot aktualisiert',
    marketIntelUpdated: 'Marktanalyse aktualisiert',
    tradeTapeUpdated: 'Trade-Band aktualisiert',
    storeLoaded: 'Shop geladen',
    purchaseRecorded: 'Token hinzugefügt: {amount}',
    buyPressure: 'Kaufdruck',
    support: 'Unterstützung',
    companyProfile: 'Firmenprofil',
    sector: 'Sektor',
    owner: 'Eigentümer',
    workers: 'Mitarbeiter',
    opened: 'Gegründet',
    governmentSupport: 'Staatliche Unterstützung',
    noSupport: 'Keine aktive Unterstützung',
    amount: 'Betrag',
    tax: 'Steuer',
    loan: 'Kredit',
    until: 'Bis',
    risk: 'Risiko',
    tokens: 'Token',
    symbol: 'Ticker',
    trader: 'Trader',
    side: 'Seite',
    qty: 'Menge',
    price: 'Preis',
    value: 'Wert',
    avg: 'Durchschn.',
    pnl: 'Gewinn/Verlust',
    cash: 'Bargeld',
    positions: 'Positionen',
    credits: 'Token',
    netWorth: 'Nettovermögen',
    nextTick: 'Nächster Tick',
    quickTrade: 'Schnellhandel',
    buyOrSell: 'Kaufen oder verkaufen',
    availableCash: 'Verfügbares Bargeld',
    selectCompany: 'Unternehmen wählen',
    company: 'Unternehmen',
    quantity: 'Menge',
    buy: 'Kaufen',
    sell: 'Verkaufen',
    owned: 'Im Besitz',
    placeOrder: 'Order platzieren',
    orderPlaced: 'Order ausgeführt: {side} {quantity} {symbol}',
    accountWallet: 'Konto-Wallet',
    permanentTokens: 'Dauerhafte Token',
    walletCopy: 'Token bleiben über alle Spielsitzungen im Konto erhalten.',
    tokenBalance: 'Token-Guthaben',
    tokenPacks: 'Token-Pakete',
    buyTokens: 'Token kaufen',
    paymentNote:
      'Testkäufe werden simuliert, bis sichere Zahlungen verbunden sind.',
    sessionFunding: 'Sitzungsfinanzierung',
    useTokensForCash: 'Token gegen Spielgeld tauschen',
    sessionFundingNote:
      'Eine neue Sitzung ersetzt Bargeld und alle Positionen.',
    free: 'Kostenlos',
    startSession: 'Sitzung starten',
    sessionConfirm:
      'Neue Sitzung mit {amount} starten? Bargeld und Positionen werden ersetzt.',
    shareResult: 'Ergebnis teilen',
    shareReady: 'Das Ergebnis ist zum Teilen bereit.',
    portfolioShareTitle: 'Depot von {name}: {netWorth}',
    portfolioShareText:
      'Mein Mentavio-Depot: {netWorth}. Offener Gewinn: {pnl}.',
  },
  fr: {
    language: 'Langue',
    navMarket: 'Marché',
    navIntel: 'Analyse',
    navTrades: 'Trades',
    navNews: 'Infos',
    navPortfolio: 'Portefeuille',
    navStore: 'Boutique',
    navAuth: 'Compte',
    brand: 'Mentavio',
    intelTitle: 'Analyse du marché',
    tradesTitle: 'Trades récents',
    portfolioTitle: 'Portefeuille',
    storeTitle: 'Boutique',
    signals: 'Signaux',
    tradingSignals: 'Signaux de trading',
    marketChart: 'Graphique du marché',
    priceMap: 'Carte des prix',
    chartChange: 'Variation %',
    marketOpen: 'Marché ouvert',
    closesIn: 'Ferme dans',
    tape: 'Ruban',
    tradeTape: 'Ruban des trades',
    noHistory: 'Aucun trade pour le moment. Les bots animent le marché.',
    offers: 'Offres',
    currency: 'Jetons',
    customCash: 'Argent de session',
    gameCash: 'Argent du jeu',
    buyCash: 'Démarrer session',
    customCashNote:
      "L'argent du jeu appartient à une seule session et n'est pas vendu directement.",
    cashPurchaseRecorded: 'Session démarrée avec : {amount}',
    noPositions: 'Aucune position',
    noPlayer: 'Aucun joueur',
    createPlayerFirst: "Créez d'abord un joueur sur la page Marché",
    verifiedAccountRequired:
      "Inscrivez-vous et confirmez l'email avant d'acheter des jetons",
    portfolioUpdated: 'Portefeuille mis à jour',
    marketIntelUpdated: 'Analyse mise à jour',
    tradeTapeUpdated: 'Ruban des trades mis à jour',
    storeLoaded: 'Boutique chargée',
    purchaseRecorded: 'Jetons ajoutés : {amount}',
    buyPressure: 'Pression acheteuse',
    support: 'Soutien',
    companyProfile: 'Profil société',
    sector: 'Secteur',
    owner: 'Propriétaire',
    workers: 'Employés',
    opened: 'Créée',
    governmentSupport: 'Soutien public',
    noSupport: 'Aucun soutien actif',
    amount: 'Montant',
    tax: 'Impôt',
    loan: 'Crédit',
    until: "Jusqu'à",
    risk: 'Risque',
    tokens: 'jetons',
    symbol: 'Symbole',
    trader: 'Trader',
    side: 'Côté',
    qty: 'Qté',
    price: 'Prix',
    value: 'Valeur',
    avg: 'Moy.',
    pnl: 'Gain/perte',
    cash: 'Liquidités',
    positions: 'Positions',
    credits: 'Jetons',
    netWorth: 'Valeur nette',
    nextTick: 'Prochain tick',
    quickTrade: 'Trade rapide',
    buyOrSell: 'Acheter ou vendre',
    availableCash: 'Liquidités disponibles',
    selectCompany: 'Choisissez une société',
    company: 'Société',
    quantity: 'Quantité',
    buy: 'Acheter',
    sell: 'Vendre',
    owned: 'Détenu',
    placeOrder: 'Placer l’ordre',
    orderPlaced: 'Ordre exécuté : {side} {quantity} {symbol}',
    accountWallet: 'Portefeuille du compte',
    permanentTokens: 'Jetons permanents',
    walletCopy:
      'Les jetons restent dans votre compte entre toutes les sessions.',
    tokenBalance: 'Solde de jetons',
    tokenPacks: 'Packs de jetons',
    buyTokens: 'Acheter des jetons',
    paymentNote:
      'Les achats de test sont simulés avant la connexion du paiement sécurisé.',
    sessionFunding: 'Financement de session',
    useTokensForCash: 'Échanger des jetons contre l’argent du jeu',
    sessionFundingNote:
      'Une nouvelle session remplace les liquidités et toutes les positions.',
    free: 'Gratuit',
    startSession: 'Démarrer la session',
    sessionConfirm:
      'Démarrer une nouvelle session avec {amount} ? Les liquidités et positions seront remplacées.',
    shareResult: 'Partager le résultat',
    shareReady: 'Le résultat est prêt à être partagé.',
    portfolioShareTitle: 'Portefeuille de {name} : {netWorth}',
    portfolioShareText:
      'Mon portefeuille Mentavio : {netWorth}. Gain ouvert : {pnl}.',
  },
};

Object.entries(fixedPageTranslations).forEach(([language, values]) => {
  Object.assign(pageTranslations[language], values);
});

const fixedPageDataText = {
  signals: {
    'Thin history': {
      ru: 'Мало истории',
      he: 'היסטוריה דקה',
      de: 'Dünne Historie',
      fr: 'Historique limité',
    },
    Momentum: { ru: 'Импульс', he: 'מומנטום', de: 'Momentum', fr: 'Momentum' },
    Caution: { ru: 'Осторожно', he: 'זהירות', de: 'Vorsicht', fr: 'Prudence' },
    Accumulation: {
      ru: 'Накопление',
      he: 'צבירה',
      de: 'Akkumulation',
      fr: 'Accumulation',
    },
    Distribution: {
      ru: 'Распределение',
      he: 'פיזור',
      de: 'Distribution',
      fr: 'Distribution',
    },
    Balanced: {
      ru: 'Баланс',
      he: 'מאוזן',
      de: 'Ausgewogen',
      fr: 'Équilibré',
    },
    'State-backed': {
      ru: 'Поддержка государства',
      he: 'נתמך מדינה',
      de: 'Staatlich gestützt',
      fr: "Soutenu par l'État",
    },
  },
  offers: {
    'Starter Pack': {
      ru: 'Стартовый пакет',
      he: 'חבילת התחלה',
      de: 'Starter-Paket',
      fr: 'Pack de départ',
    },
    'Adds 250 permanent tokens to the verified account.': {
      ru: 'Добавляет 250 постоянных токенов на подтвержденный аккаунт.',
      he: 'מוסיף 250 טוקנים קבועים לחשבון מאומת.',
      de: 'Fügt dem bestätigten Konto 250 dauerhafte Token hinzu.',
      fr: 'Ajoute 250 jetons permanents au compte vérifié.',
    },
    'Trader Pack': {
      ru: 'Пакет трейдера',
      he: 'חבילת סוחר',
      de: 'Trader-Paket',
      fr: 'Pack trader',
    },
    'Adds 800 permanent tokens for sessions, modes, and future features.': {
      ru: 'Добавляет 800 постоянных токенов для сессий, режимов и будущих функций.',
      he: 'מוסיף 800 טוקנים קבועים לסשנים, מצבים ופיצרים עתידיים.',
      de: 'Fügt 800 dauerhafte Token für Sitzungen, Modi und künftige Funktionen hinzu.',
      fr: 'Ajoute 800 jetons permanents pour les sessions, modes et futures fonctions.',
    },
    'Investor Pack': {
      ru: 'Пакет инвестора',
      he: 'חבילת משקיע',
      de: 'Investor-Paket',
      fr: 'Pack investisseur',
    },
    'Adds 2,200 permanent tokens for premium progression.': {
      ru: 'Добавляет 2 200 постоянных токенов для премиального прогресса.',
      he: 'מוסיף 2,200 טוקנים קבועים להתקדמות פרימיום.',
      de: 'Fügt 2.200 dauerhafte Token für Premium-Fortschritt hinzu.',
      fr: 'Ajoute 2 200 jetons permanents pour la progression premium.',
    },
    'Standard Session': {
      ru: 'Стандартная сессия',
      he: 'סשן רגיל',
      de: 'Standard-Sitzung',
      fr: 'Session standard',
    },
    'Funded Session': {
      ru: 'Сессия с капиталом',
      he: 'סשן ממומן',
      de: 'Finanzierte Sitzung',
      fr: 'Session financée',
    },
    'Pro Session': {
      ru: 'Профессиональная сессия',
      he: 'סשן מקצועי',
      de: 'Profi-Sitzung',
      fr: 'Session pro',
    },
    'Investor Session': {
      ru: 'Сессия инвестора',
      he: 'סשן משקיע',
      de: 'Investor-Sitzung',
      fr: 'Session investisseur',
    },
  },
  descriptions: {
    'Makes inspection drones for ports, farms, and construction sites with long-range sensors.': {
      ru: 'Производит инспекционные дроны с дальними сенсорами для портов, ферм и строительных объектов.',
    },
    'Builds driver-assistance software and fleet safety analytics.': {
      ru: 'Разрабатывает ПО помощи водителю и аналитику безопасности автопарков.',
    },
    'Serves households and municipal projects with conservative lending.': {
      ru: 'Обслуживает домохозяйства и муниципальные проекты через консервативное кредитование.',
    },
    'Operates a digital-first commercial bank for small companies.': {
      ru: 'Управляет цифровым коммерческим банком для малых компаний.',
    },
    'Publishes competitive mobile games and live-service economies for esports fans.': {
      ru: 'Выпускает соревновательные мобильные игры и live-service экономики для фанатов киберспорта.',
    },
    'Designs sensor chips for drones, vehicles, and factory robots.': {
      ru: 'Проектирует сенсорные чипы для дронов, транспорта и заводских роботов.',
    },
    'Provides cloud hosting, data warehousing, and AI compute clusters.': {
      ru: 'Предоставляет облачный хостинг, хранилища данных и вычислительные кластеры для AI.',
    },
    'Fabricates low-power processors for mobile devices and robots.': {
      ru: 'Производит энергоэффективные процессоры для мобильных устройств и роботов.',
    },
    'Runs virtual trial recruitment and biomarker matching for clinics.': {
      ru: 'Организует виртуальный набор в клинические испытания и подбор биомаркеров для клиник.',
    },
    'Protects small businesses with endpoint defense, password audits, and incident response.': {
      ru: 'Защищает малый бизнес через endpoint-защиту, аудит паролей и реагирование на инциденты.',
    },
    'Secures enterprise backups and analytics workloads across regulated industries.': {
      ru: 'Защищает корпоративные резервные копии и аналитические нагрузки в регулируемых отраслях.',
    },
    'Sells learning platforms, exams, and analytics dashboards to schools and bootcamps.': {
      ru: 'Продает учебные платформы, экзамены и аналитические панели школам и буткемпам.',
    },
    'Runs vertical farms and crop analytics for supermarkets seeking local produce supply.': {
      ru: 'Управляет вертикальными фермами и аналитикой урожая для супермаркетов с локальными поставками.',
    },
    'Provides simulated payment rails, fraud scoring, and merchant settlement tools.': {
      ru: 'Предоставляет платежную инфраструктуру, скоринг мошенничества и расчеты для мерчантов.',
    },
    'Produces lightweight insulation panels and recyclable packaging materials.': {
      ru: 'Производит легкие изоляционные панели и перерабатываемые упаковочные материалы.',
    },
    'Develops gene-screening platforms and targeted trial analytics.': {
      ru: 'Разрабатывает платформы генетического скрининга и аналитику целевых испытаний.',
    },
    'Mines precious and industrial metals for electronics and energy storage.': {
      ru: 'Добывает драгоценные и промышленные металлы для электроники и накопителей энергии.',
    },
    'Produces hydrogen fuel cells and storage modules for industrial sites.': {
      ru: 'Производит водородные топливные элементы и модули хранения для промышленных объектов.',
    },
    'Sells smart home subscriptions, appliances, and lifestyle services.': {
      ru: 'Продает подписки для умного дома, бытовую технику и lifestyle-сервисы.',
    },
    'Offers AI tutoring, certification exams, and workforce reskilling platforms.': {
      ru: 'Предлагает AI-репетиторов, сертификационные экзамены и платформы переобучения сотрудников.',
    },
    'Runs premium lifestyle stores and a direct-to-consumer brand marketplace.': {
      ru: 'Управляет премиальными lifestyle-магазинами и маркетплейсом брендов для покупателей.',
    },
    'Runs modular factories for medical devices, vehicles, and industrial parts.': {
      ru: 'Управляет модульными фабриками для медицинских устройств, транспорта и промышленных деталей.',
    },
    'Manufactures industrial robot arms for factories and warehouses.': {
      ru: 'Производит промышленные роботизированные манипуляторы для заводов и складов.',
    },
    'Develops diagnostic lab tools and AI-assisted screening kits for clinics.': {
      ru: 'Разрабатывает диагностические лабораторные инструменты и AI-наборы скрининга для клиник.',
    },
    'Extracts industrial metals used in batteries, solar panels, and robotics.': {
      ru: 'Добывает промышленные металлы для батарей, солнечных панелей и робототехники.',
    },
    'Builds reusable launch stages and lunar logistics simulation software.': {
      ru: 'Создает многоразовые ракетные ступени и ПО симуляции лунной логистики.',
    },
    'Builds autonomous warehouse robots and machine-vision systems for logistics companies.': {
      ru: 'Создает автономных складских роботов и системы машинного зрения для логистических компаний.',
    },
    'Coordinates container routes, port scheduling, and fuel optimization for regional fleets.': {
      ru: 'Координирует контейнерные маршруты, расписание портов и оптимизацию топлива для региональных флотов.',
    },
    'Launches small satellites and leases orbital communication capacity.': {
      ru: 'Запускает малые спутники и сдает в аренду орбитальные коммуникационные мощности.',
    },
    'Optimizes rail freight scheduling and warehouse transfers.': {
      ru: 'Оптимизирует расписание железнодорожных грузов и складские перегрузки.',
    },
    'Provides instant settlement rails for global merchants and creators.': {
      ru: 'Предоставляет мгновенные расчеты для глобальных мерчантов и авторов.',
    },
    'Creates cross-platform strategy games with collectible cosmetic markets.': {
      ru: 'Создает кроссплатформенные стратегические игры с рынками коллекционной косметики.',
    },
    'Builds market simulation engines and enterprise forecasting tools.': {
      ru: 'Создает движки рыночной симуляции и корпоративные инструменты прогнозирования.',
    },
    'Produces field robots for mines, farms, and disaster response teams.': {
      ru: 'Производит полевых роботов для шахт, ферм и команд реагирования на катастрофы.',
    },
    'Develops climate-resistant seeds and farm planning software.': {
      ru: 'Разрабатывает устойчивые к климату семена и ПО планирования ферм.',
    },
    'Monitors cloud identity, ransomware risk, and national infrastructure endpoints.': {
      ru: 'Мониторит облачные идентичности, риск ransomware и endpoints национальной инфраструктуры.',
    },
    'Operates neighborhood commerce software and same-day delivery marketplaces.': {
      ru: 'Управляет ПО локальной торговли и маркетплейсами доставки в тот же день.',
    },
    'Operates smart solar microgrids and battery balancing software for midsize cities.': {
      ru: 'Управляет умными солнечными микросетями и ПО балансировки батарей для средних городов.',
    },
    'Runs regional fiber networks and private 5G infrastructure.': {
      ru: 'Управляет региональными оптоволоконными сетями и частной 5G-инфраструктурой.',
    },
    'Builds compact electric delivery vehicles for urban fleets.': {
      ru: 'Производит компактные электрические машины доставки для городских автопарков.',
    },
    'Builds emergency network towers and resilient wireless coverage.': {
      ru: 'Строит аварийные сетевые вышки и устойчивое беспроводное покрытие.',
    },
  },
  sides: {
    buy: { en: 'BUY', ru: 'Купить', he: 'קנייה', de: 'Kauf', fr: 'Achat' },
    sell: {
      en: 'SELL',
      ru: 'Продать',
      he: 'מכירה',
      de: 'Verkauf',
      fr: 'Vente',
    },
  },
  sectors: {
    AI: { ru: 'ИИ', he: 'בינה מלאכותית', de: 'KI', fr: 'IA' },
    Energy: { ru: 'Энергетика', he: 'אנרגיה', de: 'Energie', fr: 'Énergie' },
    Healthcare: {
      ru: 'Здравоохранение',
      he: 'בריאות',
      de: 'Gesundheit',
      fr: 'Santé',
    },
    Gaming: { ru: 'Игры', he: 'משחקים', de: 'Gaming', fr: 'Jeux' },
    Aerospace: {
      ru: 'Аэрокосмос',
      he: 'תעופה וחלל',
      de: 'Luft- und Raumfahrt',
      fr: 'Aérospatial',
    },
    Space: { ru: 'Космос', he: 'חלל', de: 'Weltraum', fr: 'Espace' },
    Agriculture: {
      ru: 'Сельское хозяйство',
      he: 'חקלאות',
      de: 'Landwirtschaft',
      fr: 'Agriculture',
    },
    Fintech: { ru: 'Финтех', he: 'פינטק', de: 'Fintech', fr: 'Fintech' },
    Education: { ru: 'Образование', he: 'חינוך', de: 'Bildung', fr: 'Éducation' },
    Cybersecurity: {
      ru: 'Кибербезопасность',
      he: 'סייבר',
      de: 'Cybersicherheit',
      fr: 'Cybersécurité',
    },
    Logistics: { ru: 'Логистика', he: 'לוגיסטיקה', de: 'Logistik', fr: 'Logistique' },
    Manufacturing: {
      ru: 'Производство',
      he: 'ייצור',
      de: 'Produktion',
      fr: 'Industrie',
    },
    Retail: { ru: 'Ритейл', he: 'קמעונאות', de: 'Einzelhandel', fr: 'Commerce' },
    Consumer: {
      ru: 'Потребительский сектор',
      he: 'צרכנות',
      de: 'Konsum',
      fr: 'Consommation',
    },
    Robotics: { ru: 'Робототехника', he: 'רובוטיקה', de: 'Robotik', fr: 'Robotique' },
    Banking: { ru: 'Банки', he: 'בנקאות', de: 'Banken', fr: 'Banque' },
    Biotech: { ru: 'Биотех', he: 'ביוטק', de: 'Biotech', fr: 'Biotech' },
    Semiconductor: {
      ru: 'Полупроводники',
      he: 'שבבים',
      de: 'Halbleiter',
      fr: 'Semi-conducteurs',
    },
    Automotive: { ru: 'Автомобили', he: 'רכב', de: 'Automobil', fr: 'Automobile' },
    Telecom: { ru: 'Телеком', he: 'תקשורת', de: 'Telekom', fr: 'Télécom' },
    Mining: { ru: 'Добыча', he: 'כרייה', de: 'Bergbau', fr: 'Mines' },
    Cloud: { ru: 'Облако', he: 'ענן', de: 'Cloud', fr: 'Cloud' },
  },
  supportTypes: {
    none: { ru: 'нет', he: 'אין', de: 'keine', fr: 'aucun' },
    'R&D grant': {
      ru: 'Грант на исследования',
      he: 'מענק מו"פ',
      de: 'Forschungszuschuss',
      fr: 'Subvention R&D',
    },
    'Green energy tax credit': {
      ru: 'Налоговая льгота на зеленую энергию',
      he: 'זיכוי מס לאנרגיה ירוקה',
      de: 'Steuergutschrift für grüne Energie',
      fr: 'Crédit d’impôt énergie verte',
    },
    'Health innovation grant': {
      ru: 'Грант на медицинские инновации',
      he: 'מענק חדשנות בריאות',
      de: 'Zuschuss für Gesundheitsinnovation',
      fr: 'Subvention innovation santé',
    },
    'Defense supplier credit line': {
      ru: 'Кредитная линия оборонного поставщика',
      he: 'קו אשראי לספק ביטחוני',
      de: 'Kreditlinie für Verteidigungslieferanten',
      fr: 'Ligne de crédit fournisseur défense',
    },
    'Food security subsidy': {
      ru: 'Субсидия продовольственной безопасности',
      he: 'סבסוד ביטחון מזון',
      de: 'Subvention für Ernährungssicherheit',
      fr: 'Subvention sécurité alimentaire',
    },
    'Education modernization tender': {
      ru: 'Тендер модернизации образования',
      he: 'מכרז מודרניזציה לחינוך',
      de: 'Ausschreibung Bildungsmodernisierung',
      fr: 'Appel d’offres modernisation éducation',
    },
    'Critical infrastructure contract': {
      ru: 'Контракт критической инфраструктуры',
      he: 'חוזה תשתית קריטית',
      de: 'Vertrag für kritische Infrastruktur',
      fr: 'Contrat infrastructure critique',
    },
    'Port logistics loan': {
      ru: 'Кредит на портовую логистику',
      he: 'הלוואת לוגיסטיקת נמלים',
      de: 'Kredit für Hafenlogistik',
      fr: 'Prêt logistique portuaire',
    },
    'Manufacturing tax relief': {
      ru: 'Налоговая льгота для производства',
      he: 'הקלת מס לייצור',
      de: 'Steuererleichterung Produktion',
      fr: 'Allègement fiscal industriel',
    },
    'Road safety pilot': { ru: 'Пилот безопасности дорог' },
    'Municipal lending guarantee': {
      ru: 'Гарантия муниципального кредитования',
    },
    'Domestic chip subsidy': { ru: 'Субсидия на отечественные чипы' },
    'Chip fabrication tax credit': {
      ru: 'Налоговая льгота на производство чипов',
    },
    'Clinical data grant': { ru: 'Грант на клинические данные' },
    'Critical data hosting contract': {
      ru: 'Контракт хостинга критических данных',
    },
    'Biotech research grant': { ru: 'Грант на биотех-исследования' },
    'Hydrogen transition subsidy': {
      ru: 'Субсидия водородного перехода',
    },
    'Workforce reskilling tender': {
      ru: 'Тендер на переобучение персонала',
    },
    'Factory resilience loan': {
      ru: 'Кредит на устойчивость фабрик',
    },
    'Automation loan': { ru: 'Кредит на автоматизацию' },
    'Strategic minerals permit': {
      ru: 'Разрешение на стратегические минералы',
    },
    'Exploration milestone grant': {
      ru: 'Грант на этап геологоразведки',
    },
    'Satellite security contract': {
      ru: 'Контракт спутниковой безопасности',
    },
    'Freight corridor loan': {
      ru: 'Кредит на грузовой коридор',
    },
    'AI safety grant': { ru: 'Грант на безопасность AI' },
    'Disaster robotics grant': {
      ru: 'Грант на робототехнику для катастроф',
    },
    'Climate agriculture grant': {
      ru: 'Грант на климатическое сельское хозяйство',
    },
    'Infrastructure defense contract': {
      ru: 'Контракт защиты инфраструктуры',
    },
    'Rural broadband grant': {
      ru: 'Грант на сельский broadband',
    },
    'EV tax credit': { ru: 'Налоговая льгота на электромобили' },
    'Emergency network support': {
      ru: 'Поддержка аварийной сети',
    },
  },
  risks: {
    none: { ru: 'нет', he: 'אין', de: 'kein', fr: 'aucun' },
    low: { ru: 'низкий', he: 'נמוך', de: 'niedrig', fr: 'faible' },
    medium: { ru: 'средний', he: 'בינוני', de: 'mittel', fr: 'moyen' },
    high: { ru: 'высокий', he: 'גבוה', de: 'hoch', fr: 'élevé' },
  },
};

Object.entries(fixedPageDataText).forEach(([group, entries]) => {
  pageDataText[group] = pageDataText[group] || {};
  Object.entries(entries).forEach(([key, values]) => {
    pageDataText[group][key] = {
      ...(pageDataText[group][key] || {}),
      ...values,
    };
  });
});

function dataText(group, key) {
  if (!key) return '';
  return pageDataText[group]?.[key]?.[currentLanguage] || key;
}

function tr(key, values = {}) {
  const dictionary = pageTranslations[currentLanguage] || pageTranslations.en;
  const template = dictionary[key] || pageTranslations.en[key] || key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    template,
  );
}

async function api(path, options = {}) {
  if (window.marketApiJson) {
    return window.marketApiJson(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  }

  const response = await fetch(
    window.marketApiUrl ? window.marketApiUrl(path) : path,
    {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json();
}

function setStatus(message) {
  if (statusNode) statusNode.textContent = message;
}

function addLanguageSelect() {
  const topbar = document.querySelector('.topbar');
  if (!topbar || document.querySelector('#pageLanguageSelect')) return;

  const label = document.createElement('label');
  label.className = 'language-select';
  label.innerHTML = `
    <span>${tr('language')}</span>
    <select id="pageLanguageSelect" aria-label="Language">
      <option value="en">English</option>
      <option value="ru">Ð ÑƒÑÑÐºÐ¸Ð¹</option>
      <option value="he">×¢×‘×¨×™×ª</option>
      <option value="de">Deutsch</option>
      <option value="fr">FranÃ§ais</option>
    </select>
  `;
  topbar.appendChild(label);

  const select = label.querySelector('select');
  const optionLabels = {
    en: 'English',
    ru: 'Русский',
    he: 'עברית',
    de: 'Deutsch',
    fr: 'Français',
  };
  select.querySelectorAll('option').forEach((option) => {
    option.textContent = optionLabels[option.value] || option.textContent;
  });
  select.value = currentLanguage;
  select.addEventListener('change', () => {
    currentLanguage = select.value;
    localStorage.setItem('market_language', currentLanguage);
    applyLanguage();
    void refreshPage();
  });
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';

  const select = document.querySelector('#pageLanguageSelect');
  if (select) select.value = currentLanguage;

  const navLabels = {
    '/game/': 'navMarket',
    '/game/index.html': 'navMarket',
    './index.html': 'navMarket',
    'index.html': 'navMarket',
    '/game/intel.html': 'navIntel',
    './intel.html': 'navIntel',
    'intel.html': 'navIntel',
    '/game/trades.html': 'navTrades',
    './trades.html': 'navTrades',
    'trades.html': 'navTrades',
    '/game/news.html': 'navNews',
    './news.html': 'navNews',
    'news.html': 'navNews',
    '/game/portfolio.html': 'navPortfolio',
    './portfolio.html': 'navPortfolio',
    'portfolio.html': 'navPortfolio',
    '/game/store.html': 'navStore',
    './store.html': 'navStore',
    'store.html': 'navStore',
    '/game/auth.html': 'navAuth',
    './auth.html': 'navAuth',
    'auth.html': 'navAuth',
  };

  document.querySelectorAll('.app-nav a').forEach((link) => {
    const key = navLabels[link.getAttribute('href')];
    if (key) link.textContent = tr(key);
  });

  const brand = document.querySelector('.topbar .eyebrow');
  if (brand) brand.textContent = tr('brand');

  const pageTitleKey = {
    intel: 'intelTitle',
    trades: 'tradesTitle',
    portfolio: 'portfolioTitle',
    store: 'storeTitle',
  }[page];
  if (pageTitleKey) document.querySelector('h1').textContent = tr(pageTitleKey);

  translatePageLabels();
}

function translatePageLabels() {
  const labelMap = {
    intel: [
      ['.intel-chart-section .eyebrow', 'marketChart'],
      ['.intel-chart-section h2', 'priceMap'],
      ['.intel-signals-section .eyebrow', 'signals'],
      ['.intel-signals-section h2', 'tradingSignals'],
    ],
    trades: [
      ['.page-panel .eyebrow', 'tape'],
      ['.page-panel h2', 'tradeTape'],
    ],
    portfolio: [['.page-panel .eyebrow', 'portfolioTitle']],
    store: [
      ['.page-panel .eyebrow', 'navStore'],
      ['.page-panel h2', 'tokenPacks'],
      ['#storeWalletEyebrow', 'accountWallet'],
      ['#storeWalletTitle', 'permanentTokens'],
      ['#storeWalletCopy', 'walletCopy'],
      ['#storeTokenBalanceLabel', 'tokenBalance'],
      ['#storePaymentNote', 'paymentNote'],
      ['#sessionFundingEyebrow', 'sessionFunding'],
      ['#sessionFundingTitle', 'useTokensForCash'],
      ['#sessionFundingNote', 'sessionFundingNote'],
    ],
  };

  for (const [selector, key] of labelMap[page] || []) {
    const element = document.querySelector(selector);
    if (element) element.textContent = tr(key);
  }

  document.querySelectorAll('.page-clock span').forEach((element) => {
    element.textContent = tr('nextTick');
  });

  translateTables();

  if (page === 'portfolio') {
    const portfolioLabels = [
      ['#portfolioTradeEyebrow', 'quickTrade'],
      ['#portfolioTradeTitle', 'buyOrSell'],
      ['#portfolioAvailableLabel', 'availableCash'],
      ['#portfolioCompanyLabel', 'company'],
      ['#portfolioQuantityLabel', 'quantity'],
      ['#portfolioOwnedLabel', 'owned'],
      ['#portfolioOrderButton', 'placeOrder'],
      ['#sharePortfolioButton', 'shareResult'],
    ];
    for (const [selector, key] of portfolioLabels) {
      const element = document.querySelector(selector);
      if (element) element.textContent = tr(key);
    }

    document
      .querySelectorAll('[data-portfolio-side]')
      .forEach((button) => {
        button.textContent = tr(button.dataset.portfolioSide);
      });
    syncPortfolioTradePanel();
  }
}

function translateTables() {
  const tableLabels = {
    trades: ['trader', 'symbol', 'side', 'qty', 'price', 'value'],
    portfolio: ['symbol', 'qty', 'avg', 'value', 'pnl'],
  }[page];

  if (!tableLabels) return;

  document.querySelectorAll('th').forEach((header, index) => {
    const key = tableLabels[index];
    if (key) header.textContent = tr(key);
  });

  if (page === 'portfolio') {
    const statKeys = ['cash', 'positions', 'credits'];
    document
      .querySelectorAll('.portfolio-stats span')
      .forEach((element, index) => {
        element.textContent = tr(statKeys[index]);
      });
    const netWorth = document.querySelector('.metric span');
    if (netWorth) netWorth.textContent = tr('netWorth');
  }

  syncResponsiveTableLabels();
}

function syncResponsiveTableLabels() {
  document.querySelectorAll('.page-panel table').forEach((table) => {
    const labels = Array.from(table.querySelectorAll('thead th'), (header) =>
      header.textContent.trim(),
    );

    table.querySelectorAll('tbody tr').forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'));
      const isEmptyState =
        cells.length === 1 && cells[0].hasAttribute('colspan');

      row.classList.toggle('mobile-table-empty', isEmptyState);
      cells.forEach((cell, index) => {
        if (isEmptyState) {
          cell.removeAttribute('data-label');
          return;
        }
        cell.dataset.label = labels[index] || '';
      });
    });
  });
}

function numberValue(value) {
  return Number(value || 0);
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function formatCount(value) {
  return new Intl.NumberFormat(
    currentLanguage === 'ru' ? 'ru-RU' : 'en-US',
  ).format(numberValue(value));
}

function getRangeStart(points) {
  if (selectedIntelRange === 'ALL' || !points.length) return 0;

  const latestTime = new Date(points[points.length - 1].created_at).getTime();
  const day = 24 * 60 * 60 * 1000;
  const ranges = {
    '1D': day,
    '5D': day * 5,
    '1M': day * 30,
    '3M': day * 90,
    '6M': day * 180,
    '1Y': day * 365,
    '5Y': day * 365 * 5,
  };

  if (selectedIntelRange === 'YTD') {
    return new Date(new Date(latestTime).getFullYear(), 0, 1).getTime();
  }

  return latestTime - (ranges[selectedIntelRange] || ranges['1D']);
}

function getSelectedInsight(insights) {
  if (!selectedIntelSymbol && insights[0]) {
    selectedIntelSymbol = insights[0].symbol;
    localStorage.setItem('market_intel_symbol', selectedIntelSymbol);
  }

  return (
    insights.find((item) => item.symbol === selectedIntelSymbol) || insights[0]
  );
}

function getChartPoints(item) {
  const points = [...(item?.price_history || [])]
    .map((point) => ({
      ...point,
      price: numberValue(point.price),
      quantity: numberValue(point.quantity),
      created_at: point.created_at,
    }))
    .filter((point) => Number.isFinite(point.price) && point.created_at)
    .sort(
      (first, second) =>
        new Date(first.created_at) - new Date(second.created_at),
    );

  if (!points.length && item) {
    points.push(
      {
        price:
          numberValue(item.previous_price) || numberValue(item.current_price),
        quantity: 0,
        side: 'sell',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        price: numberValue(item.current_price),
        quantity: 0,
        side: 'buy',
        created_at: new Date().toISOString(),
      },
    );
  }

  const rangeStart = getRangeStart(points);
  const ranged = points.filter(
    (point) => new Date(point.created_at).getTime() >= rangeStart,
  );
  const visible = ranged.length >= 2 ? ranged : points;
  const maxPoints = 96;
  if (visible.length <= maxPoints) return visible;

  const step = Math.ceil(visible.length / maxPoints);
  return visible.filter(
    (_, index) => index % step === 0 || index === visible.length - 1,
  );
}

function buildCandles(points) {
  return points.map((point, index) => {
    const previous = points[index - 1]?.price ?? point.price;
    const close = point.price;
    const open = previous;
    const seed = ((index * 17) % 9) / 1000;
    const wick = Math.max(
      Math.abs(close - open) * 0.55,
      close * (0.0025 + seed),
    );
    return {
      ...point,
      open,
      high: Math.max(open, close) + wick,
      low: Math.max(0.01, Math.min(open, close) - wick),
      close,
      volume: Math.max(point.quantity, Math.abs(close - open) * 3),
    };
  });
}

function formatChartTime(value, showDate = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const locale =
    currentLanguage === 'ru'
      ? 'ru-RU'
      : currentLanguage === 'he'
        ? 'he-IL'
        : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    month: showDate ? 'short' : undefined,
    day: showDate ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function renderIntelChartControls(insights) {
  const select = document.querySelector('#intelChartSymbol');
  if (select) {
    select.innerHTML = insights
      .map((item) => `<option value="${item.symbol}">${item.symbol}</option>`)
      .join('');
    select.value = getSelectedInsight(insights)?.symbol || '';
  }

  document.querySelectorAll('#intelRangeTabs button').forEach((button) => {
    button.classList.toggle(
      'active',
      button.dataset.range === selectedIntelRange,
    );
  });

  const state = document.querySelector('.intel-market-state');
  if (state) {
    state.querySelector('strong').textContent = tr('marketOpen');
    if (
      !state.querySelector('small').textContent ||
      state.querySelector('small').textContent === '--'
    ) {
      state.querySelector('small').textContent = `${tr('closesIn')} --`;
    }
  }
}

function renderIntelChartStats(item, candles) {
  const stats = document.querySelector('#intelChartStats');
  if (!stats || !item || !candles.length) return;

  const first = candles[0];
  const last = candles[candles.length - 1];
  const change = last.close - first.open;
  const changePercent = first.open ? (change / first.open) * 100 : 0;
  const high = Math.max(...candles.map((candle) => candle.high));
  const low = Math.min(...candles.map((candle) => candle.low));
  const className = change >= 0 ? 'gain' : 'loss';

  stats.innerHTML = `
    <strong>${item.name} (${item.symbol})</strong>
    <span>O ${money.format(first.open)}</span>
    <span>H ${money.format(high)}</span>
    <span>L ${money.format(low)}</span>
    <span>C ${money.format(last.close)}</span>
    <b class="${className}">${change >= 0 ? '+' : ''}${money.format(change)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)</b>
  `;
}

function renderIntelChart(insights = []) {
  const canvas = document.querySelector('#intelChart');
  if (!canvas) return;

  renderIntelChartControls(insights);

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(320, Math.floor(rect.width || canvas.width));
  const height = Math.max(240, Math.floor(rect.height || canvas.height));

  if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const item = getSelectedInsight(insights);
  const points = getChartPoints(item);
  const candles = buildCandles(points);
  renderIntelChartStats(item, candles);

  if (!item || !candles.length) {
    ctx.fillStyle = '#9aa8a4';
    ctx.font = '700 14px Inter, Arial, sans-serif';
    ctx.fillText(tr('marketIntelUpdated'), 24, 42);
    return;
  }

  const padding = { top: 20, right: 62, bottom: 34, left: 18 };
  const chartWidth = width - padding.left - padding.right;
  const priceHeight = Math.round(
    (height - padding.top - padding.bottom) * 0.74,
  );
  const volumeTop = padding.top + priceHeight + 10;
  const volumeHeight = height - volumeTop - padding.bottom;
  const minPrice = Math.min(...candles.map((candle) => candle.low));
  const maxPrice = Math.max(...candles.map((candle) => candle.high));
  const priceRange = Math.max(0.01, maxPrice - minPrice);
  const maxVolume = Math.max(...candles.map((candle) => candle.volume), 1);
  const step = chartWidth / candles.length;
  const bodyWidth = Math.max(4, Math.min(12, step * 0.58));
  const priceY = (price) =>
    padding.top + ((maxPrice - price) / priceRange) * priceHeight;

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (priceHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    const labelPrice = maxPrice - (priceRange / 4) * i;
    ctx.fillStyle = '#9aa8a4';
    ctx.font = '700 11px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(labelPrice.toFixed(2), width - 10, y + 4);
  }

  candles.forEach((candle, index) => {
    const x = padding.left + step * index + step / 2;
    const isUp = candle.close >= candle.open;
    const color = isUp ? '#27d68a' : '#ff5b4f';
    const openY = priceY(candle.open);
    const closeY = priceY(candle.close);
    const highY = priceY(candle.high);
    const lowY = priceY(candle.low);
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(2, Math.abs(closeY - openY));
    const volumeHeightValue = Math.max(
      2,
      (candle.volume / maxVolume) * volumeHeight,
    );

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.88;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();
    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);

    ctx.globalAlpha = 0.42;
    ctx.fillRect(
      x - bodyWidth / 2,
      volumeTop + volumeHeight - volumeHeightValue,
      bodyWidth,
      volumeHeightValue,
    );
    ctx.globalAlpha = 1;
  });

  const last = candles[candles.length - 1];
  const lastY = priceY(last.close);
  const lastColor = last.close >= last.open ? '#27d68a' : '#ff5b4f';
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = lastColor;
  ctx.beginPath();
  ctx.moveTo(0, lastY);
  ctx.lineTo(width - padding.right + 18, lastY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = lastColor;
  ctx.fillRect(width - 64, lastY - 11, 54, 22);
  ctx.fillStyle = '#fff';
  ctx.font = '900 11px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(last.close.toFixed(2), width - 37, lastY + 4);

  const labelIndexes = [0, 0.2, 0.4, 0.6, 0.8, 1].map((ratioValue) =>
    Math.min(candles.length - 1, Math.round((candles.length - 1) * ratioValue)),
  );
  [...new Set(labelIndexes)].forEach((index) => {
    const candle = candles[index];
    const x = padding.left + step * index + step / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.055)';
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, volumeTop + volumeHeight);
    ctx.stroke();
    ctx.fillStyle = '#9aa8a4';
    ctx.font = '700 11px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      formatChartTime(candle.created_at, selectedIntelRange !== '1D'),
      x,
      height - 10,
    );
  });

  ctx.fillStyle = '#9aa8a4';
  ctx.textAlign = 'right';
  ctx.fillText('0', width - 10, volumeTop + volumeHeight);
  ctx.fillText(formatCount(maxVolume), width - 10, volumeTop + 4);
}

function renderIntel(history) {
  const root = document.querySelector('#marketIntel');
  if (!root) return;
  lastIntelInsights = history.insights || [];
  renderIntelChart(lastIntelInsights);
  root.innerHTML = history.insights
    .map((item) => {
      const pressure = Number(item.buy_pressure_percent);
      const change = Number(item.price_change_percent);
      const supportType = item.government_support_type || 'none';
      const hasSupport = supportType !== 'none';
      return `
        <article class="intel-card ${item.symbol === selectedIntelSymbol ? 'active' : ''}" data-symbol="${item.symbol}" role="button" tabindex="0">
          <div class="intel-card-head">
            <div>
              <strong>${item.symbol}</strong>
              <span>${item.name} / ${dataText('sectors', item.sector)}</span>
            </div>
            <b class="${change >= 0 ? 'gain' : 'loss'}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</b>
          </div>
          <p class="intel-description">${dataText('descriptions', item.description) || ''}</p>
          <div class="pressure-track" aria-label="Buy pressure">
            <i style="width: ${Math.max(0, Math.min(100, pressure))}%"></i>
          </div>
          <div class="intel-meta">
            <span>${dataText('signals', item.signal)}</span>
            <span>${tr('buyPressure')} ${pressure.toFixed(0)}%</span>
            <span>${Number(item.volume).toFixed(2)} ${tr('tokens')}</span>
            <span>${tr('support')} ${Number(item.support_score || 0).toFixed(0)}/100</span>
          </div>
          <dl class="intel-profile">
            <div><dt>${tr('owner')}</dt><dd>${item.owner_name || '-'}</dd></div>
            <div><dt>${tr('workers')}</dt><dd>${formatCount(item.employee_count)}</dd></div>
            <div><dt>${tr('opened')}</dt><dd>${item.founded_year || '-'}</dd></div>
            <div><dt>${tr('risk')}</dt><dd>${dataText('risks', item.support_risk_level || 'none')}</dd></div>
          </dl>
          <div class="intel-support ${hasSupport ? 'supported' : 'unsupported'}">
            <span>${tr('governmentSupport')}</span>
            <strong>${hasSupport ? dataText('supportTypes', supportType) : tr('noSupport')}</strong>
            <small>${tr('amount')} ${money.format(numberValue(item.government_support_amount))} / ${tr('tax')} ${numberValue(item.tax_benefit_percent).toFixed(1)}% / ${tr('loan')} ${numberValue(item.state_loan_rate_percent).toFixed(1)}% / ${tr('until')} ${item.support_expires_year || '-'}</small>
          </div>
        </article>
      `;
    })
    .join('');
}

function syncIntelCards() {
  document.querySelectorAll('.intel-card[data-symbol]').forEach((card) => {
    card.classList.toggle(
      'active',
      card.dataset.symbol === selectedIntelSymbol,
    );
  });
}

function selectIntelSymbol(symbol) {
  if (!symbol) return;
  selectedIntelSymbol = symbol;
  localStorage.setItem('market_intel_symbol', selectedIntelSymbol);
  renderIntelChart(lastIntelInsights);
  syncIntelCards();
}

function setupIntelInteractions() {
  if (page !== 'intel' || intelInteractionsBound) return;
  intelInteractionsBound = true;

  document
    .querySelector('#intelChartSymbol')
    ?.addEventListener('change', (event) => {
      selectIntelSymbol(event.target.value);
    });

  document
    .querySelector('#intelRangeTabs')
    ?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-range]');
      if (!button) return;
      selectedIntelRange = button.dataset.range;
      localStorage.setItem('market_intel_range', selectedIntelRange);
      renderIntelChart(lastIntelInsights);
    });

  document.querySelector('#marketIntel')?.addEventListener('click', (event) => {
    const card = event.target.closest('.intel-card[data-symbol]');
    if (card) selectIntelSymbol(card.dataset.symbol);
  });

  document
    .querySelector('#marketIntel')
    ?.addEventListener('keydown', (event) => {
      if (!['Enter', ' '].includes(event.key)) return;
      const card = event.target.closest('.intel-card[data-symbol]');
      if (!card) return;
      event.preventDefault();
      selectIntelSymbol(card.dataset.symbol);
    });
}

function renderTrades(history) {
  const root = document.querySelector('#recentTradesBody');
  if (!history.trades?.length) {
    root.innerHTML = `<tr><td colspan="6">${tr('noHistory')}</td></tr>`;
    syncResponsiveTableLabels();
    return;
  }

  root.innerHTML = history.trades
    .map(
      (trade) => `
        <tr>
          <td>${trade.trader_name || 'Trader'}</td>
          <td class="symbol-cell">${trade.symbol}</td>
          <td class="${trade.side === 'buy' ? 'gain' : 'loss'}">${dataText('sides', trade.side)}</td>
          <td>${numberValue(trade.quantity).toFixed(2)}</td>
          <td>${money.format(numberValue(trade.execution_price))}</td>
          <td>${money.format(numberValue(trade.gross_value))}</td>
        </tr>
      `,
    )
    .join('');
  syncResponsiveTableLabels();
}

function renderPortfolio(portfolio) {
  lastPortfolio = portfolio;
  document.querySelector('#portfolioTitle').textContent =
    portfolio.player.display_name;
  document.querySelector('#netWorth').textContent = money.format(
    numberValue(portfolio.net_worth),
  );
  document.querySelector('#cashBalance').textContent = money.format(
    numberValue(portfolio.cash_balance),
  );
  document.querySelector('#positionsValue').textContent = money.format(
    numberValue(portfolio.positions_value),
  );
  document.querySelector('#creditsValue').textContent = numberValue(
    portfolio.account_tokens,
  ).toFixed(0);
  syncPortfolioTradePanel();

  const body = document.querySelector('#positionsBody');
  if (!portfolio.positions.length) {
    body.innerHTML = `<tr><td colspan="5">${tr('noPositions')}</td></tr>`;
    syncResponsiveTableLabels();
    return;
  }

  body.innerHTML = portfolio.positions
    .map((position) => {
      const pnl = numberValue(position.unrealized_pnl);
      return `
        <tr>
          <td class="symbol-cell"><button class="position-trade-button" type="button" data-portfolio-symbol="${position.symbol}">${position.symbol}</button></td>
          <td>${numberValue(position.quantity).toFixed(2)}</td>
          <td>${money.format(numberValue(position.average_cost))}</td>
          <td>${money.format(numberValue(position.market_value))}</td>
          <td class="${pnl >= 0 ? 'gain' : 'loss'}">${money.format(pnl)}</td>
        </tr>
      `;
    })
    .join('');
  syncResponsiveTableLabels();
}

function renderPortfolioTradeCompanies() {
  const select = document.querySelector('#portfolioTradeSymbol');
  if (!select) return;

  const savedSymbol = localStorage.getItem('market_portfolio_trade_symbol');
  const heldSymbol = lastPortfolio?.positions?.[0]?.symbol;
  const selectedSymbol =
    [select.value, savedSymbol, heldSymbol].find((symbol) =>
      portfolioCompanies.some((company) => company.symbol === symbol),
    ) || portfolioCompanies[0]?.symbol;

  select.innerHTML = portfolioCompanies
    .map(
      (company) =>
        `<option value="${company.symbol}">${company.symbol} - ${company.name}</option>`,
    )
    .join('');

  if (selectedSymbol) select.value = selectedSymbol;
  syncPortfolioTradePanel();
}

function syncPortfolioTradePanel() {
  if (page !== 'portfolio') return;

  const select = document.querySelector('#portfolioTradeSymbol');
  const company = portfolioCompanies.find(
    (item) => item.symbol === select?.value,
  );
  const position = lastPortfolio?.positions?.find(
    (item) => item.symbol === company?.symbol,
  );

  const assetNode = document.querySelector('#portfolioTradeAsset');
  const companyNode = document.querySelector('#portfolioTradeCompany');
  const priceNode = document.querySelector('#portfolioTradePrice');
  const cashNode = document.querySelector('#portfolioTradeCash');
  const ownedNode = document.querySelector('#portfolioOwnedQuantity');

  if (assetNode) assetNode.textContent = company?.symbol || '--';
  if (companyNode) {
    companyNode.textContent = company?.name || tr('selectCompany');
  }
  if (priceNode) {
    priceNode.textContent = money.format(numberValue(company?.price));
  }
  if (cashNode) {
    cashNode.textContent = money.format(
      numberValue(lastPortfolio?.cash_balance),
    );
  }
  if (ownedNode) {
    ownedNode.textContent = numberValue(position?.quantity).toFixed(2);
  }

  document
    .querySelectorAll('[data-portfolio-side]')
    .forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.portfolioSide === portfolioTradeSide,
      );
    });
}

function setupPortfolioTradeInteractions() {
  if (page !== 'portfolio' || portfolioTradeInteractionsBound) return;
  portfolioTradeInteractionsBound = true;

  document
    .querySelector('#portfolioTradeSymbol')
    ?.addEventListener('change', (event) => {
      localStorage.setItem('market_portfolio_trade_symbol', event.target.value);
      syncPortfolioTradePanel();
    });

  document
    .querySelector('.portfolio-side-switch')
    ?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-portfolio-side]');
      if (!button) return;
      portfolioTradeSide = button.dataset.portfolioSide;
      syncPortfolioTradePanel();
    });

  document
    .querySelector('#positionsBody')
    ?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-portfolio-symbol]');
      const select = document.querySelector('#portfolioTradeSymbol');
      if (!button || !select) return;
      select.value = button.dataset.portfolioSymbol;
      localStorage.setItem(
        'market_portfolio_trade_symbol',
        button.dataset.portfolioSymbol,
      );
      syncPortfolioTradePanel();
      document.querySelector('.portfolio-order-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

  document
    .querySelector('#portfolioTradeForm')
    ?.addEventListener('submit', (event) => {
      placePortfolioOrder(event).catch((error) => setStatus(error.message));
    });
}

async function placePortfolioOrder(event) {
  event.preventDefault();
  const playerId = Number(localStorage.getItem('market_player_id'));
  if (!playerId) {
    setStatus(tr('createPlayerFirst'));
    return;
  }

  const symbol = document.querySelector('#portfolioTradeSymbol').value;
  const quantity = numberValue(
    document.querySelector('#portfolioTradeQuantity').value,
  );
  const submitButton = document.querySelector('#portfolioOrderButton');
  submitButton.disabled = true;

  try {
    const result = await api('/market/orders', {
      method: 'POST',
      body: JSON.stringify({
        player_id: playerId,
        symbol,
        side: portfolioTradeSide,
        quantity,
      }),
    });
    renderPortfolio(result.portfolio);
    setStatus(
      tr('orderPlaced', {
        side: tr(portfolioTradeSide),
        quantity: quantity.toFixed(2),
        symbol,
      }),
    );
  } finally {
    submitButton.disabled = false;
  }
}

async function shareText(payload) {
  const title = payload.title || 'Mentavio result';
  const text = payload.text || title;
  const url = new URL('./coming-soon.html', window.location.href).toString();

  await api('/platform/share', {
    method: 'POST',
    body: JSON.stringify({
      player_id: Number(localStorage.getItem('market_player_id')) || undefined,
      game_id: 'trading',
      kind: payload.kind || 'result',
      title,
      payload,
    }),
  }).catch(() => undefined);

  if (navigator.share) {
    await navigator.share({ title, text, url });
    return;
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return;
  }

  setStatus(text);
}

async function sharePortfolioResult() {
  if (!lastPortfolio) {
    setStatus(tr('createPlayerFirst'));
    return;
  }

  const netWorth = money.format(numberValue(lastPortfolio.net_worth));
  const pnl = lastPortfolio.positions.reduce(
    (total, position) => total + numberValue(position.unrealized_pnl),
    0,
  );
  await shareText({
    kind: 'portfolio',
    title: tr('portfolioShareTitle', {
      name: lastPortfolio.player.display_name,
      netWorth,
    }),
    text: tr('portfolioShareText', {
      netWorth,
      pnl: money.format(pnl),
    }),
    net_worth: numberValue(lastPortfolio.net_worth),
    open_pnl: pnl,
  });
  setStatus(tr('shareReady'));
}

function renderOffers(offers) {
  document.querySelector('#offersList').innerHTML = offers
    .map(
      (offer) => `
        <article class="offer">
          <div>
            <h3>${dataText('offers', offer.title)}</h3>
            <p>${dataText('offers', offer.description)}</p>
            <strong class="offer-reward">+${numberValue(offer.token_reward).toFixed(0)} ${tr('tokens')}</strong>
          </div>
          <button type="button" data-offer-id="${offer.id}">${tr('buyTokens')} · ${money.format(numberValue(offer.price_usd))}</button>
        </article>
      `,
    )
    .join('');
}

function renderSessionStarters(starters) {
  storeSessionStarters = starters;
  document.querySelector('#sessionStartersList').innerHTML = starters
    .map((starter) => {
      const cost = numberValue(starter.token_cost);
      return `
        <article class="offer session-offer">
          <div>
            <h3>${dataText('offers', starter.title)}</h3>
            <strong class="session-cash-value">${money.format(numberValue(starter.cash))}</strong>
            <p>${cost ? `${cost.toFixed(0)} ${tr('tokens')}` : tr('free')}</p>
          </div>
          <button type="button" data-starter-sku="${starter.sku}">${tr('startSession')}</button>
        </article>
      `;
    })
    .join('');
}

function renderStoreTokenBalance(value) {
  const node = document.querySelector('#storeTokenBalance');
  if (node) node.textContent = numberValue(value).toFixed(0);
}

async function loadPortfolioPage() {
  const playerId = Number(localStorage.getItem('market_player_id'));
  if (!playerId) {
    const title = document.querySelector('#portfolioTitle');
    if (title) title.textContent = tr('noPlayer');
    setStatus(tr('createPlayerFirst'));
    return;
  }

  const [portfolio, companies] = await Promise.all([
    api(`/market/players/${playerId}/portfolio`),
    api('/market/companies'),
  ]);
  portfolioCompanies = companies;
  renderPortfolio(portfolio);
  renderPortfolioTradeCompanies();
  setStatus(tr('portfolioUpdated'));
}

async function purchaseOffer(offerId) {
  const playerId = await ensureStorePlayer();

  const result = await api('/market/monetization/purchases', {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId, offer_id: Number(offerId) }),
  });
  if (result.user)
    localStorage.setItem('market_user', JSON.stringify(result.user));
  renderStoreTokenBalance(result.user?.account_tokens);
  setStatus(
    tr('purchaseRecorded', {
      amount: numberValue(result.token_reward).toFixed(0),
    }),
  );
}

async function startFundedSession(starterSku) {
  const playerId = await ensureStorePlayer();
  const starter = storeSessionStarters.find(
    (item) => item.sku === starterSku,
  );
  if (!starter) return;

  const accepted = window.confirm(
    tr('sessionConfirm', {
      amount: money.format(numberValue(starter.cash)),
    }),
  );
  if (!accepted) return;

  const result = await api('/market/sessions/start', {
    method: 'POST',
    body: JSON.stringify({
      player_id: playerId,
      starter_sku: starterSku,
    }),
  });

  if (result.user) {
    localStorage.setItem('market_user', JSON.stringify(result.user));
    renderStoreTokenBalance(result.user.account_tokens);
  }
  setStatus(
    tr('cashPurchaseRecorded', {
      amount: money.format(numberValue(result.portfolio.cash_balance)),
    }),
  );
}

async function ensureStorePlayer() {
  const playerId = Number(localStorage.getItem('market_player_id'));
  const user = readJson('market_user');
  if (
    playerId &&
    localStorage.getItem('market_auth_mode') === 'account' &&
    user?.email_verified
  ) {
    return playerId;
  }

  throw new Error(tr('verifiedAccountRequired'));
}

function registerAppShell() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/game/sw.js', { scope: '/game/' })
      .catch(() => undefined);
  }
}

function setupStoreInteractions() {
  if (page !== 'store' || storeInteractionsBound) return;
  storeInteractionsBound = true;

  document.querySelector('#offersList')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-offer-id]');
    if (button) {
      purchaseOffer(button.dataset.offerId).catch((error) =>
        setStatus(error.message),
      );
    }
  });

  document
    .querySelector('#sessionStartersList')
    ?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-starter-sku]');
      if (button) {
        startFundedSession(button.dataset.starterSku).catch((error) =>
          setStatus(error.message),
        );
      }
    });
}

async function loadClock() {
  if (!clockNode) return;

  const clock = await api('/market/clock');
  const nextTick = clock.next_tick_at
    ? new Date(clock.next_tick_at).getTime()
    : Date.now();
  const seconds = Math.max(0, Math.ceil((nextTick - Date.now()) / 1000));
  clockNode.textContent = `${seconds}s`;

  const marketState = document.querySelector('.intel-market-state small');
  if (marketState) marketState.textContent = `${tr('closesIn')} ${seconds}s`;
}

function startClock() {
  if (!clockNode) return;

  loadClock().catch(() => undefined);
  setInterval(() => {
    loadClock().catch(() => undefined);
  }, 1000);
}

function startLiveRefresh() {
  if (!['intel', 'trades'].includes(page)) return;

  setInterval(() => {
    refreshPage({ quiet: true }).catch((error) => setStatus(error.message));
  }, 5000);
}

async function boot() {
  registerAppShell();
  addLanguageSelect();
  applyLanguage();
  setupIntelInteractions();
  setupPortfolioTradeInteractions();
  setupStoreInteractions();
  document
    .querySelector('#sharePortfolioButton')
    ?.addEventListener('click', () =>
      sharePortfolioResult().catch((error) => setStatus(error.message)),
    );
  startClock();
  startLiveRefresh();

  await refreshPage();
}

async function refreshPage(options = {}) {
  if (isPageRefreshRunning) return;
  isPageRefreshRunning = true;

  try {
    if (page === 'intel') {
      renderIntel(await api('/market/history'));
      if (!options.quiet) setStatus(tr('marketIntelUpdated'));
    }

    if (page === 'trades') {
      renderTrades(await api('/market/history'));
      if (!options.quiet) setStatus(tr('tradeTapeUpdated'));
    }

    if (page === 'portfolio') {
      await loadPortfolioPage();
    }

    if (page === 'store') {
      const [offers, starters] = await Promise.all([
        api('/market/monetization/offers'),
        api('/market/monetization/session-starters'),
      ]);
      renderOffers(offers);
      renderSessionStarters(starters);

      const playerId = Number(localStorage.getItem('market_player_id'));
      const savedUser = readJson('market_user');
      let tokenBalance = numberValue(savedUser?.account_tokens);
      if (playerId) {
        const portfolio = await api(
          `/market/players/${playerId}/portfolio`,
        ).catch(() => null);
        if (portfolio) tokenBalance = numberValue(portfolio.account_tokens);
      }
      renderStoreTokenBalance(tokenBalance);
      setStatus(tr('storeLoaded'));
    }
  } finally {
    isPageRefreshRunning = false;
  }
}

boot().catch((error) => setStatus(error.message));

window.addEventListener('resize', () => {
  if (page === 'intel') renderIntelChart(lastIntelInsights);
});
