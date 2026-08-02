# SPEC-029 — Mentavio Financial Glossary and AI Mentor Trust

**Status:** Planned  
**Created:** 2026-08-02  
**Product area:** Financial education, Sophia AI mentor, knowledge architecture  
**Priority:** High

## Goal

Build a curated financial glossary for beginners and integrate it with Sophia so that Mentavio can explain financial-market concepts accurately, naturally, and in the context of the user's current simulated experience.

The feature must reduce hallucinations, prevent unsupported claims, and make Sophia meaningfully different from a generic search engine or a robotic definition service.

## Product principle

Sophia must prioritize:

1. accuracy;
2. transparency;
3. educational usefulness;
4. simulation context;
5. clear risk explanation;
6. natural language;
7. admission of uncertainty when verified information is unavailable.

One confident invented answer can destroy trust created by many correct answers. Sophia must therefore prefer an honest limitation over an unsupported answer.

## Reference sources

Use authoritative educational sources to identify and verify terminology, including:

- IBKR Traders' Glossary and IBKR Campus;
- Investor.gov / U.S. Securities and Exchange Commission investor glossary;
- FINRA investor education materials;
- other approved primary or authoritative sources when required.

Do not copy definitions verbatim. Rewrite all entries in Mentavio's own beginner-friendly language.

Do not import every term automatically. Exclude:

- Interactive Brokers product-specific terminology;
- TWS interface terminology;
- account-administration terms unrelated to Mentavio;
- jurisdiction-specific tax forms;
- obsolete concepts;
- excessively specialized terms outside the current simulator;
- terminology that cannot yet be demonstrated meaningfully inside Mentavio.

## Initial scope

Create an initial reviewed set of approximately **100–150 terms** divided into:

1. Market basics
2. Stocks and company ownership
3. Buying and selling
4. Orders and execution
5. Portfolio and diversification
6. Risk and return
7. Margin and leverage
8. Short selling
9. Fundamental analysis
10. Market events and economic cycles
11. ETFs, indices, and funds
12. Basic options terminology
13. Trading psychology
14. Performance measurement

The first release must include at least:

Stock, Share, Common stock, Preferred stock, Exchange, Broker, Portfolio, Position, Long position, Short position, Short sale, Covering a short, Borrowed shares, Margin, Margin account, Initial margin, Maintenance margin, Margin call, Leverage, Liquidation, Collateral, Buying power, Cash account, Market order, Limit order, Stop order, Stop-loss order, Bid, Ask, Bid-ask spread, Volume, Liquidity, Volatility, Market capitalization, Dividend, Capital gain, Capital loss, Return, Risk, Diversification, Asset allocation, Index, Benchmark, ETF, Bull market, Bear market, Correction, Crash, Rally, Support, Resistance, Trend, Fundamental analysis, Technical analysis, Revenue, Profit, Net income, Earnings per share, P/E ratio, Debt, Equity, Cash flow, Balance sheet, Income statement, Economic cycle, Expansion, Peak, Recession, Recovery, Inflation, Interest rate, Sector, and Market event.

## Data model

Each glossary entry must contain:

- `id`
- `term`
- `aliases`
- optional Russian alias
- category
- difficulty level
- beginner definition
- simple explanation
- Mentavio fictional example
- main risk or common misunderstanding
- related terms
- source references
- version
- reviewed status
- reviewer or review source
- last reviewed date

Example:

```json
{
  "id": "leverage",
  "term": "Leverage",
  "aliases": ["financial leverage", "trading leverage", "плечо"],
  "category": "Risk and margin",
  "difficulty": "beginner",
  "beginner_definition": "Leverage means controlling a larger market position using a smaller amount of your own simulated capital.",
  "simple_example": "With 2:1 leverage, $1,000 of simulated personal capital controls a $2,000 simulated position.",
  "risk_explanation": "Leverage increases both potential gains and potential losses.",
  "related_terms": ["margin", "margin call", "equity", "liquidation"],
  "source_references": ["IBKR Traders' Glossary", "Investor.gov", "FINRA"],
  "version": 1,
  "reviewed": true
}
```

## Storage and retrieval architecture

Do not place the full glossary directly into Sophia's permanent system prompt.

Store the glossary in a maintainable source such as versioned JSON, database tables, or another structured repository-backed format approved by the existing architecture.

Implement retrieval so that relevant reviewed entries are supplied to Sophia when a user asks about a term or when a term is relevant to the current simulation context.

Required retrieval behavior:

- exact-term lookup;
- alias lookup;
- normalized lookup;
- cross-language alias support where approved;
- related-term retrieval;
- version tracking;
- reviewed/unreviewed state;
- no use of unreviewed entries as authoritative definitions.

## Sophia answer behavior

When the user asks about a term, Sophia should explain:

1. what the concept means;
2. how it works;
3. why it matters in the user's current situation;
4. a simple fictional Mentavio example;
5. the main risk or common misunderstanding;
6. related concepts the user may examine next.

Sophia must adapt the answer to:

- the user's current simulated portfolio;
- recent actions;
- current fictional market events;
- the user's demonstrated level of knowledge;
- the exact wording and intent of the question.

The visible answer should sound natural. A consistent internal structure is allowed, but Sophia must not repeat the same robotic template in every response.

## Accuracy and anti-hallucination rules

Sophia must not invent:

- definitions;
- market rules;
- company facts;
- prices;
- calculations;
- account requirements;
- regulations;
- tax treatment;
- source references;
- features that are not implemented in Mentavio.

For financial terminology, the reviewed Mentavio glossary is the primary source of truth.

Sophia must distinguish between:

- reviewed glossary knowledge;
- current Mentavio simulation data;
- general educational explanation;
- interpretation;
- uncertainty.

When verified information is insufficient, Sophia must say so clearly instead of guessing.

Sophia must never pretend that the Mentavio simulation fully reproduces real markets.

## High-risk concepts

For leverage, margin, short selling, derivatives, borrowing, liquidation, and other high-risk concepts, every relevant answer must explain:

- the downside;
- the possibility of amplified losses;
- the difference between the simplified simulation and real-market behavior;
- that the explanation is educational and not personal financial advice.

Sophia must never frame leverage, short selling, or derivatives as an easy path to profit.

## User interface

Add a **Glossary** section accessible from:

- the landing page;
- the browser application;
- the Android application;
- the Sophia interface.

Required functionality:

- alphabetical browsing;
- category filtering;
- search by term;
- search by alias;
- related-term links;
- “Ask Sophia” action;
- responsive mobile layout;
- direct linking to a glossary entry;
- clickable glossary terms or contextual tooltips where practical.

Where relevant, terms shown in portfolio, market, trade, events, and Sophia screens should link to their glossary entries.

## Logging and review

Log enough information to evaluate trust and quality:

- user question;
- retrieved glossary entries;
- simulation context supplied to the model;
- generated answer;
- response time;
- model and prompt version;
- glossary version;
- user feedback;
- fallback or uncertainty state.

Do not log secrets or unnecessary personal data.

## Evaluation set

Create a reviewed evaluation set containing:

- common beginner questions;
- ambiguous questions;
- common misconceptions;
- deliberately misleading questions;
- questions using aliases;
- Russian and English terminology where supported;
- questions requiring Sophia to admit uncertainty;
- high-risk terminology;
- questions tied to current simulated portfolio context.

Run the evaluation whenever the system instructions, glossary, retrieval logic, model, provider, response formatting, or simulation-context payload changes.

## Required tests

Verify:

- exact-term lookup;
- alias lookup;
- “short,” “short selling,” and “short position” resolve correctly;
- “leverage” and “плечо” resolve to the same concept;
- related terms link correctly;
- unreviewed terms are not presented as verified;
- Sophia uses the stored definition;
- Sophia admits when a term is absent;
- Sophia does not invent sources;
- Sophia explains downside for high-risk concepts;
- Android WebView displays the glossary correctly;
- the browser version remains functional;
- existing APK, simulation, portfolio, and AI flows are not broken.

## Non-goals for the first version

Do not:

- train a new foundation model;
- import an unlimited financial encyclopedia;
- add real-money trading;
- provide personal investment recommendations;
- connect to brokerage accounts;
- implement jurisdiction-specific legal or tax advice;
- replace reviewed content with unrestricted web search.

## Implementation constraint

Inspect the existing Sophia architecture, provider abstraction, system instructions, simulation context, frontend, backend, database, and Android WebView before implementation.

Do not change unrelated working functionality.

Build the glossary and trust layer as a maintainable product subsystem rather than a one-time prompt patch.
