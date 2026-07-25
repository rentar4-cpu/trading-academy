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
    brand: 'Trading Academy',
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
    offers: 'Offers',
    currency: 'Currency',
    customCash: 'Custom Cash',
    gameCash: 'Game cash',
    buyCash: 'Buy Cash',
    customCashNote: 'Simulated purchase. Real payments can be connected later.',
    cashPurchaseRecorded: 'Purchased simulated cash: {amount}',
    noPositions: 'No positions yet',
    createPlayerFirst: 'Create a player on the Market page first',
    verifiedAccountRequired: 'Register and verify email before buying currency',
    portfolioUpdated: 'Portfolio updated',
    marketIntelUpdated: 'Market intel updated',
    tradeTapeUpdated: 'Trade tape updated',
    storeLoaded: 'Store loaded',
    purchaseRecorded: 'Purchase recorded: {sku}',
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
    credits: 'Credits',
    netWorth: 'Net Worth',
    nextTick: 'Next tick',
  },
  ru: {
    language: 'Язык',
    navMarket: 'Рынок',
    navIntel: 'Аналитика',
    navTrades: 'Сделки',
    navNews: 'Новости',
    navPortfolio: 'Портфель',
    navStore: 'Магазин',
    navAuth: 'Аккаунт',
    brand: 'Торговая академия',
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
    offers: 'Предложения',
    currency: 'Валюта',
    customCash: 'Своя сумма',
    gameCash: 'Игровые деньги',
    buyCash: 'Купить валюту',
    customCashNote: 'Симуляция покупки. Реальные платежи можно подключить позже.',
    cashPurchaseRecorded: 'Куплена игровая валюта: {amount}',
    noPositions: 'Позиций пока нет',
    createPlayerFirst: 'Сначала создайте игрока на странице рынка',
    verifiedAccountRequired: 'Перед покупкой валюты зарегистрируйтесь и подтвердите email',
    portfolioUpdated: 'Портфель обновлён',
    marketIntelUpdated: 'Аналитика обновлена',
    tradeTapeUpdated: 'Лента сделок обновлена',
    storeLoaded: 'Магазин загружен',
    purchaseRecorded: 'Покупка записана: {sku}',
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
    pnl: 'PnL',
    cash: 'Кэш',
    positions: 'Позиции',
    credits: 'Кредиты',
    netWorth: 'Капитал',
    nextTick: 'След. тик',
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
    brand: 'אקדמיית מסחר',
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
    offers: 'הצעות',
    currency: 'מטבע',
    customCash: 'סכום מותאם',
    gameCash: 'כסף משחק',
    buyCash: 'קנה כסף',
    customCashNote: 'רכישה מדומה. ניתן לחבר תשלומים אמיתיים בהמשך.',
    cashPurchaseRecorded: 'נרכש כסף משחק: {amount}',
    noPositions: 'אין עדיין פוזיציות',
    createPlayerFirst: 'צור שחקן בעמוד השוק תחילה',
    verifiedAccountRequired: 'יש להירשם ולאמת אימייל לפני קניית מטבע',
    portfolioUpdated: 'התיק עודכן',
    marketIntelUpdated: 'מודיעין השוק עודכן',
    tradeTapeUpdated: 'רצועת העסקאות עודכנה',
    storeLoaded: 'החנות נטענה',
    purchaseRecorded: 'רכישה נרשמה: {sku}',
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
    credits: 'קרדיטים',
    netWorth: 'שווי כולל',
    nextTick: 'טיק הבא',
  },
  de: {
    language: 'Sprache',
    navMarket: 'Markt',
    navIntel: 'Analyse',
    navTrades: 'Trades',
    navNews: 'News',
    navPortfolio: 'Portfolio',
    navStore: 'Shop',
    navAuth: 'Konto',
    brand: 'Trading Academy',
    intelTitle: 'Marktanalyse',
    tradesTitle: 'Letzte Trades',
    portfolioTitle: 'Portfolio',
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
    offers: 'Angebote',
    currency: 'Währung',
    customCash: 'Eigener Betrag',
    gameCash: 'Spielgeld',
    buyCash: 'Geld kaufen',
    customCashNote: 'Simulierter Kauf. Echte Zahlungen können später verbunden werden.',
    cashPurchaseRecorded: 'Simuliertes Geld gekauft: {amount}',
    noPositions: 'Noch keine Positionen',
    createPlayerFirst: 'Erstelle zuerst einen Spieler auf der Marktseite',
    verifiedAccountRequired: 'Registriere dich und bestätige die E-Mail vor dem Währungskauf',
    portfolioUpdated: 'Portfolio aktualisiert',
    marketIntelUpdated: 'Marktanalyse aktualisiert',
    tradeTapeUpdated: 'Trade-Band aktualisiert',
    storeLoaded: 'Shop geladen',
    purchaseRecorded: 'Kauf erfasst: {sku}',
    buyPressure: 'Kaufdruck',
    support: 'Support',
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
    symbol: 'Symbol',
    trader: 'Trader',
    side: 'Seite',
    qty: 'Menge',
    price: 'Preis',
    value: 'Wert',
    avg: 'Durchschn.',
    pnl: 'PnL',
    cash: 'Cash',
    positions: 'Positionen',
    credits: 'Credits',
    netWorth: 'Nettovermögen',
    nextTick: 'Nächster Tick',
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
    brand: 'Académie de trading',
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
    offers: 'Offres',
    currency: 'Devise',
    customCash: 'Montant libre',
    gameCash: 'Argent du jeu',
    buyCash: 'Acheter',
    customCashNote: 'Achat simulé. Les vrais paiements peuvent être connectés plus tard.',
    cashPurchaseRecorded: 'Argent de jeu acheté : {amount}',
    noPositions: 'Aucune position',
    createPlayerFirst: 'Créez d’abord un joueur sur la page Marché',
    verifiedAccountRequired: 'Inscrivez-vous et confirmez l’email avant d’acheter de la monnaie',
    portfolioUpdated: 'Portefeuille mis à jour',
    marketIntelUpdated: 'Analyse mise à jour',
    tradeTapeUpdated: 'Ruban des trades mis à jour',
    storeLoaded: 'Boutique chargée',
    purchaseRecorded: 'Achat enregistré : {sku}',
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
    until: 'Jusqu’à',
    risk: 'Risque',
    tokens: 'jetons',
    symbol: 'Symbole',
    trader: 'Trader',
    side: 'Côté',
    qty: 'Qté',
    price: 'Prix',
    value: 'Valeur',
    avg: 'Moy.',
    pnl: 'PnL',
    cash: 'Cash',
    positions: 'Positions',
    credits: 'Crédits',
    netWorth: 'Valeur nette',
    nextTick: 'Prochain tick',
  },
};

const pageDataText = {
  signals: {
    'Thin history': { ru: 'Мало истории', he: 'היסטוריה דקה', de: 'Dünne Historie', fr: 'Historique limité' },
    Momentum: { ru: 'Импульс', he: 'מומנטום', de: 'Momentum', fr: 'Momentum' },
    Caution: { ru: 'Осторожно', he: 'זהירות', de: 'Vorsicht', fr: 'Prudence' },
    Accumulation: { ru: 'Накопление', he: 'צבירה', de: 'Akkumulation', fr: 'Accumulation' },
    Distribution: { ru: 'Распределение', he: 'פיזור', de: 'Distribution', fr: 'Distribution' },
    Balanced: { ru: 'Баланс', he: 'מאוזן', de: 'Ausgewogen', fr: 'Équilibré' },
    'State-backed': { ru: 'Поддержка государства', he: 'נתמך מדינה', de: 'Staatlich gestützt', fr: 'Soutenu par l’État' },
  },
  offers: {
    'Starter Cash Boost': { ru: 'Стартовый денежный бонус', he: 'בונוס מזומן התחלתי', de: 'Startkapital-Bonus', fr: 'Bonus de départ' },
    'Adds simulated cash for faster early experimentation.': { ru: 'Добавляет игровые деньги для быстрых первых экспериментов.', he: 'מוסיף מזומן מדומה לניסוי מהיר בתחילת המשחק.', de: 'Fügt Spielgeld für schnelle Experimente hinzu.', fr: 'Ajoute du cash simulé pour expérimenter plus vite.' },
    '100 Premium Credits': { ru: '100 премиум-кредитов', he: '100 קרדיטי פרימיום', de: '100 Premium-Credits', fr: '100 crédits premium' },
    'Credits for optional cosmetics, boosts, and season features.': { ru: 'Кредиты для косметики, бустов и сезонных возможностей.', he: 'קרדיטים לקוסמטיקה, בוסטים ותכונות עונתיות.', de: 'Credits für Kosmetik, Boosts und Saisonfunktionen.', fr: 'Crédits pour cosmétiques, boosts et fonctions saisonnières.' },
  },
  sides: {
    buy: { en: 'BUY', ru: 'Купить', he: 'קנייה', de: 'Kauf', fr: 'Achat' },
    sell: { en: 'SELL', ru: 'Продать', he: 'מכירה', de: 'Verkauf', fr: 'Vente' },
  },
  sectors: {
    AI: { ru: 'ИИ', he: 'בינה מלאכותית', de: 'KI', fr: 'IA' },
    Energy: { ru: 'Энергетика', he: 'אנרגיה', de: 'Energie', fr: 'Énergie' },
    Healthcare: { ru: 'Здравоохранение', he: 'בריאות', de: 'Gesundheit', fr: 'Santé' },
    Gaming: { ru: 'Игры', he: 'משחקים', de: 'Gaming', fr: 'Jeux' },
    Aerospace: { ru: 'Аэрокосмос', he: 'תעופה וחלל', de: 'Luft- und Raumfahrt', fr: 'Aérospatial' },
    Agriculture: { ru: 'Сельское хозяйство', he: 'חקלאות', de: 'Landwirtschaft', fr: 'Agriculture' },
    Fintech: { ru: 'Финтех', he: 'פינטק', de: 'Fintech', fr: 'Fintech' },
    Education: { ru: 'Образование', he: 'חינוך', de: 'Bildung', fr: 'Éducation' },
    Cybersecurity: { ru: 'Кибербезопасность', he: 'סייבר', de: 'Cybersicherheit', fr: 'Cybersécurité' },
    Logistics: { ru: 'Логистика', he: 'לוגיסטיקה', de: 'Logistik', fr: 'Logistique' },
    Manufacturing: { ru: 'Производство', he: 'ייצור', de: 'Produktion', fr: 'Industrie' },
    Consumer: { ru: 'Потребительский сектор', he: 'צרכנות', de: 'Konsum', fr: 'Consommation' },
  },
  supportTypes: {
    none: { ru: 'нет', he: 'אין', de: 'keine', fr: 'aucun' },
    'R&D grant': { ru: 'Грант на исследования', he: 'מענק מו"פ', de: 'Forschungszuschuss', fr: 'Subvention R&D' },
    'Green energy tax credit': { ru: 'Налоговая льгота на зелёную энергию', he: 'זיכוי מס לאנרגיה ירוקה', de: 'Steuergutschrift für grüne Energie', fr: 'Crédit d’impôt énergie verte' },
    'Health innovation grant': { ru: 'Грант на медицинские инновации', he: 'מענק חדשנות בריאות', de: 'Zuschuss für Gesundheitsinnovation', fr: 'Subvention innovation santé' },
    'Defense supplier credit line': { ru: 'Кредитная линия оборонного поставщика', he: 'קו אשראי לספק ביטחוני', de: 'Kreditlinie für Verteidigungslieferant', fr: 'Ligne de crédit fournisseur défense' },
    'Food security subsidy': { ru: 'Субсидия продовольственной безопасности', he: 'סבסוד ביטחון מזון', de: 'Subvention für Ernährungssicherheit', fr: 'Subvention sécurité alimentaire' },
    'Education modernization tender': { ru: 'Тендер модернизации образования', he: 'מכרז מודרניזציית חינוך', de: 'Ausschreibung Bildungsmodernisierung', fr: 'Appel d’offres modernisation éducation' },
    'Critical infrastructure contract': { ru: 'Контракт критической инфраструктуры', he: 'חוזה תשתית קריטית', de: 'Vertrag für kritische Infrastruktur', fr: 'Contrat infrastructure critique' },
    'Port logistics loan': { ru: 'Кредит на портовую логистику', he: 'הלוואת לוגיסטיקת נמלים', de: 'Kredit für Hafenlogistik', fr: 'Prêt logistique portuaire' },
    'Manufacturing tax relief': { ru: 'Налоговая льгота для производства', he: 'הקלת מס לייצור', de: 'Steuererleichterung Produktion', fr: 'Allègement fiscal industriel' },
  },
  risks: {
    none: { ru: 'нет', he: 'אין', de: 'kein', fr: 'aucun' },
    low: { ru: 'низкий', he: 'נמוך', de: 'niedrig', fr: 'faible' },
    medium: { ru: 'средний', he: 'בינוני', de: 'mittel', fr: 'moyen' },
    high: { ru: 'высокий', he: 'גבוה', de: 'hoch', fr: 'élevé' },
  },
};

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
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

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
      <option value="ru">Русский</option>
      <option value="he">עברית</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
    </select>
  `;
  topbar.appendChild(label);

  const select = label.querySelector('select');
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
    '/game/intel.html': 'navIntel',
    '/game/trades.html': 'navTrades',
    '/game/news.html': 'navNews',
    '/game/portfolio.html': 'navPortfolio',
    '/game/store.html': 'navStore',
    '/game/auth.html': 'navAuth',
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
    store: [
      ['.page-panel .eyebrow', 'navStore'],
      ['.page-panel h2', 'offers'],
      ['.custom-cash-panel .eyebrow', 'currency'],
      ['.custom-cash-panel h2', 'customCash'],
      ['.custom-cash-form span', 'gameCash'],
      ['.custom-cash-form button', 'buyCash'],
      ['#customCashNote', 'customCashNote'],
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
    document.querySelectorAll('.portfolio-stats span').forEach((element, index) => {
      element.textContent = tr(statKeys[index]);
    });
    const netWorth = document.querySelector('.metric span');
    if (netWorth) netWorth.textContent = tr('netWorth');
  }
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
  return new Intl.NumberFormat(currentLanguage === 'ru' ? 'ru-RU' : 'en-US').format(
    numberValue(value),
  );
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

  return insights.find((item) => item.symbol === selectedIntelSymbol) || insights[0];
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
    .sort((first, second) => new Date(first.created_at) - new Date(second.created_at));

  if (!points.length && item) {
    points.push(
      {
        price: numberValue(item.previous_price) || numberValue(item.current_price),
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
  const ranged = points.filter((point) => new Date(point.created_at).getTime() >= rangeStart);
  const visible = ranged.length >= 2 ? ranged : points;
  const maxPoints = 96;
  if (visible.length <= maxPoints) return visible;

  const step = Math.ceil(visible.length / maxPoints);
  return visible.filter((_, index) => index % step === 0 || index === visible.length - 1);
}

function buildCandles(points) {
  return points.map((point, index) => {
    const previous = points[index - 1]?.price ?? point.price;
    const close = point.price;
    const open = previous;
    const seed = ((index * 17) % 9) / 1000;
    const wick = Math.max(Math.abs(close - open) * 0.55, close * (0.0025 + seed));
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
  const locale = currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'he' ? 'he-IL' : 'en-US';
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
    button.classList.toggle('active', button.dataset.range === selectedIntelRange);
  });

  const state = document.querySelector('.intel-market-state');
  if (state) {
    state.querySelector('strong').textContent = tr('marketOpen');
    if (!state.querySelector('small').textContent || state.querySelector('small').textContent === '--') {
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
  const priceHeight = Math.round((height - padding.top - padding.bottom) * 0.74);
  const volumeTop = padding.top + priceHeight + 10;
  const volumeHeight = height - volumeTop - padding.bottom;
  const minPrice = Math.min(...candles.map((candle) => candle.low));
  const maxPrice = Math.max(...candles.map((candle) => candle.high));
  const priceRange = Math.max(0.01, maxPrice - minPrice);
  const maxVolume = Math.max(...candles.map((candle) => candle.volume), 1);
  const step = chartWidth / candles.length;
  const bodyWidth = Math.max(4, Math.min(12, step * 0.58));
  const priceY = (price) => padding.top + ((maxPrice - price) / priceRange) * priceHeight;

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
    const volumeHeightValue = Math.max(2, (candle.volume / maxVolume) * volumeHeight);

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
    ctx.fillText(formatChartTime(candle.created_at, selectedIntelRange !== '1D'), x, height - 10);
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
          <p class="intel-description">${item.description || ''}</p>
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
    card.classList.toggle('active', card.dataset.symbol === selectedIntelSymbol);
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

  document.querySelector('#intelChartSymbol')?.addEventListener('change', (event) => {
    selectIntelSymbol(event.target.value);
  });

  document.querySelector('#intelRangeTabs')?.addEventListener('click', (event) => {
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

  document.querySelector('#marketIntel')?.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const card = event.target.closest('.intel-card[data-symbol]');
    if (!card) return;
    event.preventDefault();
    selectIntelSymbol(card.dataset.symbol);
  });
}

function renderTrades(history) {
  const root = document.querySelector('#recentTradesBody');
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
}

function renderPortfolio(portfolio) {
  document.querySelector('#portfolioTitle').textContent = portfolio.player.display_name;
  document.querySelector('#netWorth').textContent = money.format(numberValue(portfolio.net_worth));
  document.querySelector('#cashBalance').textContent = money.format(
    numberValue(portfolio.cash_balance),
  );
  document.querySelector('#positionsValue').textContent = money.format(
    numberValue(portfolio.positions_value),
  );
  document.querySelector('#creditsValue').textContent = numberValue(
    portfolio.player.premium_credits,
  ).toFixed(0);

  const body = document.querySelector('#positionsBody');
  if (!portfolio.positions.length) {
    body.innerHTML = `<tr><td colspan="5">${tr('noPositions')}</td></tr>`;
    return;
  }

  body.innerHTML = portfolio.positions
    .map((position) => {
      const pnl = numberValue(position.unrealized_pnl);
      return `
        <tr>
          <td class="symbol-cell">${position.symbol}</td>
          <td>${numberValue(position.quantity).toFixed(2)}</td>
          <td>${money.format(numberValue(position.average_cost))}</td>
          <td>${money.format(numberValue(position.market_value))}</td>
          <td class="${pnl >= 0 ? 'gain' : 'loss'}">${money.format(pnl)}</td>
        </tr>
      `;
    })
    .join('');
}

function renderOffers(offers) {
  document.querySelector('#offersList').innerHTML = offers
    .map(
      (offer) => `
        <article class="offer">
          <div>
            <h3>${dataText('offers', offer.title)}</h3>
            <p>${dataText('offers', offer.description)}</p>
          </div>
          <button type="button" data-offer-id="${offer.id}">${money.format(numberValue(offer.price_usd))}</button>
        </article>
      `,
    )
    .join('');
}

async function loadPortfolioPage() {
  const playerId = Number(localStorage.getItem('market_player_id'));
  if (!playerId) {
    setStatus(tr('createPlayerFirst'));
    return;
  }

  renderPortfolio(await api(`/market/players/${playerId}/portfolio`));
  setStatus(tr('portfolioUpdated'));
}

async function purchaseOffer(offerId) {
  const playerId = await ensureStorePlayer();

  const result = await api('/market/monetization/purchases', {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId, offer_id: Number(offerId) }),
  });
  setStatus(tr('purchaseRecorded', { sku: result.purchase.sku }));
}

async function ensureStorePlayer() {
  const playerId = Number(localStorage.getItem('market_player_id'));
  const user = readJson('market_user');
  if (playerId && localStorage.getItem('market_auth_mode') === 'account' && user?.email_verified) {
    return playerId;
  }

  throw new Error(tr('verifiedAccountRequired'));
}

async function purchaseCustomCash(event) {
  event.preventDefault();
  const playerId = await ensureStorePlayer();
  const cashAmount = Number(document.querySelector('#customCashAmount').value);
  const result = await api('/market/monetization/cash', {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId, cash_amount: cashAmount }),
  });
  setStatus(tr('cashPurchaseRecorded', { amount: money.format(numberValue(result.cash_reward)) }));
}

function registerAppShell() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/game/sw.js', { scope: '/game/' }).catch(() => undefined);
  }
}

async function loadClock() {
  if (!clockNode) return;

  const clock = await api('/market/clock');
  const nextTick = clock.next_tick_at ? new Date(clock.next_tick_at).getTime() : Date.now();
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

async function boot() {
  registerAppShell();
  addLanguageSelect();
  applyLanguage();
  setupIntelInteractions();
  startClock();

  await refreshPage();
}

async function refreshPage() {
  if (page === 'intel') {
    renderIntel(await api('/market/history'));
    setStatus(tr('marketIntelUpdated'));
  }

  if (page === 'trades') {
    renderTrades(await api('/market/history'));
    setStatus(tr('tradeTapeUpdated'));
  }

  if (page === 'portfolio') {
    await loadPortfolioPage();
  }

  if (page === 'store') {
    renderOffers(await api('/market/monetization/offers'));
    document.querySelector('#offersList').addEventListener('click', (event) => {
      const button = event.target.closest('[data-offer-id]');
      if (button) purchaseOffer(button.dataset.offerId).catch((error) => setStatus(error.message));
    });
    document.querySelector('#customCashForm')?.addEventListener('submit', (event) => {
      purchaseCustomCash(event).catch((error) => setStatus(error.message));
    });
    setStatus(tr('storeLoaded'));
  }
}

boot().catch((error) => setStatus(error.message));

window.addEventListener('resize', () => {
  if (page === 'intel') renderIntelChart(lastIntelInsights);
});
