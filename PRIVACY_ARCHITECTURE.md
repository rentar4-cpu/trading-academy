# Mentavio Privacy Architecture

Status: MVP working draft

## Data Currently Collected

- User email, display name, password hash, verification state, account tokens, account level, login streak, and activity metrics.
- Simulated player profile, session cash, holdings, trades, purchases, achievements, daily quests, and market activity.
- Early access signup, referral, product update, DevLog, share, and platform activity records.
- Legal consent records for Terms, Privacy Policy, Educational Disclaimer, and 18+ confirmation.

## Storage

- Primary data is stored in PostgreSQL through TypeORM entities.
- Browser and APK local storage store only client state such as current player id, account mode, cached user summary, and runtime server URL.
- Passwords are stored as PBKDF2 hashes, not plain text.

## External Services

- GitHub stores source code, public release assets, and the Android server configuration file.
- Cloudflare Tunnel may temporarily proxy traffic from a public URL to the local development server.
- No real payment provider or AI provider is connected in this MVP.

## Data Not Required For MVP

- Payment card numbers.
- Government identity documents.
- Real brokerage credentials.
- Biometric data.
- Precise physical location.

## Planned Privacy Tasks

- Add account export.
- Add account deletion.
- Add admin review for consent records.
- Add production backup policy.
- Add production incident response notes.

