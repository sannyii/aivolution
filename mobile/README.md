# Mobile App Blueprint

The mobile client is built with React Native (Expo Router) to complement the Next.js web experience.

## Quick Start

```bash
cd mobile
npm install
npm run start
```

- `npm run lint` – ESLint with React Native rules
- `npm run test` – Jest unit tests
- `npm run test:e2e` – Detox end-to-end suite (requires iOS/Android simulators)

## TestFlight Distribution

Fastlane configuration lives in `mobile/fastlane/Fastfile`. Provide the following secrets in GitHub Actions:

- `APPLE_ID`
- `APP_STORE_CONNECT_API_KEY`
- `APP_STORE_CONNECT_API_KEY_ID`
- `APP_STORE_CONNECT_API_ISSUER_ID`
- `MATCH_PASSWORD`
- `BETA_CONTACT_EMAIL`
- `BETA_CONTACT_PHONE`
- `BETA_DEMO_USER`
- `BETA_DEMO_PASSWORD`

CI triggers the `beta` lane on pushes to `main` after successful testing.
