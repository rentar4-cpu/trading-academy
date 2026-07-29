const ecosystemModules = [
  'Investing',
  'AI',
  'Learning',
  'Chess',
  'Backgammon',
  'Checkers',
  'Decision Support',
  'Strategy',
];

const tradingAppUrl =
  process.env.NEXT_PUBLIC_TRADING_APP_URL || 'http://localhost:3000/game/';

const visionCards = [
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
];

const sophiaCapabilities = [
  'understand markets',
  'learn investing',
  'analyze decisions',
  'improve strategic thinking',
  'study chess',
  'explore ideas',
];

const logoBoardUrl = '/mentavio-logo-board.png';

function MentavioLogo({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0B1220] shadow-sm ${
        large ? 'h-28 w-28 md:h-36 md:w-36' : 'h-12 w-12'
      }`}
      aria-label="Mentavio logo"
      style={{
        backgroundImage: `url(${logoBoardUrl})`,
        backgroundPosition: '3.4% 67%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1260% auto',
      }}
    />
  );
}

function MentavioLockup() {
  return (
    <div
      className="aspect-[1.62/1] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1220] shadow-[0_30px_100px_rgba(11,18,32,0.22)]"
      aria-label="Mentavio full logo"
      style={{
        backgroundImage: `url(${logoBoardUrl})`,
        backgroundPosition: '0% 0%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '174% auto',
      }}
    />
  );
}

function BrandWordmark() {
  return (
    <div
      className="h-14 w-full max-w-[430px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]"
      aria-label="Mentavio wordmark"
      style={{
        backgroundImage: `url(${logoBoardUrl})`,
        backgroundPosition: '100% 0%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '236% auto',
      }}
    ></div>
  );
}

function SophiaPanel() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              Sophia
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI decision mentor
            </p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
          Calm guidance
        </span>
      </div>

      <div className="mt-12 grid gap-4">
        <div className="max-w-[82%] rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/[0.08] dark:text-slate-200">
          What should I pay attention to before making this decision?
        </div>
        <div className="ml-auto max-w-[88%] rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-white dark:bg-white dark:text-slate-950">
          Start with the evidence, then compare risk, timing, and alternatives.
          A good decision is not a prediction. It is a disciplined process.
        </div>
        <div className="max-w-[78%] rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/[0.08] dark:text-slate-200">
          Help me understand the tradeoff.
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Sophia principle
        </p>
        <p className="mt-3 text-lg font-medium leading-7 text-slate-950 dark:text-white">
          Guidance over guesses. Clarity over noise.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-950 antialiased dark:bg-[#07111f] dark:text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a
          className="flex items-center gap-3"
          href="#top"
          aria-label="Mentavio home"
        >
          <MentavioLogo />
          <div>
            <p className="text-base font-semibold tracking-tight">Mentavio</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learn. Think. Grow.
            </p>
          </div>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a href="#sophia">Sophia</a>
          <a href="#vision">Vision</a>
          <a href="#ecosystem">Ecosystem</a>
        </nav>
        <a
          className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          href={tradingAppUrl}
        >
          Get Started
        </a>
      </header>

      <section
        id="top"
        className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-24 pt-14 md:px-10 md:pb-32 lg:grid-cols-[1.04fr_0.96fr] lg:items-center"
      >
        <div>
          <MentavioLockup />
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
            Learn. Think. Grow.
          </p>
          <h1 className="mt-5 max-w-4xl text-6xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white md:text-8xl">
            Mentavio
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600 dark:text-slate-300 md:text-2xl">
            Build better decisions with AI.
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Mentavio combines investing, education, strategic thinking and
            intelligent assistance into one platform.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              id="start"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              href={tradingAppUrl}
            >
              Get Started
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-7 py-4 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/[0.06]"
              href="#sophia"
            >
              Meet Sophia
            </a>
          </div>
        </div>

        <div className="rounded-[2.4rem] border border-slate-200 bg-slate-50 p-4 shadow-[0_30px_100px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.04]">
          <div className="mb-4 flex justify-end">
            <BrandWordmark />
          </div>
          <SophiaPanel />
        </div>
      </section>

      <section
        id="sophia"
        className="border-y border-slate-200 bg-slate-50/80 py-24 dark:border-white/10 dark:bg-white/[0.03]"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              Sophia
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
              Meet Sophia
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Sophia is your intelligent companion. She is a knowledgeable guide
              inside the Mentavio ecosystem, designed to help you understand,
              compare, and improve decisions.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sophiaCapabilities.map((capability) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-5 text-base font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                key={capability}
              >
                {capability}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="vision"
        className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
            Why Mentavio?
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
            Better thinking becomes a platform.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {visionCards.map((card) => (
            <article
              className="rounded-[1.6rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.05]"
              key={card.title}
            >
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="ecosystem"
        className="mx-auto w-full max-w-7xl px-6 pb-28 md:px-10"
      >
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12 dark:bg-white dark:text-slate-950">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400 dark:text-emerald-700">
                Future ecosystem
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
                Trading is one application. Thinking is the platform.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300 dark:text-slate-600">
                Mentavio is designed to become an ecosystem for improving human
                thinking across investing, learning, games, strategy, and AI
                decision support.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {ecosystemModules.map((module) => (
                <a
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-sm font-semibold dark:border-slate-200 dark:bg-slate-50"
                  href={module === 'Investing' ? tradingAppUrl : '#ecosystem'}
                  key={module}
                >
                  {module}
                  <span className="mt-2 block text-xs font-medium text-slate-400 dark:text-slate-500">
                    {module === 'Investing'
                      ? 'Open Trading Simulator'
                      : 'Planned'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-10 dark:border-white/10 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">
              Mentavio
            </p>
            <p>Learn. Think. Grow.</p>
          </div>
          <div className="flex gap-5">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p>Copyright © 2026 Mentavio.</p>
        </div>
      </footer>
    </main>
  );
}
