# Download Mentario for Android

The latest public demo APK is published through GitHub Releases:

```text
https://github.com/rentar4-cpu/trading-academy/releases/latest
```

Open the latest release and download the `.apk` file.

## Current Local Build

```text
releases/android/Mentario-2026-07-31-mvp-foundation-debug.apk
```

SHA256:

```text
5F51033988A0B4C61AA9C53F92B78E4838270374B65D668F721048B9EE1C5E27
```

## How the APK Finds the Server

The APK reads the current server address from:

```text
https://raw.githubusercontent.com/rentar4-cpu/trading-academy/master/public/mobile-config.json
```

For a remote demo, update `apiBase` in `public/mobile-config.json` to the current public HTTPS server URL, commit it, and push it to GitHub.
