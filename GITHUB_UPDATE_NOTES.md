# Trading Academy - GitHub Update Notes

Prepared after Product Update #1.

## Current Repository

- Remote: `https://github.com/rentar4-cpu/trading-academy.git`
- Current branch: `master`
- Suggested commit message: `Product Update #1: scalable market economy and Android app`

## What Should Be Uploaded

Upload all current modified and new project files. The important changes are:

- Android/Capacitor app wrapper:
  - `android/`
  - `capacitor.config.json`
  - `package.json`
  - `package-lock.json`
- Runtime API configuration:
  - `public/runtime-config.js`
- Updated frontend game pages:
  - `public/app.js`
  - `public/auth.html`
  - `public/auth.js`
  - `public/index.html`
  - `public/intel.html`
  - `public/news.html`
  - `public/news.js`
  - `public/pages.js`
  - `public/portfolio.html`
  - `public/store.html`
  - `public/styles.css`
  - `public/sw.js`
  - `public/trades.html`
  - `public/manifest.webmanifest`
- Backend changes:
  - `src/main.ts`
  - `src/users/user.entity.ts`
  - `src/users/users.service.ts`
  - `src/market/market.controller.ts`
  - `src/market/market.module.ts`
  - `src/market/market.service.ts`
  - `src/market/market.data.ts`
  - `src/market/entities/achievement-progress.entity.ts`
  - `src/market/entities/daily-quest-progress.entity.ts`
  - `src/market/entities/economic-event.entity.ts`
  - `src/market/entities/monetization-offer.entity.ts`
  - `src/market/entities/sim-company.entity.ts`

## Product Update #1 Summary

- Split economy into session-only game cash and permanent account tokens.
- Store now sells token packs only.
- Added backend support for starting a new game session with tokens.
- Expanded market to 41 fictional companies.
- Expanded bot traders to 32 with different strategy styles.
- Expanded market events to 52.
- Added sector-specific event impact profiles.
- Moved scalable market content into `src/market/market.data.ts`.
- Added backend foundation for achievements.
- Added backend foundation for daily quests.
- Updated mobile/Android packaging and cache version.

## Verification Already Done

- JavaScript syntax checks passed.
- `npm run build` passed.
- `npx cap sync android` passed.
- Android debug APK build passed.

## Suggested Commands Tomorrow

```powershell
cd "C:\Users\renta\OneDrive\Desktop\STOCK MARKET PROJECT\trading-academy-backend"
git status
git add .
git commit -m "Product Update #1: scalable market economy and Android app"
git push origin master
```

## Important Note

Do not upload `.env` if it contains real database credentials. Check it before pushing.
