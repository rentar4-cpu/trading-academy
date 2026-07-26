const nodes = {
  newsList: document.querySelector('#newsList'),
  impactMap: document.querySelector('#impactMap'),
  newsStatus: document.querySelector('#newsStatus'),
  newsClock: document.querySelector('#newsClock'),
};
let currentLanguage = localStorage.getItem('market_language') || 'en';

const newsTranslations = {
  en: {
    language: 'Language',
    brand: 'Trading Academy',
    title: 'Market News',
    navMarket: 'Market',
    navIntel: 'Intel',
    navTrades: 'Trades',
    navNews: 'News',
    navPortfolio: 'Portfolio',
    navStore: 'Store',
    navAuth: 'Account',
    forwardSignals: 'Forward Signals',
    eventsTitle: 'Events That May Move Prices',
    heroText:
      'Read scheduled macro events before they hit the market. Each item shows probability, affected sector or company, expected impact, and risk level.',
    autoMarket: 'Auto market',
    calendar: 'Calendar',
    upcomingNews: 'Upcoming News',
    impactMap: 'Impact Map',
    watchlist: 'Watchlist',
    target: 'Target',
    probability: 'Probability',
    impact: 'Impact',
    globalMarket: 'Global market',
    upcomingEvent: 'upcoming event',
    upcomingEvents: 'upcoming events',
    loadingNews: 'Loading news',
    loaded: '{count} future events loaded',
  },
  ru: {
    language: 'Язык',
    brand: 'Торговая академия',
    title: 'Новости рынка',
    navMarket: 'Рынок',
    navIntel: 'Аналитика',
    navTrades: 'Сделки',
    navNews: 'Новости',
    navPortfolio: 'Портфель',
    navStore: 'Магазин',
    navAuth: 'Аккаунт',
    forwardSignals: 'Будущие сигналы',
    eventsTitle: 'События, которые могут изменить цены',
    heroText:
      'Читайте запланированные макро-события до того, как они ударят по рынку. У каждой новости есть вероятность, цель, ожидаемое влияние и риск.',
    autoMarket: 'Авторынок',
    calendar: 'Календарь',
    upcomingNews: 'Будущие новости',
    impactMap: 'Карта влияния',
    watchlist: 'Список наблюдения',
    target: 'Цель',
    probability: 'Вероятность',
    impact: 'Влияние',
    globalMarket: 'Весь рынок',
    upcomingEvent: 'будущее событие',
    upcomingEvents: 'будущих событий',
    loadingNews: 'Загрузка новостей',
    loaded: 'Загружено будущих событий: {count}',
  },
  he: {
    language: 'שפה',
    brand: 'אקדמיית מסחר',
    title: 'חדשות שוק',
    navMarket: 'שוק',
    navIntel: 'מודיעין',
    navTrades: 'עסקאות',
    navNews: 'חדשות',
    navPortfolio: 'תיק',
    navStore: 'חנות',
    navAuth: 'חשבון',
    forwardSignals: 'אותות עתידיים',
    eventsTitle: 'אירועים שעשויים להזיז מחירים',
    heroText:
      'קרא אירועי מאקרו מתוכננים לפני שהם משפיעים על השוק. כל פריט מציג הסתברות, יעד, השפעה צפויה ורמת סיכון.',
    autoMarket: 'שוק אוטומטי',
    calendar: 'לוח שנה',
    upcomingNews: 'חדשות עתידיות',
    impactMap: 'מפת השפעה',
    watchlist: 'רשימת מעקב',
    target: 'יעד',
    probability: 'הסתברות',
    impact: 'השפעה',
    globalMarket: 'כל השוק',
    upcomingEvent: 'אירוע עתידי',
    upcomingEvents: 'אירועים עתידיים',
    loadingNews: 'טוען חדשות',
    loaded: 'נטענו {count} אירועים עתידיים',
  },
  de: {
    language: 'Sprache',
    brand: 'Handelsakademie',
    title: 'Marktnachrichten',
    navMarket: 'Markt',
    navIntel: 'Analyse',
    navTrades: 'Handel',
    navNews: 'Nachrichten',
    navPortfolio: 'Depot',
    navStore: 'Laden',
    navAuth: 'Konto',
    forwardSignals: 'Zukunftssignale',
    eventsTitle: 'Ereignisse, die Preise bewegen können',
    heroText:
      'Lies geplante Makroereignisse, bevor sie den Markt treffen. Jedes Ereignis zeigt Wahrscheinlichkeit, Ziel, erwartete Wirkung und Risiko.',
    autoMarket: 'Automarkt',
    calendar: 'Kalender',
    upcomingNews: 'Kommende News',
    impactMap: 'Einflusskarte',
    watchlist: 'Beobachtungsliste',
    target: 'Ziel',
    probability: 'Wahrscheinlichkeit',
    impact: 'Wirkung',
    globalMarket: 'Gesamtmarkt',
    upcomingEvent: 'kommendes Ereignis',
    upcomingEvents: 'kommende Ereignisse',
    loadingNews: 'Nachrichten werden geladen',
    loaded: '{count} künftige Ereignisse geladen',
  },
  fr: {
    language: 'Langue',
    brand: 'Académie de trading',
    title: 'Infos marché',
    navMarket: 'Marché',
    navIntel: 'Analyse',
    navTrades: 'Transactions',
    navNews: 'Infos',
    navPortfolio: 'Portefeuille',
    navStore: 'Boutique',
    navAuth: 'Compte',
    forwardSignals: 'Signaux futurs',
    eventsTitle: 'Événements pouvant influencer les prix',
    heroText:
      'Lisez les événements macro prévus avant leur impact sur le marché. Chaque carte indique probabilité, cible, impact attendu et risque.',
    autoMarket: 'Marché auto',
    calendar: 'Calendrier',
    upcomingNews: 'Infos à venir',
    impactMap: 'Carte d’impact',
    watchlist: 'Liste de suivi',
    target: 'Cible',
    probability: 'Probabilité',
    impact: 'Effet',
    globalMarket: 'Marché global',
    upcomingEvent: 'événement à venir',
    upcomingEvents: 'événements à venir',
    loadingNews: 'Chargement des infos',
    loaded: '{count} événements futurs chargés',
  },
};

const newsDataText = {
  categories: {
    War: { ru: 'Война', he: 'מלחמה', de: 'Krieg', fr: 'Guerre' },
    Security: { ru: 'Безопасность', he: 'ביטחון', de: 'Sicherheit', fr: 'Sécurité' },
    'Supply Chain': { ru: 'Цепочки поставок', he: 'שרשרת אספקה', de: 'Lieferkette', fr: 'Chaîne logistique' },
    'State Alliance': { ru: 'Альянс государств', he: 'ברית מדינות', de: 'Staatenallianz', fr: 'Alliance d’États' },
    Drought: { ru: 'Засуха', he: 'בצורת', de: 'Dürre', fr: 'Sécheresse' },
    'Tax Policy': { ru: 'Налоговая политика', he: 'מדיניות מס', de: 'Steuerpolitik', fr: 'Politique fiscale' },
    'Government Support': { ru: 'Господдержка', he: 'תמיכת מדינה', de: 'Staatliche Unterstützung', fr: 'Soutien public' },
    'Business Alliance': { ru: 'Бизнес-альянс', he: 'ברית עסקית', de: 'Geschäftsallianz', fr: 'Alliance commerciale' },
  },
  sectors: {
    Aerospace: { ru: 'Аэрокосмос', he: 'תעופה וחלל', de: 'Luft- und Raumfahrt', fr: 'Aérospatial' },
    Logistics: { ru: 'Логистика', he: 'לוגיסטיקה', de: 'Logistik', fr: 'Logistique' },
    Gaming: { ru: 'Игры', he: 'משחקים', de: 'Gaming', fr: 'Jeux vidéo' },
    Healthcare: { ru: 'Здравоохранение', he: 'בריאות', de: 'Gesundheitswesen', fr: 'Santé' },
    Energy: { ru: 'Энергетика', he: 'אנרגיה', de: 'Energie', fr: 'Énergie' },
    Cybersecurity: { ru: 'Кибербезопасность', he: 'סייבר', de: 'Cybersicherheit', fr: 'Cybersécurité' },
    AI: { ru: 'ИИ', he: 'בינה מלאכותית', de: 'KI', fr: 'IA' },
    Agriculture: { ru: 'Сельское хозяйство', he: 'חקלאות', de: 'Landwirtschaft', fr: 'Agriculture' },
    Fintech: { ru: 'Финтех', he: 'פינטק', de: 'Fintech', fr: 'Fintech' },
    Manufacturing: { ru: 'Производство', he: 'ייצור', de: 'Produktion', fr: 'Industrie' },
    Education: { ru: 'Образование', he: 'חינוך', de: 'Bildung', fr: 'Éducation' },
    Consumer: { ru: 'Потребительский сектор', he: 'צרכנות', de: 'Konsum', fr: 'Consommation' },
  },
  titles: {
    'border-war-risk': { ru: 'Риск войны у энергетического коридора растёт', he: 'סיכון מלחמה ליד מסדרון אנרגיה עולה', de: 'Kriegsrisiko nahe Energiekorridor steigt', fr: 'Risque de guerre près d’un corridor énergétique' },
    'cyber-attack-wave': { ru: 'Волна кибератак повышает бюджеты безопасности', he: 'גל מתקפות סייבר מגדיל תקציבי אבטחה', de: 'Cyberangriffswelle erhöht Sicherheitsbudgets', fr: 'Vague de cyberattaques et budgets sécurité' },
    'chip-shortage': { ru: 'Дефицит сенсорных чипов может задержать поставки роботов', he: 'מחסור בשבבי חיישנים עלול לעכב רובוטיקה', de: 'Sensorchip-Mangel kann Robotiklieferungen verzögern', fr: 'Pénurie de puces capteurs et retards robotique' },
    'regional-defense-alliance': { ru: 'Оборонный альянс готовит пакт по закупке дронов', he: 'ברית ביטחונית מכינה רכש רחפנים', de: 'Verteidigungsallianz plant Drohnenbeschaffung', fr: 'Alliance défense et achat de drones' },
    'drought-warning': { ru: 'Предупреждение о засухе угрожает поставкам еды', he: 'אזהרת בצורת מאיימת על אספקת מזון', de: 'Dürrewarnung bedroht Lebensmittelversorgung', fr: 'Alerte sécheresse sur l’approvisionnement alimentaire' },
    'education-tax-plan': { ru: 'Налоговый план для образования идёт на голосование', he: 'תוכנית מס לחינוך מגיעה להצבעה', de: 'Steuerplan für Bildung vor Ausschussabstimmung', fr: 'Plan fiscal éducation en vote' },
    'green-subsidy-review': { ru: 'Пересмотр зелёных субсидий может продлить кредиты', he: 'בחינת סובסידיות ירוקות עשויה להאריך זיכויים', de: 'Prüfung grüner Subventionen kann Credits verlängern', fr: 'Révision des subventions vertes' },
    'consumer-alliance': { ru: 'Потребительские бренды создают альянс данных', he: 'מותגי צרכנות מקימים ברית נתונים', de: 'Konsummarken bilden Datenallianz', fr: 'Alliance data des marques grand public' },
  },
  summaries: {
    'border-war-risk': { ru: 'Военная напряжённость у ключевого маршрута может поднять топливные расходы и ударить по логистике. Оборонные и киберкомпании могут получить защитный спрос.', he: 'מתיחות צבאית ליד נתיב מרכזי עלולה להעלות עלויות דלק ולפגוע בלוגיסטיקה. חברות ביטחון וסייבר עשויות ליהנות מביקוש הגנתי.', de: 'Militärische Spannungen an einer wichtigen Route könnten Treibstoffkosten erhöhen und Logistik belasten. Verteidigung und Cybersecurity könnten defensiven Kaufdruck sehen.', fr: 'Les tensions militaires près d’une route clé peuvent augmenter les coûts de carburant et peser sur la logistique. Défense et cybersécurité peuvent attirer des achats défensifs.' },
    'cyber-attack-wave': { ru: 'Серия вымышленных атак на коммунальную инфраструктуру может подтолкнуть компании к покупке защиты и услуг реагирования.', he: 'סדרת תקיפות מדומות על תשתיות עשויה לדחוף חברות לרכוש הגנה ותגובה לאירועים.', de: 'Eine Reihe fiktiver Angriffe auf Versorger könnte Nachfrage nach Schutz und Incident Response erhöhen.', fr: 'Des attaques fictives contre des services publics peuvent pousser les entreprises vers la protection endpoint et la réponse incident.' },
    'chip-shortage': { ru: 'Поставщики предупреждают о нехватке чипов машинного зрения. Робототехника может столкнуться с давлением на маржу.', he: 'ספקים מזהירים ממלאי מוגבל של שבבי ראייה ממוחשבת. חברות רובוטיקה עלולות לסבול מלחץ על מרווחים.', de: 'Lieferanten warnen vor knappen Bildverarbeitungschips. Robotikfirmen könnten Margendruck sehen.', fr: 'Les fournisseurs signalent un stock limité de puces de vision. Les entreprises robotiques peuvent subir une pression sur les marges.' },
    'regional-defense-alliance': { ru: 'Несколько правительств обсуждают совместную программу инспекционных дронов. AERO может стать поставщиком.', he: 'כמה ממשלות דנות בתוכנית רחפני בדיקה משותפת. AERO עשויה להיות ספקית.', de: 'Mehrere Regierungen diskutieren ein gemeinsames Inspektionsdrohnenprogramm. AERO gilt als möglicher Lieferant.', fr: 'Plusieurs gouvernements discutent d’un programme commun de drones d’inspection. AERO pourrait être fournisseur.' },
    'drought-warning': { ru: 'Сухой сезон может ударить по традиционным поставкам. Вертикальные фермы могут выиграть на росте цен еды.', he: 'עונה יבשה עלולה לפגוע באספקה מסורתית. חוות אנכיות עשויות ליהנות מעליית מחירי מזון.', de: 'Eine trockene Saison könnte klassische Versorgung treffen. Vertikale Farmen könnten von höheren Lebensmittelpreisen profitieren.', fr: 'Une saison sèche peut pénaliser l’offre traditionnelle. Les fermes verticales peuvent profiter de la hausse des prix alimentaires.' },
    'education-tax-plan': { ru: 'Цифровая налоговая льгота может увеличить расходы школ на образовательное ПО.', he: 'זיכוי מס דיגיטלי עשוי להגדיל הוצאות בתי ספר על תוכנות לימוד.', de: 'Eine digitale Steuergutschrift könnte Schulausgaben für Lernsoftware erhöhen.', fr: 'Un crédit fiscal numérique peut augmenter les dépenses scolaires en logiciels éducatifs.' },
    'green-subsidy-review': { ru: 'Законодатели обсуждают продление субсидий для микросетей и батарей. SOLR может выиграть.', he: 'מחוקקים בוחנים הארכת סובסידיות למיקרו-רשתות וסוללות. SOLR עשויה ליהנות.', de: 'Gesetzgeber prüfen längere Subventionen für Mikronetze und Batterien. SOLR könnte profitieren.', fr: 'Les législateurs examinent une extension des aides aux micro-réseaux et batteries. SOLR pourrait en profiter.' },
    'consumer-alliance': { ru: 'Премиальные бренды планируют общий слой аналитики клиентов, что может снизить стоимость привлечения.', he: 'מותגי פרימיום מתכננים שכבת אנליטיקת לקוחות משותפת שעשויה להוריד עלויות רכישה.', de: 'Premium-Marken planen gemeinsame Kundenanalytik, was Akquisitionskosten senken könnte.', fr: 'Des marques premium prévoient une analyse client partagée pouvant réduire les coûts d’acquisition.' },
  },
};

function dataText(group, key, fallback = '') {
  if (!key) return fallback;
  const translated = newsDataText[group]?.[key]?.[currentLanguage];
  if (translated) return translated;
  if (currentLanguage === 'en') return fallback || key;
  return fallback || key;
}

function tr(key, values = {}) {
  const dictionary = newsTranslations[currentLanguage] || newsTranslations.en;
  const template = dictionary[key] || newsTranslations.en[key] || key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    template,
  );
}

const localeMap = {
  en: 'en-US',
  ru: 'ru-RU',
  he: 'he-IL',
  de: 'de-DE',
  fr: 'fr-FR',
};

function formatNewsDate(value) {
  return new Intl.DateTimeFormat(localeMap[currentLanguage] || 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

async function api(path) {
  const response = await fetch(window.marketApiUrl ? window.marketApiUrl(path) : path);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function impactClass(value) {
  return Number(value) >= 0 ? 'gain' : 'loss';
}

function addLanguageSelect() {
  const topbar = document.querySelector('.topbar');
  if (!topbar || document.querySelector('#newsLanguageSelect')) return;

  const label = document.createElement('label');
  label.className = 'language-select';
  label.innerHTML = `
    <span>${tr('language')}</span>
    <select id="newsLanguageSelect" aria-label="Language">
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
    void loadNews();
  });
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';

  const select = document.querySelector('#newsLanguageSelect');
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

  const topbarEyebrow = document.querySelector('.topbar .eyebrow');
  if (topbarEyebrow) topbarEyebrow.textContent = tr('brand');
  document.title = tr('title');
  document.querySelector('h1').textContent = tr('title');
  document.querySelector('.news-hero .eyebrow').textContent = tr('forwardSignals');
  document.querySelector('.news-hero h2').textContent = tr('eventsTitle');
  document.querySelector('.news-hero-copy').textContent = tr('heroText');
  document.querySelector('.news-clock span').textContent = tr('autoMarket');

  const panels = document.querySelectorAll('.news-layout .panel');
  panels[0].querySelector('.eyebrow').textContent = tr('calendar');
  panels[0].querySelector('h2').textContent = tr('upcomingNews');
  panels[1].querySelector('.eyebrow').textContent = tr('impactMap');
  panels[1].querySelector('h2').textContent = tr('watchlist');

  if (nodes.newsStatus.textContent === 'Loading news') {
    nodes.newsStatus.textContent = tr('loadingNews');
  }
}

function renderNews(news) {
  nodes.newsList.innerHTML = news
    .map((item) => {
      const target = item.target_symbol || dataText('sectors', item.target_sector, item.target_sector) || tr('globalMarket');
      const impact = Number(item.expected_impact_percent);
      return `
        <article class="news-card severity-${item.severity}">
          <div class="news-card-top">
            <span>${dataText('categories', item.category, item.category)}</span>
            <time>${formatNewsDate(item.scheduled_at)}</time>
          </div>
          <h3>${dataText('titles', item.slug, item.title)}</h3>
          <p>${dataText('summaries', item.slug, item.summary)}</p>
          <div class="news-metrics">
            <div>
              <span>${tr('target')}</span>
              <strong>${target}</strong>
            </div>
            <div>
              <span>${tr('probability')}</span>
              <strong>${Number(item.probability_percent).toFixed(0)}%</strong>
            </div>
            <div>
              <span>${tr('impact')}</span>
              <strong class="${impactClass(impact)}">${impact >= 0 ? '+' : ''}${impact.toFixed(1)}%</strong>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderImpactMap(news) {
  const grouped = new Map();
  for (const item of news) {
    const target = item.target_symbol || dataText('sectors', item.target_sector, item.target_sector) || tr('globalMarket');
    const current = grouped.get(target) || { target, count: 0, score: 0 };
    current.count += 1;
    current.score += Number(item.expected_impact_percent) * (Number(item.probability_percent) / 100);
    grouped.set(target, current);
  }

  nodes.impactMap.innerHTML = [...grouped.values()]
    .sort((first, second) => Math.abs(second.score) - Math.abs(first.score))
    .map((item) => `
      <article class="impact-row">
        <div>
          <strong>${item.target}</strong>
          <span>${item.count} ${item.count > 1 ? tr('upcomingEvents') : tr('upcomingEvent')}</span>
        </div>
        <b class="${impactClass(item.score)}">${item.score >= 0 ? '+' : ''}${item.score.toFixed(1)}</b>
      </article>
    `)
    .join('');
}

async function loadNews() {
  const news = await api('/market/news');
  renderNews(news);
  renderImpactMap(news);
  nodes.newsStatus.textContent = tr('loaded', { count: news.length });
}

async function loadClock() {
  const clock = await api('/market/clock');
  const nextTick = clock.next_tick_at ? new Date(clock.next_tick_at).getTime() : Date.now();
  const seconds = Math.max(0, Math.ceil((nextTick - Date.now()) / 1000));
  nodes.newsClock.textContent = `${seconds}s`;
}

function registerAppShell() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/game/sw.js', { scope: '/game/' }).catch(() => undefined);
  }
}

async function boot() {
  registerAppShell();
  addLanguageSelect();
  applyLanguage();
  await loadNews();
  await loadClock();
  setInterval(() => loadClock().catch(() => undefined), 1000);
  setInterval(() => loadNews().catch((error) => {
    nodes.newsStatus.textContent = error.message;
  }), 15000);
}

boot().catch((error) => {
  nodes.newsStatus.textContent = error.message;
});
