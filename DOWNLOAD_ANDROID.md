# Download Mentavio for Android

The latest public demo APK is published through GitHub Releases:

```text
https://github.com/rentar4-cpu/trading-academy/releases/latest
```

Open the latest release and download the `.apk` file.

## How the APK Finds the Server

The APK reads the current server address from:

```text
https://raw.githubusercontent.com/rentar4-cpu/trading-academy/master/public/mobile-config.json
```

For a remote demo, update `apiBase` in `public/mobile-config.json` to the current public HTTPS server URL, commit it, and push it to GitHub.

