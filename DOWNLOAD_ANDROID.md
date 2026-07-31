# Download Mentavio for Android

The latest public demo APK is published through GitHub Releases:

```text
https://github.com/rentar4-cpu/trading-academy/releases/latest
```

Open the latest release and download the `.apk` file.

## Current Local Build

```text
releases/android/Mentavio-2026-07-31-name-fix-debug.apk
```

SHA256:

```text
D0117A51AADCD60ECBCB106421E34933FDEF19DAC24D27458D8700E1BBEDC488
```

## How the APK Finds the Server

The APK reads the current server address from:

```text
https://raw.githubusercontent.com/rentar4-cpu/trading-academy/master/public/mobile-config.json
```

For a remote demo, update `apiBase` in `public/mobile-config.json` to the current public HTTPS server URL, commit it, and push it to GitHub.
