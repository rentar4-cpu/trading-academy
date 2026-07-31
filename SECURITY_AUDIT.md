# Mentavio Security Audit Notes

Status: MVP working audit

## Current Controls

- `.env` is ignored by Git.
- APK files in `releases/android/*.apk` are ignored by Git.
- Passwords are hashed with PBKDF2.
- Sophia uses a mock provider and no AI API key is included in the client or APK.
- Registration now requires Terms, Privacy Policy, Educational Disclaimer, and 18+ confirmation.

## Known Risks

- TypeORM `synchronize: true` is convenient for MVP development but should be replaced with explicit migrations before production.
- Debug APK releases are suitable for testing, not Play Store production.
- Cloudflare quick tunnels are temporary and depend on the local computer staying online.
- GitHub repository visibility is public, so secrets must never be committed.
- Current legal documents are working drafts and require legal review before commercial launch.

## Next Security Tasks

- Add explicit database migrations.
- Add rate limiting for auth and public endpoints.
- Add production email verification delivery.
- Add account deletion and export.
- Add structured logging without sensitive data.

