# Download Mentavio for Android

The latest public demo APK is published through GitHub Releases.

Recommended stable download page:

```text
https://github.com/rentar4-cpu/trading-academy/releases/latest
```

Open the latest release and download the `.apk` file.

Recommended stable direct APK link:

```text
https://github.com/rentar4-cpu/trading-academy/releases/latest/download/Mentavio-android-debug.apk
```

Do not share temporary browser links from `release-assets.githubusercontent.com`.
Those links can expire. Share the GitHub Release page or the stable direct APK
link above.

## Current Local Build

```text
releases/android/Mentavio-2026-08-01-sophia-local-ai-debug.apk
```

SHA256:

```text
6FB0C447082F1F30D05E308373230D0B75BFF3F67CECBADA35DC18704C81746D
```

## How the APK Finds the Server

The APK reads the current server address from:

```text
https://raw.githubusercontent.com/rentar4-cpu/trading-academy/master/public/mobile-config.json
```

For a remote demo, update `apiBase` in `public/mobile-config.json` to the current public HTTPS server URL, commit it, and push it to GitHub.
