const state = {
  companies: [],
  marketHistory: null,
  playerId: Number(localStorage.getItem('market_player_id')) || null,
  side: 'buy',
  selectedSymbol: null,
  history: [],
  portfolio: null,
  language: localStorage.getItem('market_language') || 'en',
};

const translations = {
  en: {
    brand: 'Trading Academy',
    title: 'Market Simulator',
    language: 'Language',
    navMarket: 'Market',
    navIntel: 'Intel',
    navTrades: 'Trades',
    navNews: 'News',
    navPortfolio: 'Portfolio',
    navStore: 'Store',
    navAuth: 'Account',
    player: 'Player',
    create: 'Create',
    playGuest: 'Play as Guest',
    guestMode: 'Guest mode',
    loginRegister: 'Login / Register',
    logout: 'Log out',
    accountReady: 'Playing as {name}',
    guestCreated: 'Guest player {name} created',
    market: 'Market',
    exchangeFloor: 'Exchange Floor',
    autoMarket: 'Auto market',
    marketChart: 'Market Chart',
    pulseNow: 'Pulse Now',
    liveSimulation: 'Live simulation',
    marketOpen: 'Market open',
    symbol: 'Symbol',
    company: 'Company',
    sector: 'Sector',
    price: 'Price',
    change: 'Change',
    order: 'Order',
    trade: 'Trade',
    walletBalance: 'Wallet Balance',
    selected: 'Selected',
    chooseCompany: 'Choose a company',
    chooseHint: 'Click a market tile to prepare an order.',
    quantity: 'Quantity',
    buy: 'Buy',
    sell: 'Sell',
    placeOrder: 'Place Order',
    latestEvent: 'Latest Event',
    noEvent: 'No event yet',
    eventHint: 'Run a market tick to move prices.',
    ready: 'Ready',
    owner: 'Owner',
    workers: 'Workers',
    opened: 'Opened',
    noDescription: 'No company description yet.',
    unknown: 'Unknown',
    notAvailable: 'N/A',
    noPriceHistory: 'No price history',
    priceHistory: 'history',
    waitingData: 'Waiting for data',
    noHistory: 'No trade history yet',
    buyPressure: 'Buy pressure',
    governmentSupport: 'Government Support',
    noSupport: 'No active support',
    amount: 'Amount',
    tax: 'Tax',
    loan: 'Loan',
    until: 'Until',
    risk: 'Risk',
    supportScore: 'support score',
    supportStrong: 'Strong support: downside is softened and regular ticks get a growth bias.',
    supportModerate: 'Moderate support: smaller drawdowns and a light growth bias.',
    supportLimited: 'Limited support: small stability bonus only.',
    noProtection: 'No price protection from the state.',
    installUnavailable: 'Install mode is unavailable in this browser',
    playerCreated: 'Player {name} created',
    marketEvent: 'Market event: {title}',
    selectedStatus: '{symbol} selected',
  },
  ru: {
    brand: 'Торговая академия',
    title: 'Симулятор рынка',
    language: 'Язык',
    navMarket: 'Рынок',
    navIntel: 'Аналитика',
    navTrades: 'Сделки',
    navNews: 'Новости',
    navPortfolio: 'Портфель',
    navStore: 'Магазин',
    navAuth: 'Аккаунт',
    player: 'Игрок',
    create: 'Создать',
    playGuest: 'Играть гостем',
    guestMode: 'Гостевой режим',
    loginRegister: 'Вход / регистрация',
    logout: 'Выйти',
    accountReady: 'Игрок: {name}',
    guestCreated: 'Гостевой игрок {name} создан',
    market: 'Рынок',
    exchangeFloor: 'Биржевая площадка',
    autoMarket: 'Авторынок',
    marketChart: 'График рынка',
    pulseNow: 'Тик сейчас',
    liveSimulation: 'Живая симуляция',
    marketOpen: 'Рынок открыт',
    symbol: 'Тикер',
    company: 'Компания',
    sector: 'Сектор',
    price: 'Цена',
    change: 'Изменение',
    order: 'Заявка',
    trade: 'Торговля',
    walletBalance: 'Баланс кошелька',
    selected: 'Выбрано',
    chooseCompany: 'Выберите компанию',
    chooseHint: 'Нажмите на плитку рынка, чтобы подготовить заявку.',
    quantity: 'Количество',
    buy: 'Купить',
    sell: 'Продать',
    placeOrder: 'Разместить заявку',
    latestEvent: 'Последнее событие',
    noEvent: 'Событий пока нет',
    eventHint: 'Рынок движется автоматически.',
    ready: 'Готово',
    owner: 'Владелец',
    workers: 'Работники',
    opened: 'Открыта',
    noDescription: 'Описание компании пока отсутствует.',
    unknown: 'Неизвестно',
    notAvailable: 'Нет данных',
    noPriceHistory: 'Нет истории цены',
    priceHistory: 'история',
    waitingData: 'Ожидание данных',
    noHistory: 'Истории сделок пока нет',
    buyPressure: 'Давление покупок',
    governmentSupport: 'Господдержка',
    noSupport: 'Нет активной поддержки',
    amount: 'Сумма',
    tax: 'Налог',
    loan: 'Кредит',
    until: 'До',
    risk: 'Риск',
    supportScore: 'оценка поддержки',
    supportStrong: 'Сильная поддержка: падение смягчается, а тики получают бонус роста.',
    supportModerate: 'Средняя поддержка: меньше просадки и лёгкий бонус роста.',
    supportLimited: 'Ограниченная поддержка: небольшой бонус стабильности.',
    noProtection: 'Нет ценовой защиты от государства.',
    installUnavailable: 'Установка недоступна в этом браузере',
    playerCreated: 'Игрок {name} создан',
    marketEvent: 'Событие рынка: {title}',
    selectedStatus: '{symbol} выбран',
  },
  he: {
    brand: 'אקדמיית מסחר',
    title: 'סימולטור שוק',
    language: 'שפה',
    navMarket: 'שוק',
    navIntel: 'מודיעין',
    navTrades: 'עסקאות',
    navNews: 'חדשות',
    navPortfolio: 'תיק',
    navStore: 'חנות',
    navAuth: 'חשבון',
    player: 'שחקן',
    create: 'צור',
    playGuest: 'שחק כאורח',
    guestMode: 'מצב אורח',
    loginRegister: 'כניסה / הרשמה',
    logout: 'יציאה',
    accountReady: 'משחק בתור {name}',
    guestCreated: 'שחקן אורח {name} נוצר',
    market: 'שוק',
    exchangeFloor: 'זירת מסחר',
    autoMarket: 'שוק אוטומטי',
    marketChart: 'גרף שוק',
    pulseNow: 'פעימה עכשיו',
    liveSimulation: 'סימולציה חיה',
    marketOpen: 'השוק פתוח',
    symbol: 'סימול',
    company: 'חברה',
    sector: 'סקטור',
    price: 'מחיר',
    change: 'שינוי',
    order: 'פקודה',
    trade: 'מסחר',
    walletBalance: 'יתרת ארנק',
    selected: 'נבחר',
    chooseCompany: 'בחר חברה',
    chooseHint: 'לחץ על אריח שוק כדי להכין פקודה.',
    quantity: 'כמות',
    buy: 'קנה',
    sell: 'מכור',
    placeOrder: 'שלח פקודה',
    latestEvent: 'אירוע אחרון',
    noEvent: 'אין אירועים עדיין',
    eventHint: 'השוק נע אוטומטית.',
    ready: 'מוכן',
    owner: 'בעלים',
    workers: 'עובדים',
    opened: 'נפתחה',
    noDescription: 'אין עדיין תיאור חברה.',
    unknown: 'לא ידוע',
    notAvailable: 'אין נתונים',
    noPriceHistory: 'אין היסטוריית מחיר',
    priceHistory: 'היסטוריה',
    waitingData: 'ממתין לנתונים',
    noHistory: 'אין עדיין היסטוריית עסקאות',
    buyPressure: 'לחץ קנייה',
    governmentSupport: 'תמיכת מדינה',
    noSupport: 'אין תמיכה פעילה',
    amount: 'סכום',
    tax: 'מס',
    loan: 'הלוואה',
    until: 'עד',
    risk: 'סיכון',
    supportScore: 'ציון תמיכה',
    supportStrong: 'תמיכה חזקה: הירידות מתרככות ויש נטיית צמיחה.',
    supportModerate: 'תמיכה בינונית: ירידות קטנות יותר ונטיית צמיחה קלה.',
    supportLimited: 'תמיכה מוגבלת: בונוס יציבות קטן בלבד.',
    noProtection: 'אין הגנת מחיר מהמדינה.',
    installUnavailable: 'מצב התקנה אינו זמין בדפדפן זה',
    playerCreated: 'השחקן {name} נוצר',
    marketEvent: 'אירוע שוק: {title}',
    selectedStatus: '{symbol} נבחר',
  },
  de: {
    brand: 'Trading Academy',
    title: 'Marktsimulator',
    language: 'Sprache',
    navMarket: 'Markt',
    navIntel: 'Analyse',
    navTrades: 'Trades',
    navNews: 'News',
    navPortfolio: 'Portfolio',
    navStore: 'Shop',
    navAuth: 'Konto',
    player: 'Spieler',
    create: 'Erstellen',
    playGuest: 'Als Gast spielen',
    guestMode: 'Gastmodus',
    loginRegister: 'Login / Registrieren',
    logout: 'Abmelden',
    accountReady: 'Spieler: {name}',
    guestCreated: 'Gastspieler {name} erstellt',
    market: 'Markt',
    exchangeFloor: 'Börsenfläche',
    autoMarket: 'Automarkt',
    marketChart: 'Marktchart',
    pulseNow: 'Tick jetzt',
    liveSimulation: 'Live-Simulation',
    marketOpen: 'Markt offen',
    symbol: 'Symbol',
    company: 'Firma',
    sector: 'Sektor',
    price: 'Preis',
    change: 'Änderung',
    order: 'Order',
    trade: 'Handel',
    walletBalance: 'Wallet-Guthaben',
    selected: 'Ausgewählt',
    chooseCompany: 'Firma wählen',
    chooseHint: 'Klicke auf eine Marktkachel, um eine Order vorzubereiten.',
    quantity: 'Menge',
    buy: 'Kaufen',
    sell: 'Verkaufen',
    placeOrder: 'Order senden',
    latestEvent: 'Letztes Ereignis',
    noEvent: 'Noch kein Ereignis',
    eventHint: 'Der Markt bewegt sich automatisch.',
    ready: 'Bereit',
    owner: 'Eigentümer',
    workers: 'Mitarbeiter',
    opened: 'Gegründet',
    noDescription: 'Noch keine Firmenbeschreibung.',
    unknown: 'Unbekannt',
    notAvailable: 'Keine Daten',
    noPriceHistory: 'Noch keine Preishistorie',
    priceHistory: 'Historie',
    waitingData: 'Warte auf Daten',
    noHistory: 'Noch keine Handelshistorie',
    buyPressure: 'Kaufdruck',
    governmentSupport: 'Staatliche Unterstützung',
    noSupport: 'Keine aktive Unterstützung',
    amount: 'Betrag',
    tax: 'Steuer',
    loan: 'Kredit',
    until: 'Bis',
    risk: 'Risiko',
    supportScore: 'Support-Score',
    supportStrong: 'Starke Unterstützung: Rückgänge werden gedämpft und Ticks erhalten Wachstumsbonus.',
    supportModerate: 'Mittlere Unterstützung: kleinere Rückgänge und leichter Wachstumsbonus.',
    supportLimited: 'Begrenzte Unterstützung: nur kleiner Stabilitätsbonus.',
    noProtection: 'Kein staatlicher Preisschutz.',
    installUnavailable: 'Installationsmodus ist in diesem Browser nicht verfügbar',
    playerCreated: 'Spieler {name} erstellt',
    marketEvent: 'Marktereignis: {title}',
    selectedStatus: '{symbol} ausgewählt',
  },
  fr: {
    brand: 'Académie de trading',
    title: 'Simulateur de marché',
    language: 'Langue',
    navMarket: 'Marché',
    navIntel: 'Analyse',
    navTrades: 'Trades',
    navNews: 'Infos',
    navPortfolio: 'Portefeuille',
    navStore: 'Boutique',
    navAuth: 'Compte',
    player: 'Joueur',
    create: 'Créer',
    playGuest: 'Jouer invité',
    guestMode: 'Mode invité',
    loginRegister: 'Connexion / inscription',
    logout: 'Déconnexion',
    accountReady: 'Joueur : {name}',
    guestCreated: 'Joueur invité {name} créé',
    market: 'Marché',
    exchangeFloor: 'Salle de marché',
    autoMarket: 'Marché auto',
    marketChart: 'Graphique du marché',
    pulseNow: 'Tick manuel',
    liveSimulation: 'Simulation en direct',
    marketOpen: 'Marché ouvert',
    symbol: 'Symbole',
    company: 'Société',
    sector: 'Secteur',
    price: 'Prix',
    change: 'Variation',
    order: 'Ordre',
    trade: 'Trading',
    walletBalance: 'Solde du portefeuille',
    selected: 'Sélection',
    chooseCompany: 'Choisissez une société',
    chooseHint: 'Cliquez sur une tuile du marché pour préparer un ordre.',
    quantity: 'Quantité',
    buy: 'Acheter',
    sell: 'Vendre',
    placeOrder: 'Placer ordre',
    latestEvent: 'Dernier événement',
    noEvent: 'Aucun événement',
    eventHint: 'Le marché évolue automatiquement.',
    ready: 'Prêt',
    owner: 'Propriétaire',
    workers: 'Employés',
    opened: 'Créée',
    noDescription: 'Pas encore de description.',
    unknown: 'Inconnu',
    notAvailable: 'Indisponible',
    noPriceHistory: 'Pas encore d’historique de prix',
    priceHistory: 'historique',
    waitingData: 'En attente de données',
    noHistory: 'Pas encore d’historique',
    buyPressure: 'Pression acheteuse',
    governmentSupport: 'Soutien public',
    noSupport: 'Aucun soutien actif',
    amount: 'Montant',
    tax: 'Impôt',
    loan: 'Crédit',
    until: 'Jusqu’à',
    risk: 'Risque',
    supportScore: 'score de soutien',
    supportStrong: 'Soutien fort : baisse amortie et biais de croissance.',
    supportModerate: 'Soutien moyen : baisses réduites et léger biais de croissance.',
    supportLimited: 'Soutien limité : petit bonus de stabilité.',
    noProtection: 'Pas de protection de prix par l’État.',
    installUnavailable: 'Mode installation indisponible dans ce navigateur',
    playerCreated: 'Joueur {name} créé',
    marketEvent: 'Événement marché : {title}',
    selectedStatus: '{symbol} sélectionné',
  },
};

const gameText = {
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
  descriptions: {
    NOVA: {
      ru: 'Производит автономных складских роботов и системы машинного зрения для логистики.',
      he: 'מייצרת רובוטים אוטונומיים למחסנים ומערכות ראייה ממוחשבת ללוגיסטיקה.',
      de: 'Baut autonome Lagerroboter und Bildverarbeitungssysteme für Logistikunternehmen.',
      fr: 'Développe des robots d’entrepôt autonomes et des systèmes de vision pour la logistique.',
    },
    SOLR: {
      ru: 'Управляет солнечными микросетями и ПО для балансировки батарей в городах.',
      he: 'מפעילה מיקרו-רשתות סולאריות ותוכנה לאיזון סוללות בערים.',
      de: 'Betreibt Solar-Mikronetze und Software zur Batteriesaldierung für Städte.',
      fr: 'Exploite des micro-réseaux solaires et des logiciels d’équilibrage de batteries.',
    },
    MEDX: {
      ru: 'Разрабатывает диагностические инструменты и AI-наборы скрининга для клиник.',
      he: 'מפתחת כלי אבחון וערכות סינון מבוססות AI למרפאות.',
      de: 'Entwickelt Diagnosetools und KI-gestützte Screening-Kits für Kliniken.',
      fr: 'Développe des outils de diagnostic et des kits de dépistage assistés par IA.',
    },
    BYTE: {
      ru: 'Выпускает соревновательные мобильные игры и live-service экономики.',
      he: 'מוציאה משחקי מובייל תחרותיים וכלכלות live-service.',
      de: 'Veröffentlicht kompetitive Mobile Games und Live-Service-Ökonomien.',
      fr: 'Publie des jeux mobiles compétitifs et des économies live-service.',
    },
    AERO: {
      ru: 'Производит инспекционные дроны для портов, ферм и строительных объектов.',
      he: 'מייצרת רחפני בדיקה לנמלים, חוות ואתרי בנייה.',
      de: 'Produziert Inspektionsdrohnen für Häfen, Farmen und Baustellen.',
      fr: 'Fabrique des drones d’inspection pour ports, fermes et chantiers.',
    },
    FARM: {
      ru: 'Развивает вертикальные фермы и аналитику урожая для сетей супермаркетов.',
      he: 'מפעילה חוות אנכיות וניתוח יבולים לרשתות סופרמרקטים.',
      de: 'Betreibt vertikale Farmen und Ernteanalytik für Supermärkte.',
      fr: 'Exploite des fermes verticales et de l’analyse agricole pour supermarchés.',
    },
    FINX: {
      ru: 'Предоставляет платёжные рельсы, скоринг мошенничества и расчёты для мерчантов.',
      he: 'מספקת תשתיות תשלום, ניקוד הונאות וסליקה לסוחרים.',
      de: 'Bietet Zahlungsinfrastruktur, Betrugsscoring und Händlerabrechnung.',
      fr: 'Fournit rails de paiement, scoring anti-fraude et règlement marchand.',
    },
    EDU: {
      ru: 'Продаёт учебные платформы, экзамены и аналитические панели для школ.',
      he: 'מוכרת פלטפורמות למידה, מבחנים ולוחות ניתוח לבתי ספר.',
      de: 'Verkauft Lernplattformen, Prüfungen und Analyse-Dashboards an Schulen.',
      fr: 'Vend des plateformes d’apprentissage, examens et tableaux d’analyse aux écoles.',
    },
    CYBR: {
      ru: 'Защищает бизнес через endpoint-защиту, аудит паролей и реагирование на инциденты.',
      he: 'מגינה על עסקים עם הגנת קצה, ביקורת סיסמאות ותגובה לאירועים.',
      de: 'Schützt Unternehmen mit Endpoint-Schutz, Passwortaudits und Incident Response.',
      fr: 'Protège les entreprises avec défense endpoint, audit de mots de passe et réponse incident.',
    },
    OCEA: {
      ru: 'Координирует контейнерные маршруты, расписание портов и оптимизацию топлива.',
      he: 'מתאמת נתיבי מכולות, תזמון נמלים ואופטימיזציית דלק.',
      de: 'Koordiniert Containerstrecken, Hafenplanung und Kraftstoffoptimierung.',
      fr: 'Coordonne routes de conteneurs, planning portuaire et optimisation carburant.',
    },
    FOAM: {
      ru: 'Производит лёгкие изоляционные панели и перерабатываемую упаковку.',
      he: 'מייצרת לוחות בידוד קלים ואריזות ניתנות למחזור.',
      de: 'Produziert leichte Dämmplatten und recycelbare Verpackungen.',
      fr: 'Produit des panneaux isolants légers et des emballages recyclables.',
    },
    LUX: {
      ru: 'Управляет премиальными магазинами и marketplace брендов для потребителей.',
      he: 'מפעילה חנויות פרימיום ושוק מותגים לצרכנים.',
      de: 'Betreibt Premium-Läden und einen Marken-Marktplatz für Verbraucher.',
      fr: 'Exploite des boutiques premium et une place de marché de marques.',
    },
  },
  supportTypes: {
    none: { ru: 'нет', he: 'אין', de: 'keine', fr: 'aucun' },
    'R&D grant': { ru: 'Грант на исследования', he: 'מענק מו״פ', de: 'Forschungszuschuss', fr: 'Subvention R&D' },
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
  signals: {
    'Thin history': { ru: 'Мало истории', he: 'היסטוריה דקה', de: 'Dünne Historie', fr: 'Historique limité' },
    Momentum: { ru: 'Импульс', he: 'מומנטום', de: 'Momentum', fr: 'Momentum' },
    Caution: { ru: 'Осторожно', he: 'זהירות', de: 'Vorsicht', fr: 'Prudence' },
    Accumulation: { ru: 'Накопление', he: 'צבירה', de: 'Akkumulation', fr: 'Accumulation' },
    Distribution: { ru: 'Распределение', he: 'פיזור', de: 'Distribution', fr: 'Distribution' },
    Balanced: { ru: 'Баланс', he: 'מאוזן', de: 'Ausgewogen', fr: 'Équilibré' },
    'State-backed': { ru: 'Поддержка государства', he: 'נתמך מדינה', de: 'Staatlich gestützt', fr: 'Soutenu par l’État' },
  },
  events: {
    'AI regulation relief': { ru: 'Смягчение регулирования ИИ', he: 'הקלה ברגולציית AI', de: 'Lockerung der KI-Regulierung', fr: 'Assouplissement de la régulation IA' },
    'Energy storage shortage': { ru: 'Дефицит накопителей энергии', he: 'מחסור באגירת אנרגיה', de: 'Mangel an Energiespeichern', fr: 'Pénurie de stockage énergétique' },
    'Clinical trial surprise': { ru: 'Сюрприз клинических испытаний', he: 'הפתעת ניסוי קליני', de: 'Überraschung in klinischer Studie', fr: 'Surprise d’essai clinique' },
    'Streaming platform partnership': { ru: 'Партнёрство со стриминговой платформой', he: 'שותפות פלטפורמת סטרימינג', de: 'Streaming-Partnerschaft', fr: 'Partenariat avec plateforme streaming' },
    'Market risk-off session': { ru: 'Рынок уходит от риска', he: 'שוק נמנע מסיכון', de: 'Risk-off-Sitzung', fr: 'Séance d’aversion au risque' },
    'Drone inspection contracts': { ru: 'Контракты на инспекционные дроны', he: 'חוזי רחפני בדיקה', de: 'Drohnen-Inspektionsverträge', fr: 'Contrats de drones d’inspection' },
    'Fresh food supply deal': { ru: 'Сделка по поставкам свежих продуктов', he: 'עסקת אספקת מזון טרי', de: 'Lieferdeal für Frischwaren', fr: 'Accord d’approvisionnement alimentaire' },
    'Merchant fraud scare': { ru: 'Всплеск мошенничества у мерчантов', he: 'חשש מהונאות סוחרים', de: 'Betrugsangst bei Händlern', fr: 'Alerte fraude marchands' },
    'School platform rollout': { ru: 'Запуск школьных платформ', he: 'השקת פלטפורמות לבתי ספר', de: 'Einführung von Schulplattformen', fr: 'Déploiement de plateformes scolaires' },
    'Security breach cycle': { ru: 'Волна инцидентов безопасности', he: 'גל פרצות אבטחה', de: 'Welle von Sicherheitsvorfällen', fr: 'Cycle de failles de sécurité' },
    'Port congestion easing': { ru: 'Снижение перегрузки портов', he: 'הקלה בעומסי נמלים', de: 'Nachlassende Hafenüberlastung', fr: 'Allègement de congestion portuaire' },
    'Raw material price jump': { ru: 'Скачок цен на сырьё', he: 'קפיצה במחירי חומרי גלם', de: 'Sprung bei Rohstoffpreisen', fr: 'Hausse des matières premières' },
    'Consumer demand pop': { ru: 'Всплеск потребительского спроса', he: 'זינוק בביקוש צרכני', de: 'Anstieg der Konsumnachfrage', fr: 'Hausse de demande consommateur' },
  },
  eventDescriptions: {
    'Regulators delay strict AI licensing rules, lifting the AI sector.': { ru: 'Регуляторы откладывают строгие лицензии для ИИ, что поддерживает сектор.', he: 'הרגולטורים דוחים רישוי AI מחמיר והסקטור מתחזק.', de: 'Regulierer verschieben strenge KI-Lizenzen und stützen den Sektor.', fr: 'Les régulateurs reportent des licences IA strictes, ce qui soutient le secteur.' },
    'Battery supply pressure hurts renewable energy margins.': { ru: 'Давление на поставки батарей снижает маржу зелёной энергетики.', he: 'לחץ באספקת סוללות פוגע בשולי הרווח של אנרגיה מתחדשת.', de: 'Druck bei Batterielieferungen belastet Margen erneuerbarer Energien.', fr: 'La pression sur les batteries pèse sur les marges des renouvelables.' },
    'A healthcare trial result changes investor appetite overnight.': { ru: 'Результат медицинского испытания резко меняет интерес инвесторов.', he: 'תוצאת ניסוי בריאות משנה את תיאבון המשקיעים בן לילה.', de: 'Ein Studienergebnis verändert die Anlegernachfrage über Nacht.', fr: 'Un résultat clinique change l’appétit des investisseurs.' },
    'A large distribution deal boosts gaming revenue expectations.': { ru: 'Крупная сделка по дистрибуции повышает ожидания выручки игр.', he: 'עסקת הפצה גדולה מעלה ציפיות הכנסות בגיימינג.', de: 'Ein großer Vertriebsdeal hebt Umsatzerwartungen im Gaming.', fr: 'Un grand accord de distribution relève les attentes de revenus jeux.' },
    'Players rotate into cash after a simulated macro shock.': { ru: 'Игроки уходят в кэш после макрошока симуляции.', he: 'שחקנים עוברים למזומן אחרי זעזוע מאקרו מדומה.', de: 'Spieler rotieren nach einem Makroschock in Cash.', fr: 'Les joueurs passent au cash après un choc macro simulé.' },
    'Infrastructure companies expand drone inspections across remote sites.': { ru: 'Инфраструктурные компании расширяют инспекции дронами на удалённых объектах.', he: 'חברות תשתית מרחיבות בדיקות רחפן באתרים מרוחקים.', de: 'Infrastrukturunternehmen erweitern Drohneninspektionen an entfernten Standorten.', fr: 'Les entreprises d’infrastructure étendent les inspections par drones.' },
    'Retailers sign new local farming supply agreements.': { ru: 'Ритейлеры подписывают новые договоры поставок с локальными фермами.', he: 'קמעונאים חותמים על הסכמי אספקה חדשים עם חוות מקומיות.', de: 'Händler unterzeichnen neue Lieferverträge mit lokalen Farmen.', fr: 'Les détaillants signent de nouveaux accords avec des fermes locales.' },
    'Payment providers face scrutiny after a simulated fraud wave.': { ru: 'Платёжные провайдеры попадают под проверку после волны мошенничества.', he: 'ספקי תשלום נבדקים אחרי גל הונאות מדומה.', de: 'Zahlungsanbieter geraten nach einer Betrugswelle unter Beobachtung.', fr: 'Les fournisseurs de paiement sont surveillés après une vague de fraude.' },
    'Districts expand digital learning subscriptions for the next term.': { ru: 'Учебные округа расширяют подписки на цифровое обучение.', he: 'מחוזות חינוך מרחיבים מנויי למידה דיגיטלית.', de: 'Schulbezirke erweitern digitale Lernabos.', fr: 'Les districts scolaires étendent les abonnements d’apprentissage numérique.' },
    'Companies increase security budgets after several fictional attacks.': { ru: 'Компании повышают бюджеты безопасности после нескольких вымышленных атак.', he: 'חברות מעלות תקציבי אבטחה אחרי כמה תקיפות מדומות.', de: 'Unternehmen erhöhen Sicherheitsbudgets nach mehreren fiktiven Angriffen.', fr: 'Les entreprises augmentent leurs budgets sécurité après plusieurs attaques fictives.' },
    'Shipping schedules normalize and logistics margins improve.': { ru: 'Графики перевозок нормализуются, маржа логистики улучшается.', he: 'לוחות משלוח מתייצבים ושולי הרווח בלוגיסטיקה משתפרים.', de: 'Fahrpläne normalisieren sich und Logistikmargen verbessern sich.', fr: 'Les plannings de transport se normalisent et les marges logistiques s’améliorent.' },
    'Manufacturing input costs rise and pressure near-term margins.': { ru: 'Производственные затраты растут и давят на краткосрочную маржу.', he: 'עלויות ייצור עולות ולוחצות על מרווחים בטווח הקצר.', de: 'Produktionskosten steigen und belasten kurzfristige Margen.', fr: 'Les coûts industriels augmentent et pèsent sur les marges proches.' },
    'Premium retail demand improves after a strong simulated holiday cycle.': { ru: 'Спрос на премиальный ритейл растёт после сильного праздничного цикла.', he: 'הביקוש לקמעונאות פרימיום משתפר אחרי עונת חגים חזקה.', de: 'Premium-Einzelhandelsnachfrage steigt nach starker Feiertagssaison.', fr: 'La demande retail premium progresse après une forte période de fêtes.' },
  },
};

function gameLabel(group, key) {
  if (!key) return '';
  const entry = gameText[group]?.[key];
  if (entry?.[state.language]) return entry[state.language];
  if (group === 'descriptions') return '';
  return key;
}

function translateEventText(text) {
  return gameLabel('events', text) || gameLabel('eventDescriptions', text) || text;
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const nodes = {
  ticker: document.querySelector('#ticker'),
  companyBoard: document.querySelector('#companyBoard'),
  companiesBody: document.querySelector('#companiesBody'),
  orderSymbol: document.querySelector('#orderSymbol'),
  orderQuantity: document.querySelector('#orderQuantity'),
  orderForm: document.querySelector('#orderForm'),
  buyButton: document.querySelector('#buyButton'),
  sellButton: document.querySelector('#sellButton'),
  createPlayerButton: document.querySelector('#createPlayerButton'),
  accountStatus: document.querySelector('#accountStatus'),
  logoutButton: document.querySelector('#logoutButton'),
  languageSelect: document.querySelector('#languageSelect'),
  tickButton: document.querySelector('#tickButton'),
  eventTitle: document.querySelector('#eventTitle'),
  eventDescription: document.querySelector('#eventDescription'),
  boardSignal: document.querySelector('#boardSignal'),
  clockLabel: document.querySelector('#clockLabel'),
  clockCountdown: document.querySelector('#clockCountdown'),
  walletBalance: document.querySelector('#walletBalance'),
  walletBox: document.querySelector('#walletBox'),
  selectedAsset: document.querySelector('#selectedAsset'),
  statusLine: document.querySelector('#statusLine'),
  canvas: document.querySelector('#marketCanvas'),
};

function t(key, values = {}) {
  const dictionary = translations[state.language] || translations.en;
  const template = dictionary[key] || translations.en[key] || key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    template,
  );
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === 'he' ? 'rtl' : 'ltr';
  nodes.languageSelect.value = state.language;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  renderSelectedAsset();
  renderAccountStatus();
  renderWallet();
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
  nodes.statusLine.textContent = message;
}

function numberValue(value) {
  return Number(value || 0);
}

function changePercent(company) {
  const previous = numberValue(company.previous_price);
  const current = numberValue(company.price);
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function renderCompanies() {
  if (!state.selectedSymbol && state.companies.length) {
    state.selectedSymbol = state.companies[0].symbol;
  }

  renderCompanyBoard();

  nodes.ticker.innerHTML = state.companies
    .map((company) => {
      const change = changePercent(company);
      const className = change >= 0 ? 'gain' : 'loss';
      return `
        <div class="ticker-item">
          <strong>${company.symbol} ${money.format(numberValue(company.price))}</strong>
          <span class="${className}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</span>
        </div>
      `;
    })
    .join('');

  nodes.companiesBody.innerHTML = state.companies
    .map((company) => {
      const change = changePercent(company);
      const className = change >= 0 ? 'gain' : 'loss';
      return `
        <tr>
          <td class="symbol-cell">${company.symbol}</td>
          <td>${company.name}</td>
          <td>${gameLabel('sectors', company.sector)}</td>
          <td>${money.format(numberValue(company.price))}</td>
          <td class="${className}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</td>
        </tr>
      `;
    })
    .join('');

  nodes.orderSymbol.innerHTML = state.companies
    .map((company) => `<option value="${company.symbol}">${company.symbol}</option>`)
    .join('');

  nodes.orderSymbol.value = state.selectedSymbol;
  renderSelectedAsset();
  drawMarket();
}

function renderCompanyBoard() {
  nodes.companyBoard.innerHTML = state.companies
    .map((company) => {
      const change = changePercent(company);
      const className = change >= 0 ? 'gain' : 'loss';
      const isActive = company.symbol === state.selectedSymbol ? 'active' : '';
      return `
        <button class="company-tile ${isActive}" type="button" data-symbol="${company.symbol}">
          <div class="tile-top">
            <span class="tile-symbol">${company.symbol}</span>
            <span class="tile-sector">${gameLabel('sectors', company.sector)}</span>
          </div>
          <p class="tile-name">${company.name}</p>
          <div class="tile-bottom">
            <span class="tile-price">${money.format(numberValue(company.price))}</span>
            <span class="tile-change ${className}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</span>
          </div>
        </button>
      `;
    })
    .join('');
}

function renderSelectedAsset() {
  const company = state.companies.find((item) => item.symbol === state.selectedSymbol);
  if (!company) return;

  const change = changePercent(company);
  const insight = state.marketHistory?.insights.find((item) => item.symbol === company.symbol);
  nodes.selectedAsset.innerHTML = `
    <span>${t('selected')}</span>
    <strong>${company.symbol} ${money.format(numberValue(company.price))}</strong>
    <p>${company.name} / ${gameLabel('sectors', company.sector)} / ${change >= 0 ? '+' : ''}${change.toFixed(2)}%</p>
    <div class="trade-signal">
      <b>${insight ? gameLabel('signals', insight.signal) : t('waitingData')}</b>
      <span>${insight ? `${t('buyPressure')} ${Number(insight.buy_pressure_percent).toFixed(0)}%` : t('noHistory')}</span>
    </div>
  `;
}

function renderMarketHistory(history) {
  state.marketHistory = history;
  renderSelectedAsset();
}

function renderSparkline(points) {
  if (!points.length) {
    return `<span class="empty-chart">${t('noPriceHistory')}</span>`;
  }

  const prices = points.map((point) => numberValue(point.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const coordinates = prices
    .map((price, index) => {
      const x = prices.length === 1 ? 100 : (index / (prices.length - 1)) * 100;
      const y = 42 - ((price - min) / range) * 34;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const growth = prices[0] ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100 : 0;

  return `
    <svg viewBox="0 0 100 48" preserveAspectRatio="none" aria-label="Price growth chart">
      <polyline points="${coordinates}" />
    </svg>
    <small class="${growth >= 0 ? 'gain' : 'loss'}">${growth >= 0 ? '+' : ''}${growth.toFixed(2)}% ${t('priceHistory')}</small>
  `;
}

function renderGovernmentSupport(company, insight) {
  const supportType = company.government_support_type || 'none';
  const hasSupport = supportType !== 'none';
  const score = Number(insight?.support_score || 0);

  return `
    <div class="support-box ${hasSupport ? 'supported' : 'unsupported'}">
      <div>
        <span>${t('governmentSupport')}</span>
        <strong>${hasSupport ? gameLabel('supportTypes', supportType) : t('noSupport')}</strong>
      </div>
      <dl>
        <div>
          <dt>${t('amount')}</dt>
          <dd>${money.format(numberValue(company.government_support_amount))}</dd>
        </div>
        <div>
          <dt>${t('tax')}</dt>
          <dd>${numberValue(company.tax_benefit_percent).toFixed(1)}%</dd>
        </div>
        <div>
          <dt>${t('loan')}</dt>
          <dd>${numberValue(company.state_loan_rate_percent).toFixed(1)}%</dd>
        </div>
        <div>
          <dt>${t('until')}</dt>
          <dd>${company.support_expires_year || t('notAvailable')}</dd>
        </div>
      </dl>
      <p>${t('risk')}: ${gameLabel('risks', company.support_risk_level || 'none')} / ${t('supportScore')} ${score.toFixed(0)}/100</p>
      <p>${hasSupport ? getSupportRuleText(score) : t('noProtection')}</p>
    </div>
  `;
}

function getSupportRuleText(score) {
  if (score >= 70) {
    return t('supportStrong');
  }

  if (score >= 35) {
    return t('supportModerate');
  }

  return t('supportLimited');
}

function formatCount(value) {
  return new Intl.NumberFormat('en-US').format(numberValue(value));
}

function drawMarket() {
  const canvas = nodes.canvas;
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);

  if (state.companies.length === 0) return;

  const maxPrice = Math.max(...state.companies.map((company) => numberValue(company.price)));
  const barWidth = width / state.companies.length;

  state.companies.forEach((company, index) => {
    const price = numberValue(company.price);
    const barHeight = Math.max(20, (price / maxPrice) * (height - 52));
    const x = index * barWidth + 26;
    const y = height - barHeight - 30;
    const gradient = context.createLinearGradient(0, y, 0, height);
    gradient.addColorStop(0, '#176b63');
    gradient.addColorStop(1, '#d48a3d');
    context.fillStyle = gradient;
    context.fillRect(x, y, Math.max(34, barWidth - 52), barHeight);
    context.fillStyle = '#dce8e3';
    context.font = '700 15px system-ui';
    context.fillText(company.symbol, x, height - 10);
    context.fillStyle = 'rgba(220, 232, 227, 0.70)';
    context.font = '12px system-ui';
    context.fillText(money.format(price), x, y - 8);
  });
}

async function loadCompanies() {
  state.companies = await api('/market/companies');
  state.history.push(state.companies.map((company) => numberValue(company.price)));
  renderCompanies();
}

async function loadPortfolio() {
  if (!state.playerId) {
    state.portfolio = null;
    renderWallet();
    return null;
  }
  state.portfolio = await api(`/market/players/${state.playerId}/portfolio`);
  renderWallet();
  return state.portfolio;
}

function renderWallet() {
  if (!nodes.walletBalance || !nodes.walletBox) return;
  const cash = state.portfolio ? numberValue(state.portfolio.cash_balance) : 0;
  nodes.walletBalance.textContent = money.format(cash);
  nodes.walletBox.classList.toggle('empty', !state.playerId);
}

async function loadMarketHistory() {
  const history = await api('/market/history');
  renderMarketHistory(history);
}

async function loadMarketClock() {
  const clock = await api('/market/clock');
  renderMarketClock(clock);
}

function renderMarketClock(clock) {
  const nextTickTime = clock.next_tick_at ? new Date(clock.next_tick_at).getTime() : Date.now();
  const seconds = Math.max(0, Math.ceil((nextTickTime - Date.now()) / 1000));
  nodes.clockLabel.textContent = t('autoMarket');
  nodes.clockCountdown.textContent = `${seconds}s`;
}

async function refreshLiveMarket() {
  await loadCompanies();
  await loadMarketHistory();
  await loadMarketClock();
  await loadPortfolio();
}

async function createPlayer() {
  const displayName = localStorage.getItem('market_player_name') || 'Guest Trader';
  const result = await api('/users/guest', {
    method: 'POST',
    body: JSON.stringify({ display_name: displayName }),
  });
  const player = result.player;
  state.playerId = player.id;
  localStorage.setItem('market_player_id', String(player.id));
  localStorage.setItem('market_player_name', player.display_name);
  localStorage.setItem('market_auth_mode', 'guest');
  localStorage.removeItem('market_user');
  renderAccountStatus();
  setStatus(t('guestCreated', { name: player.display_name }));
  await loadPortfolio();
}

function renderAccountStatus() {
  const user = readJson('market_user');
  const playerName = localStorage.getItem('market_player_name');
  const name = user?.display_name || playerName;
  if (nodes.accountStatus) {
    nodes.accountStatus.textContent = name ? t('accountReady', { name }) : t('guestMode');
  }
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem('market_user');
  localStorage.removeItem('market_player_id');
  localStorage.removeItem('market_player_name');
  localStorage.removeItem('market_auth_mode');
  state.playerId = null;
  renderAccountStatus();
  setStatus(t('guestMode'));
}

async function placeOrder(event) {
  event.preventDefault();
  if (!state.playerId) {
    await createPlayer();
  }

  const result = await api('/market/orders', {
    method: 'POST',
    body: JSON.stringify({
      player_id: state.playerId,
      symbol: nodes.orderSymbol.value,
      side: state.side,
      quantity: Number(nodes.orderQuantity.value),
    }),
  });

  setStatus(`${result.trade.side.toUpperCase()} ${result.trade.quantity} ${result.trade.symbol}`);
  await loadMarketHistory();
  await loadPortfolio();
}

async function marketTick() {
  const result = await api('/market/tick', { method: 'POST' });
  nodes.eventTitle.textContent = translateEventText(result.event.title);
  nodes.eventDescription.textContent = translateEventText(result.event.description);
  nodes.boardSignal.textContent = translateEventText(result.event.title);
  setStatus(t('marketEvent', { title: translateEventText(result.event.title) }));
  await loadCompanies();
  await loadMarketHistory();
}

function startAutoRefresh() {
  setInterval(() => {
    refreshLiveMarket().catch(showError);
  }, 5000);

  setInterval(() => {
    loadMarketClock().catch(() => undefined);
  }, 1000);
}

function bindEvents() {
  nodes.createPlayerButton.addEventListener('click', () => createPlayer().catch(showError));
  nodes.logoutButton.addEventListener('click', logout);
  nodes.orderForm.addEventListener('submit', (event) => placeOrder(event).catch(showError));
  nodes.tickButton.addEventListener('click', () => marketTick().catch(showError));
  nodes.companyBoard.addEventListener('click', (event) => {
    const tile = event.target.closest('[data-symbol]');
    if (!tile) return;
    state.selectedSymbol = tile.dataset.symbol;
    nodes.orderSymbol.value = state.selectedSymbol;
    renderCompanyBoard();
    renderSelectedAsset();
    setStatus(t('selectedStatus', { symbol: state.selectedSymbol }));
  });
  nodes.orderSymbol.addEventListener('change', () => {
    state.selectedSymbol = nodes.orderSymbol.value;
    renderCompanyBoard();
    renderSelectedAsset();
  });
  nodes.languageSelect.addEventListener('change', () => {
    state.language = nodes.languageSelect.value;
    localStorage.setItem('market_language', state.language);
    applyLanguage();
  });

  [nodes.buyButton, nodes.sellButton].forEach((button) => {
    button.addEventListener('click', () => {
      state.side = button.dataset.side;
      nodes.buyButton.classList.toggle('active', state.side === 'buy');
      nodes.sellButton.classList.toggle('active', state.side === 'sell');
    });
  });

}

function showError(error) {
  setStatus(error.message.replace(/[{}"]/g, ''));
}

async function boot() {
  registerAppShell();
  bindEvents();
  applyLanguage();
  await loadCompanies();
  await loadMarketHistory();
  await loadMarketClock();
  startAutoRefresh();
}

boot().catch(showError);

function registerAppShell() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.register('/game/sw.js', { scope: '/game/' }).catch(() => {
    setStatus(t('installUnavailable'));
  });
}
