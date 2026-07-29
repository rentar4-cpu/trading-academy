export type LandingLanguage = 'en' | 'ru' | 'he' | 'de' | 'fr';

export const languageOptions: Array<{
  code: LandingLanguage;
  label: string;
}> = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'he', label: 'עברית' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
];

export const landingCopy = {
  en: {
    direction: 'ltr',
    language: 'Language',
    tagline: 'Learn. Think. Grow.',
    navVision: 'Vision',
    navEcosystem: 'Ecosystem',
    getStarted: 'Get Started',
    heroLead: 'Build better decisions with AI.',
    heroDescription:
      'Mentavio combines investing, education, strategic thinking and intelligent assistance into one platform.',
    meetSophia: 'Meet Sophia',
    sophiaRole: 'AI decision mentor',
    calmGuidance: 'Calm guidance',
    chatQuestionOne:
      'What should I pay attention to before making this decision?',
    chatAnswerOne:
      'Start with the evidence, then compare risk, timing, and alternatives. A good decision is not a prediction. It is a disciplined process.',
    chatQuestionTwo: 'Help me understand the tradeoff.',
    sophiaPrinciple: 'Sophia principle',
    sophiaPrincipleText: 'Guidance over guesses. Clarity over noise.',
    sophiaDescription:
      'Sophia is your intelligent companion. She is a knowledgeable guide inside the Mentavio ecosystem, designed to help you understand, compare, and improve decisions.',
    capabilities: [
      'Understand markets',
      'Learn investing',
      'Analyze decisions',
      'Improve strategic thinking',
      'Study chess',
      'Explore ideas',
    ],
    whyMentavio: 'Why Mentavio?',
    visionTitle: 'Better thinking becomes a platform.',
    visionCards: [
      {
        title: 'Learn',
        description: 'Continuous education powered by AI.',
      },
      {
        title: 'Think',
        description: 'Develop strategic thinking.',
      },
      {
        title: 'Grow',
        description: 'Become a better investor and decision maker.',
      },
    ],
    futureEcosystem: 'Future ecosystem',
    ecosystemTitle: 'Trading is one application. Thinking is the platform.',
    ecosystemDescription:
      'Mentavio is designed to become an ecosystem for improving human thinking across investing, learning, games, strategy, and AI decision support.',
    modules: {
      investing: 'Investing',
      ai: 'AI',
      learning: 'Learning',
      chess: 'Chess',
      backgammon: 'Backgammon',
      checkers: 'Checkers',
      decisionSupport: 'Decision Support',
      strategy: 'Strategy',
    },
    openSimulator: 'Open Trading Simulator',
    planned: 'Planned',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    copyright: 'Copyright © 2026 Mentavio.',
  },
  ru: {
    direction: 'ltr',
    language: 'Язык',
    tagline: 'Учись. Думай. Расти.',
    navVision: 'Видение',
    navEcosystem: 'Экосистема',
    getStarted: 'Начать',
    heroLead: 'Принимайте более взвешенные решения с AI.',
    heroDescription:
      'Mentavio объединяет инвестиции, образование, стратегическое мышление и интеллектуальную поддержку на одной платформе.',
    meetSophia: 'Познакомиться с Sophia',
    sophiaRole: 'AI-наставник по принятию решений',
    calmGuidance: 'Спокойная поддержка',
    chatQuestionOne:
      'На что мне обратить внимание перед принятием этого решения?',
    chatAnswerOne:
      'Начните с фактов, затем сравните риск, момент и альтернативы. Хорошее решение — не предсказание, а дисциплинированный процесс.',
    chatQuestionTwo: 'Помоги мне понять компромисс.',
    sophiaPrinciple: 'Принцип Sophia',
    sophiaPrincipleText: 'Советы вместо догадок. Ясность вместо шума.',
    sophiaDescription:
      'Sophia — ваш интеллектуальный помощник. Она помогает понимать, сравнивать и улучшать решения во всей экосистеме Mentavio.',
    capabilities: [
      'Понимать рынки',
      'Изучать инвестиции',
      'Анализировать решения',
      'Развивать стратегическое мышление',
      'Изучать шахматы',
      'Исследовать идеи',
    ],
    whyMentavio: 'Почему Mentavio?',
    visionTitle: 'Лучшее мышление становится платформой.',
    visionCards: [
      {
        title: 'Учись',
        description: 'Непрерывное обучение с поддержкой AI.',
      },
      {
        title: 'Думай',
        description: 'Развивайте стратегическое мышление.',
      },
      {
        title: 'Расти',
        description:
          'Становитесь более сильным инвестором и принимайте лучшие решения.',
      },
    ],
    futureEcosystem: 'Будущая экосистема',
    ecosystemTitle: 'Торговля — одно приложение. Мышление — целая платформа.',
    ecosystemDescription:
      'Mentavio создаётся как экосистема для развития мышления в инвестициях, обучении, играх, стратегии и поддержке решений с AI.',
    modules: {
      investing: 'Инвестиции',
      ai: 'AI',
      learning: 'Обучение',
      chess: 'Шахматы',
      backgammon: 'Нарды',
      checkers: 'Шашки',
      decisionSupport: 'Поддержка решений',
      strategy: 'Стратегия',
    },
    openSimulator: 'Открыть симулятор торговли',
    planned: 'Планируется',
    privacy: 'Конфиденциальность',
    terms: 'Условия',
    contact: 'Контакты',
    copyright: '© 2026 Mentavio. Все права защищены.',
  },
  he: {
    direction: 'rtl',
    language: 'שפה',
    tagline: 'למד. חשוב. צמח.',
    navVision: 'חזון',
    navEcosystem: 'מערכת',
    getStarted: 'התחלה',
    heroLead: 'קבל החלטות טובות יותר בעזרת AI.',
    heroDescription:
      'Mentavio משלבת השקעות, למידה, חשיבה אסטרטגית וסיוע חכם בפלטפורמה אחת.',
    meetSophia: 'הכירו את Sophia',
    sophiaRole: 'מנטורית AI לקבלת החלטות',
    calmGuidance: 'הכוונה רגועה',
    chatQuestionOne: 'למה כדאי לשים לב לפני קבלת ההחלטה הזאת?',
    chatAnswerOne:
      'התחל בעובדות, ואז השווה סיכון, תזמון וחלופות. החלטה טובה אינה תחזית אלא תהליך ממושמע.',
    chatQuestionTwo: 'עזרי לי להבין את הפשרה.',
    sophiaPrinciple: 'העיקרון של Sophia',
    sophiaPrincipleText: 'הכוונה במקום ניחושים. בהירות במקום רעש.',
    sophiaDescription:
      'Sophia היא המלווה החכמה שלך. היא עוזרת להבין, להשוות ולשפר החלטות בכל מערכת Mentavio.',
    capabilities: [
      'להבין שווקים',
      'ללמוד השקעות',
      'לנתח החלטות',
      'לשפר חשיבה אסטרטגית',
      'ללמוד שחמט',
      'לחקור רעיונות',
    ],
    whyMentavio: 'למה Mentavio?',
    visionTitle: 'חשיבה טובה יותר הופכת לפלטפורמה.',
    visionCards: [
      {
        title: 'למד',
        description: 'למידה מתמשכת בעזרת AI.',
      },
      {
        title: 'חשוב',
        description: 'פתח חשיבה אסטרטגית.',
      },
      {
        title: 'צמח',
        description: 'הפוך למשקיע ולמקבל החלטות טוב יותר.',
      },
    ],
    futureEcosystem: 'המערכת העתידית',
    ecosystemTitle: 'מסחר הוא יישום אחד. חשיבה היא הפלטפורמה.',
    ecosystemDescription:
      'Mentavio נועדה להפוך למערכת לפיתוח החשיבה בהשקעות, למידה, משחקים, אסטרטגיה ותמיכה בהחלטות בעזרת AI.',
    modules: {
      investing: 'השקעות',
      ai: 'AI',
      learning: 'למידה',
      chess: 'שחמט',
      backgammon: 'שש-בש',
      checkers: 'דמקה',
      decisionSupport: 'תמיכה בהחלטות',
      strategy: 'אסטרטגיה',
    },
    openSimulator: 'פתח סימולטור מסחר',
    planned: 'מתוכנן',
    privacy: 'פרטיות',
    terms: 'תנאים',
    contact: 'יצירת קשר',
    copyright: '© 2026 Mentavio. כל הזכויות שמורות.',
  },
  de: {
    direction: 'ltr',
    language: 'Sprache',
    tagline: 'Lernen. Denken. Wachsen.',
    navVision: 'Vision',
    navEcosystem: 'Ökosystem',
    getStarted: 'Loslegen',
    heroLead: 'Bessere Entscheidungen mit AI treffen.',
    heroDescription:
      'Mentavio vereint Investieren, Bildung, strategisches Denken und intelligente Unterstützung auf einer Plattform.',
    meetSophia: 'Sophia kennenlernen',
    sophiaRole: 'AI-Mentorin für Entscheidungen',
    calmGuidance: 'Ruhige Begleitung',
    chatQuestionOne: 'Worauf sollte ich vor dieser Entscheidung achten?',
    chatAnswerOne:
      'Beginne mit den Fakten und vergleiche dann Risiko, Zeitpunkt und Alternativen. Eine gute Entscheidung ist keine Vorhersage, sondern ein disziplinierter Prozess.',
    chatQuestionTwo: 'Hilf mir, den Zielkonflikt zu verstehen.',
    sophiaPrinciple: 'Sophias Prinzip',
    sophiaPrincipleText: 'Orientierung statt Raten. Klarheit statt Lärm.',
    sophiaDescription:
      'Sophia ist deine intelligente Begleiterin. Sie hilft dir, Entscheidungen im gesamten Mentavio-Ökosystem zu verstehen, zu vergleichen und zu verbessern.',
    capabilities: [
      'Märkte verstehen',
      'Investieren lernen',
      'Entscheidungen analysieren',
      'Strategisches Denken verbessern',
      'Schach lernen',
      'Ideen erkunden',
    ],
    whyMentavio: 'Warum Mentavio?',
    visionTitle: 'Besseres Denken wird zur Plattform.',
    visionCards: [
      {
        title: 'Lernen',
        description: 'Kontinuierliche Weiterbildung mit AI.',
      },
      {
        title: 'Denken',
        description: 'Strategisches Denken entwickeln.',
      },
      {
        title: 'Wachsen',
        description: 'Ein besserer Investor und Entscheidungsträger werden.',
      },
    ],
    futureEcosystem: 'Zukünftiges Ökosystem',
    ecosystemTitle: 'Trading ist eine Anwendung. Denken ist die Plattform.',
    ecosystemDescription:
      'Mentavio wird zu einem Ökosystem für besseres Denken beim Investieren, Lernen, Spielen, in der Strategie und bei AI-gestützten Entscheidungen.',
    modules: {
      investing: 'Investieren',
      ai: 'AI',
      learning: 'Lernen',
      chess: 'Schach',
      backgammon: 'Backgammon',
      checkers: 'Dame',
      decisionSupport: 'Entscheidungshilfe',
      strategy: 'Strategie',
    },
    openSimulator: 'Trading-Simulator öffnen',
    planned: 'Geplant',
    privacy: 'Datenschutz',
    terms: 'Bedingungen',
    contact: 'Kontakt',
    copyright: '© 2026 Mentavio. Alle Rechte vorbehalten.',
  },
  fr: {
    direction: 'ltr',
    language: 'Langue',
    tagline: 'Apprendre. Penser. Grandir.',
    navVision: 'Vision',
    navEcosystem: 'Écosystème',
    getStarted: 'Commencer',
    heroLead: 'Prenez de meilleures décisions avec l’AI.',
    heroDescription:
      'Mentavio réunit investissement, formation, réflexion stratégique et assistance intelligente sur une seule plateforme.',
    meetSophia: 'Découvrir Sophia',
    sophiaRole: 'Mentor AI pour la prise de décision',
    calmGuidance: 'Conseils sereins',
    chatQuestionOne:
      'À quoi dois-je faire attention avant de prendre cette décision ?',
    chatAnswerOne:
      'Commencez par les faits, puis comparez le risque, le moment et les alternatives. Une bonne décision n’est pas une prédiction, mais un processus discipliné.',
    chatQuestionTwo: 'Aide-moi à comprendre le compromis.',
    sophiaPrinciple: 'Principe de Sophia',
    sophiaPrincipleText:
      'Des conseils plutôt que des suppositions. De la clarté plutôt que du bruit.',
    sophiaDescription:
      'Sophia est votre accompagnatrice intelligente. Elle vous aide à comprendre, comparer et améliorer vos décisions dans tout l’écosystème Mentavio.',
    capabilities: [
      'Comprendre les marchés',
      'Apprendre à investir',
      'Analyser les décisions',
      'Améliorer la réflexion stratégique',
      'Étudier les échecs',
      'Explorer des idées',
    ],
    whyMentavio: 'Pourquoi Mentavio ?',
    visionTitle: 'Une meilleure réflexion devient une plateforme.',
    visionCards: [
      {
        title: 'Apprendre',
        description: 'Une formation continue alimentée par l’AI.',
      },
      {
        title: 'Penser',
        description: 'Développez votre réflexion stratégique.',
      },
      {
        title: 'Grandir',
        description:
          'Devenez un meilleur investisseur et prenez de meilleures décisions.',
      },
    ],
    futureEcosystem: 'Écosystème futur',
    ecosystemTitle:
      'Le trading est une application. La réflexion est la plateforme.',
    ecosystemDescription:
      'Mentavio est conçu comme un écosystème pour améliorer la réflexion dans l’investissement, l’apprentissage, les jeux, la stratégie et l’aide à la décision par AI.',
    modules: {
      investing: 'Investissement',
      ai: 'AI',
      learning: 'Formation',
      chess: 'Échecs',
      backgammon: 'Backgammon',
      checkers: 'Dames',
      decisionSupport: 'Aide à la décision',
      strategy: 'Stratégie',
    },
    openSimulator: 'Ouvrir le simulateur de trading',
    planned: 'Prévu',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    contact: 'Contact',
    copyright: '© 2026 Mentavio. Tous droits réservés.',
  },
} as const;
