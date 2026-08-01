# Android Public Demo

This project can be demonstrated online with a downloadable Android APK and a public data-server URL.

## Current Setup

- APK download target: GitHub Releases
- Release automation: `.github/workflows/android-debug-release.yml`
- Remote Android server config: `public/mobile-config.json`
- Runtime config URL used by the APK:
  `https://raw.githubusercontent.com/rentar4-cpu/trading-academy/master/public/mobile-config.json`

The APK reads `mobile-config.json` at startup. This allows the server address to change without rebuilding the APK.

## Demo Flow

1. Start the local Mentavio backend.

   ```powershell
   cd "C:\Users\renta\OneDrive\Desktop\STOCK MARKET PROJECT\trading-academy-backend"
   npm run start:dev
   ```

2. Start a public tunnel to the local backend.

   ```powershell
   cloudflared tunnel --url http://localhost:3000
   ```

3. Copy the generated `https://...trycloudflare.com` URL.

4. Update `public/mobile-config.json`.

   ```json
   {
     "enabled": true,
     "apiBase": "https://your-current-tunnel.trycloudflare.com",
     "updatedAt": "2026-07-31"
   }
   ```

5. Commit and push the config update to GitHub.

6. Install the latest APK from GitHub Releases:

   ```text
   https://github.com/rentar4-cpu/trading-academy/releases/latest
   ```

   Stable direct APK link:

   ```text
   https://github.com/rentar4-cpu/trading-academy/releases/latest/download/Mentavio-android-debug.apk
   ```

7. Open the app. It will read the current server address from GitHub and connect to the public tunnel.

## Important Notes

- The local computer must remain on.
- The backend server must keep running.
- The Cloudflare Tunnel window must remain open.
- A quick Cloudflare Tunnel URL may change after restart.
- If the tunnel URL changes, only `public/mobile-config.json` needs to be updated and pushed.
- For a permanent production setup, replace the tunnel URL with a real hosted backend URL.

## APK Release Naming

Recommended public file name:

```text
Mentavio-android-debug.apk
```

Versioned files may also be attached for history, for example:

```text
Mentavio-android-v2026-08-01-sophia-response-fix-debug.apk
```

Current Sophia local AI build:

```text
Mentavio-2026-08-01-sophia-local-ai-debug.apk
```

## Creating a New GitHub APK Release

Push a tag that starts with `android-v`.

```powershell
git tag android-v2026-08-01-sophia-local-ai
git push origin android-v2026-08-01-sophia-local-ai
```

GitHub Actions will build the APK and attach it to a GitHub Release automatically.
