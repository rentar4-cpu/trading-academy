const authState = {
  language: 'en',
};

const authText = {
  en: {
    brand: 'Mentavio',
    title: 'Account',
    language: 'Language',
    navMarket: 'Market',
    navIntel: 'Intel',
    navTrades: 'Trades',
    navNews: 'News',
    navPortfolio: 'Portfolio',
    navStore: 'Store',
    navAuth: 'Account',
    secureAccess: 'Player Access',
    heroTitle: 'Save your portfolio and keep trading later',
    heroText:
      'Start as a guest with $1,000, try a few trades, then register for a clean verified account.',
    currentPlayer: 'Current player',
    continueGuest: 'Continue as Guest',
    returning: 'Returning Player',
    loginTitle: 'Login',
    newPlayer: 'New Player',
    registerTitle: 'Register',
    email: 'Email',
    password: 'Password',
    displayName: 'Player name',
    loginAction: 'Login',
    registerAction: 'Create Account',
    registerNote:
      'Guest progress stays separate. A new verified account starts clean.',
    legalConsentRequired:
      'Accept the terms, privacy policy, disclaimer, and 18+ confirmation before registering.',
    verifyEyebrow: 'Email Check',
    verifyTitle: 'Confirm Email',
    verificationCode: 'Verification code',
    verifyAction: 'Confirm Email',
    verificationNote:
      'Local demo shows the code here. In production it should be sent by email.',
    adRewardAction: 'Watch Ad Bonus',
    apiServer: 'Server URL',
    saveApiServer: 'Save Server',
    testApiServer: 'Test Server',
    apiSaved: 'Server URL saved',
    apiTesting: 'Testing server...',
    apiTestOk: 'Server connected: {count} companies loaded',
    apiTestFailed: 'Server test failed: {message}',
    apiHtmlResponse:
      'This address opens the app page, not the data server. Use {url}.',
    apiUnreachable:
      'Cannot reach {url}. Check that the server is running and the phone is on the same network.',
    apiInvalidJson: 'The server returned invalid data. Check the server address.',
    guestTraderName: 'Guest Trader',
    pendingVerification: 'Verification code for {email}: {code}',
    verified: 'Email confirmed. Clean account created for {name}',
    adRewarded:
      'Ad reward added: {amount} tokens. Remaining rewards: {remaining}',
    ready: 'Ready',
    guestCreated: 'Guest player is ready',
    loggedIn: 'Logged in as {name}',
    registered: 'Account created for {name}',
    guest: 'Guest',
  },
  ru: {
    brand: 'Mentavio',
    title: 'Аккаунт',
    language: 'Язык',
    navMarket: 'Рынок',
    navIntel: 'Аналитика',
    navTrades: 'Сделки',
    navNews: 'Новости',
    navPortfolio: 'Портфель',
    navStore: 'Магазин',
    navAuth: 'Аккаунт',
    secureAccess: 'Доступ игрока',
    heroTitle: 'Сохрани портфель и продолжай торговлю позже',
    heroText:
      'Начни гостем с $1,000, попробуй пару сделок, потом зарегистрируй чистый подтверждённый аккаунт.',
    currentPlayer: 'Текущий игрок',
    continueGuest: 'Продолжить гостем',
    returning: 'Уже есть аккаунт',
    loginTitle: 'Вход',
    newPlayer: 'Новый игрок',
    registerTitle: 'Регистрация',
    email: 'Электронная почта',
    password: 'Пароль',
    displayName: 'Имя игрока',
    loginAction: 'Войти',
    registerAction: 'Создать аккаунт',
    registerNote:
      'Гостевой прогресс остаётся отдельно. Новый подтверждённый аккаунт стартует чистым.',
    verifyEyebrow: 'Проверка email',
    verifyTitle: 'Подтвердить email',
    verificationCode: 'Код подтверждения',
    verifyAction: 'Подтвердить email',
    verificationNote:
      'В локальной демо-версии код показан здесь. В продакшене он должен приходить на почту.',
    adRewardAction: 'Бонус за рекламу',
    apiServer: 'Адрес сервера',
    saveApiServer: 'Сохранить сервер',
    testApiServer: 'Проверить сервер',
    apiSaved: 'Адрес сервера сохранён',
    apiTesting: 'Проверка сервера...',
    apiTestOk: 'Сервер подключён: компаний загружено {count}',
    apiTestFailed: 'Ошибка проверки сервера: {message}',
    apiHtmlResponse:
      'Этот адрес открывает страницу приложения, а не сервер данных. Используйте {url}.',
    apiUnreachable:
      'Не удаётся подключиться к {url}. Проверьте, что сервер запущен и телефон находится в той же сети.',
    apiInvalidJson:
      'Сервер вернул некорректные данные. Проверьте адрес сервера.',
    guestTraderName: 'Гость',
    pendingVerification: 'Код подтверждения для {email}: {code}',
    verified: 'Email подтверждён. Чистый аккаунт создан: {name}',
    adRewarded:
      'Бонус за рекламу начислен: {amount} токенов. Осталось бонусов: {remaining}',
    ready: 'Готово',
    guestCreated: 'Гостевой игрок готов',
    loggedIn: 'Вход выполнен: {name}',
    registered: 'Аккаунт создан: {name}',
    guest: 'Гость',
  },
  he: {
    brand: 'Mentavio',
    title: 'חשבון',
    language: 'שפה',
    navMarket: 'שוק',
    navIntel: 'מודיעין',
    navTrades: 'עסקאות',
    navNews: 'חדשות',
    navPortfolio: 'תיק',
    navStore: 'חנות',
    navAuth: 'חשבון',
    secureAccess: 'כניסת שחקן',
    heroTitle: 'שמור את התיק והמשך לסחור מאוחר יותר',
    heroText:
      'התחל כאורח עם $1,000, נסה כמה עסקאות ואז הירשם לחשבון נקי ומאומת.',
    currentPlayer: 'שחקן נוכחי',
    continueGuest: 'המשך כאורח',
    returning: 'שחקן חוזר',
    loginTitle: 'כניסה',
    newPlayer: 'שחקן חדש',
    registerTitle: 'הרשמה',
    email: 'אימייל',
    password: 'סיסמה',
    displayName: 'שם שחקן',
    loginAction: 'כניסה',
    registerAction: 'צור חשבון',
    registerNote: 'התקדמות אורח נשארת בנפרד. חשבון מאומת חדש מתחיל נקי.',
    verifyEyebrow: 'בדיקת אימייל',
    verifyTitle: 'אישור אימייל',
    verificationCode: 'קוד אימות',
    verifyAction: 'אשר אימייל',
    verificationNote:
      'בדמו המקומי הקוד מוצג כאן. בפרודקשן הוא צריך להישלח באימייל.',
    adRewardAction: 'בונוס פרסומת',
    apiServer: 'כתובת שרת',
    saveApiServer: 'שמור שרת',
    testApiServer: 'בדוק שרת',
    apiSaved: 'כתובת השרת נשמרה',
    apiTesting: 'בודק שרת...',
    apiTestOk: 'השרת מחובר: נטענו {count} חברות',
    apiTestFailed: 'בדיקת השרת נכשלה: {message}',
    apiHtmlResponse:
      'כתובת זו פותחת את דף האפליקציה במקום את שרת הנתונים. השתמשו ב-{url}.',
    apiUnreachable:
      'לא ניתן להתחבר אל {url}. ודאו שהשרת פועל ושהטלפון מחובר לאותה רשת.',
    apiInvalidJson: 'השרת החזיר נתונים לא תקינים. בדקו את כתובת השרת.',
    guestTraderName: 'אורח',
    pendingVerification: 'קוד אימות עבור {email}: {code}',
    verified: 'האימייל אומת. נוצר חשבון נקי עבור {name}',
    adRewarded:
      'בונוס פרסומת נוסף: {amount} טוקנים. נותרו בונוסים: {remaining}',
    ready: 'מוכן',
    guestCreated: 'שחקן אורח מוכן',
    loggedIn: 'נכנסת בתור {name}',
    registered: 'נוצר חשבון עבור {name}',
    guest: 'אורח',
  },
  de: {
    brand: 'Mentavio',
    title: 'Konto',
    language: 'Sprache',
    navMarket: 'Markt',
    navIntel: 'Analyse',
    navTrades: 'Transaktionen',
    navNews: 'Nachrichten',
    navPortfolio: 'Depot',
    navStore: 'Shop',
    navAuth: 'Konto',
    secureAccess: 'Spielerzugang',
    heroTitle: 'Speichere dein Portfolio und handle später weiter',
    heroText:
      'Starte als Gast mit $1,000, teste ein paar Trades und registriere dann ein sauberes verifiziertes Konto.',
    currentPlayer: 'Aktueller Spieler',
    continueGuest: 'Als Gast fortfahren',
    returning: 'Bestehender Spieler',
    loginTitle: 'Anmelden',
    newPlayer: 'Neuer Spieler',
    registerTitle: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    displayName: 'Spielername',
    loginAction: 'Einloggen',
    registerAction: 'Konto erstellen',
    registerNote:
      'Gastfortschritt bleibt getrennt. Ein neues verifiziertes Konto startet sauber.',
    verifyEyebrow: 'E-Mail-Prüfung',
    verifyTitle: 'E-Mail bestätigen',
    verificationCode: 'Bestätigungscode',
    verifyAction: 'E-Mail bestätigen',
    verificationNote:
      'Die lokale Demo zeigt den Code hier. In Produktion sollte er per E-Mail gesendet werden.',
    adRewardAction: 'Werbebonus ansehen',
    apiServer: 'Server-URL',
    saveApiServer: 'Server speichern',
    testApiServer: 'Server testen',
    apiSaved: 'Server-URL gespeichert',
    apiTesting: 'Server wird getestet...',
    apiTestOk: 'Server verbunden: {count} Firmen geladen',
    apiTestFailed: 'Serverprüfung fehlgeschlagen: {message}',
    apiHtmlResponse:
      'Diese Adresse öffnet die App-Seite statt des Datenservers. Verwende {url}.',
    apiUnreachable:
      '{url} ist nicht erreichbar. Prüfe, ob der Server läuft und das Telefon im selben Netzwerk ist.',
    apiInvalidJson:
      'Der Server hat ungültige Daten geliefert. Prüfe die Serveradresse.',
    guestTraderName: 'Gast',
    pendingVerification: 'Bestätigungscode für {email}: {code}',
    verified: 'E-Mail bestätigt. Sauberes Konto erstellt für {name}',
    adRewarded:
      'Werbebonus hinzugefügt: {amount} Token. Verbleibende Boni: {remaining}',
    ready: 'Bereit',
    guestCreated: 'Gastspieler ist bereit',
    loggedIn: 'Eingeloggt als {name}',
    registered: 'Konto erstellt für {name}',
    guest: 'Gast',
  },
  fr: {
    brand: 'Mentavio',
    title: 'Compte',
    language: 'Langue',
    navMarket: 'Marché',
    navIntel: 'Analyse',
    navTrades: 'Transactions',
    navNews: 'Infos',
    navPortfolio: 'Portefeuille',
    navStore: 'Boutique',
    navAuth: 'Compte',
    secureAccess: 'Accès joueur',
    heroTitle: 'Sauvegardez votre portefeuille et continuez plus tard',
    heroText:
      'Commencez invité avec 1 000 $, testez quelques trades, puis créez un compte vérifié propre.',
    currentPlayer: 'Joueur actuel',
    continueGuest: 'Continuer invité',
    returning: 'Joueur existant',
    loginTitle: 'Connexion',
    newPlayer: 'Nouveau joueur',
    registerTitle: 'Inscription',
    email: 'Courriel',
    password: 'Mot de passe',
    displayName: 'Nom du joueur',
    loginAction: 'Connexion',
    registerAction: 'Créer un compte',
    registerNote:
      'La progression invité reste séparée. Un nouveau compte vérifié démarre propre.',
    verifyEyebrow: 'Vérification email',
    verifyTitle: 'Confirmer email',
    verificationCode: 'Code de vérification',
    verifyAction: 'Confirmer email',
    verificationNote:
      'La démo locale affiche le code ici. En production il doit être envoyé par email.',
    adRewardAction: 'Bonus publicité',
    apiServer: 'URL serveur',
    saveApiServer: 'Enregistrer serveur',
    testApiServer: 'Tester serveur',
    apiSaved: 'URL serveur enregistrée',
    apiTesting: 'Test du serveur...',
    apiTestOk: 'Serveur connecté : {count} sociétés chargées',
    apiTestFailed: 'Échec du test serveur : {message}',
    apiHtmlResponse:
      "Cette adresse ouvre la page de l'application au lieu du serveur de données. Utilisez {url}.",
    apiUnreachable:
      "Impossible d'atteindre {url}. Vérifiez que le serveur fonctionne et que le téléphone utilise le même réseau.",
    apiInvalidJson:
      "Le serveur a renvoyé des données non valides. Vérifiez l'adresse du serveur.",
    guestTraderName: 'Invité',
    pendingVerification: 'Code de vérification pour {email} : {code}',
    verified: 'Email confirmé. Compte propre créé : {name}',
    adRewarded:
      'Bonus publicité ajouté : {amount} jetons. Bonus restants : {remaining}',
    ready: 'Prêt',
    guestCreated: 'Joueur invité prêt',
    loggedIn: 'Connecté : {name}',
    registered: 'Compte créé : {name}',
    guest: 'Invité',
  },
};

const nodes = {
  language: document.querySelector('#authLanguageSelect'),
  status: document.querySelector('#authStatus'),
  currentPlayerName: document.querySelector('#currentPlayerName'),
  guestButton: document.querySelector('#guestButton'),
  adRewardButton: document.querySelector('#adRewardButton'),
  loginForm: document.querySelector('#loginForm'),
  registerForm: document.querySelector('#registerForm'),
  verifyForm: document.querySelector('#verifyForm'),
};

function t(key, values = {}) {
  const dictionary = authText[authState.language] || authText.en;
  const template = dictionary[key] || authText.en[key] || key;
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
  nodes.status.textContent = message;
}

function applyLanguage() {
  authState.language = 'en';
  localStorage.setItem('market_language', 'en');
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  if (nodes.language) nodes.language.value = 'en';
  document.querySelectorAll('[data-auth-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.authI18n);
  });
  renderCurrentPlayer();
}

function renderCurrentPlayer() {
  const user = readJson('market_user');
  const playerName = localStorage.getItem('market_player_name');
  nodes.currentPlayerName.textContent =
    user?.display_name || playerName || t('guest');
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

function saveAuth(result) {
  localStorage.setItem('market_auth_mode', result.mode);
  localStorage.setItem('market_player_id', String(result.player.id));
  localStorage.setItem('market_player_name', result.player.display_name);
  localStorage.removeItem('market_pending_email');
  localStorage.removeItem('market_dev_verification_code');

  if (result.user) {
    localStorage.setItem('market_user', JSON.stringify(result.user));
  } else {
    localStorage.removeItem('market_user');
  }
}

function savePendingVerification(result) {
  localStorage.setItem('market_pending_email', result.user.email);
  if (result.dev_verification_code) {
    localStorage.setItem(
      'market_dev_verification_code',
      result.dev_verification_code,
    );
  }
  document.querySelector('#verifyEmail').value = result.user.email;
  document.querySelector('#verifyCode').value =
    result.dev_verification_code || '';
  setStatus(
    t('pendingVerification', {
      email: result.user.email,
      code: result.dev_verification_code || '------',
    }),
  );
}

async function continueGuest() {
  let playerId = Number(localStorage.getItem('market_player_id'));
  if (!playerId || localStorage.getItem('market_auth_mode') === 'account') {
    const result = await api('/users/guest', {
      method: 'POST',
      body: JSON.stringify({ display_name: t('guestTraderName') }),
    });
    saveAuth(result);
  }

  setStatus(t('guestCreated'));
  renderCurrentPlayer();
  window.location.href = './index.html';
}

async function login(event) {
  event.preventDefault();
  const result = await api('/users/login', {
    method: 'POST',
    body: JSON.stringify({
      email: document.querySelector('#loginEmail').value,
      password: document.querySelector('#loginPassword').value,
    }),
  });
  if (result.mode === 'pending_verification') {
    savePendingVerification(result);
    return;
  }
  saveAuth(result);
  setStatus(t('loggedIn', { name: result.user.display_name }));
  window.location.href = './index.html';
}

async function register(event) {
  event.preventDefault();
  const acceptLegal = document.querySelector('#acceptLegal')?.checked;
  const confirmAge = document.querySelector('#confirmAge')?.checked;
  if (!acceptLegal || !confirmAge) {
    setStatus(t('legalConsentRequired'));
    return;
  }
  const result = await api('/users/register', {
    method: 'POST',
    body: JSON.stringify({
      display_name: document.querySelector('#registerName').value,
      email: document.querySelector('#registerEmail').value,
      password: document.querySelector('#registerPassword').value,
      accepted_terms: acceptLegal,
      confirmed_age_18: confirmAge,
      legal_locale: 'en',
      legal_source: 'account-registration',
      guest_player_id:
        Number(localStorage.getItem('market_player_id')) || undefined,
    }),
  });
  if (result.mode === 'pending_verification') {
    savePendingVerification(result);
    return;
  }
  saveAuth(result);
  setStatus(t('registered', { name: result.user.display_name }));
}

async function verifyEmail(event) {
  event.preventDefault();
  const result = await api('/users/verify-email', {
    method: 'POST',
    body: JSON.stringify({
      email: document.querySelector('#verifyEmail').value,
      code: document.querySelector('#verifyCode').value,
    }),
  });
  saveAuth(result);
  setStatus(t('verified', { name: result.user.display_name }));
  renderCurrentPlayer();
}

async function claimAdReward() {
  const playerId = Number(localStorage.getItem('market_player_id'));
  if (!playerId || localStorage.getItem('market_auth_mode') !== 'account') {
    setStatus(t('verifyTitle'));
    return;
  }

  const result = await api('/users/ad-reward', {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId }),
  });
  localStorage.setItem('market_player_name', result.player.display_name);
  if (result.user) {
    localStorage.setItem('market_user', JSON.stringify(result.user));
  }
  setStatus(
    t('adRewarded', {
      amount: Number(result.reward_tokens).toFixed(0),
      remaining: result.remaining_claims,
    }),
  );
  renderCurrentPlayer();
}

function apiErrorMessage(error) {
  const suggestedUrl =
    window.DEFAULT_MARKET_API_BASE || 'http://192.168.1.108:3000';

  if (error.code === 'MARKET_API_HTML_RESPONSE') {
    return t('apiHtmlResponse', { url: suggestedUrl });
  }

  if (error.code === 'MARKET_API_UNREACHABLE') {
    return t('apiUnreachable', {
      url: window.MARKET_API_BASE || suggestedUrl,
    });
  }

  if (error.code === 'MARKET_API_INVALID_JSON') {
    return t('apiInvalidJson');
  }

  return error.message.replace(/[{}"]/g, '');
}

function showError(error) {
  setStatus(apiErrorMessage(error));
}

function bindEvents() {
  nodes.guestButton.addEventListener('click', () =>
    continueGuest().catch(showError),
  );
  nodes.adRewardButton.addEventListener('click', () =>
    claimAdReward().catch(showError),
  );
  nodes.loginForm.addEventListener('submit', (event) =>
    login(event).catch(showError),
  );
  nodes.registerForm.addEventListener('submit', (event) =>
    register(event).catch(showError),
  );
  nodes.verifyForm.addEventListener('submit', (event) =>
    verifyEmail(event).catch(showError),
  );
}

function registerAppShell() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/game/sw.js', { scope: '/game/' })
      .catch(() => undefined);
  }
}

registerAppShell();
bindEvents();
applyLanguage();

const pendingEmail = localStorage.getItem('market_pending_email');
const pendingCode = localStorage.getItem('market_dev_verification_code');
if (pendingEmail) document.querySelector('#verifyEmail').value = pendingEmail;
if (pendingCode) document.querySelector('#verifyCode').value = pendingCode;
