# Download Mentavio for Android

The latest public demo APK is published through GitHub Releases:

```text
https://github.com/rentar4-cpu/trading-academy/releases/latest
```

Open the latest release and download the `.apk` file.

## Current Local Build

```text
releases/android/Mentavio-2026-08-01-landing-start-fix-debug.apk
```

SHA256:

```text
F3F8C4003B58CD5067C747E000DBA0771F363B15E703B53E02C32F5C2549D74B
```

## How the APK Finds the Server

The APK reads the current server address from:

```text
https://raw.githubusercontent.com/rentar4-cpu/trading-academy/master/public/mobile-config.json
```

For a remote demo, update `apiBase` in `public/mobile-config.json` to the current public HTTPS server URL, commit it, and push it to GitHub.
