# CI/CD Blueprint

This document outlines the automated pipelines for both the mobile application and backend service.

## Backend Service (`services/api`)

- **Workflow**: `.github/workflows/backend-ci.yml`
- **Stages**:
  1. **Install** – Uses `npm ci` in `services/api` with Node.js 20.
  2. **Lint** – Runs `npm run lint`.
  3. **Unit Tests** – Runs `npm run test` with Jest + ts-jest.
  4. **Integration Tests** – Runs `npm run test:integration` (Supertest-based HTTP flow coverage).
  5. **Image Build & Push** – Builds Docker image and pushes to Amazon ECR on `main` branch.
  6. **Deploy** – Updates ECS service using GitHub `aws-actions` (requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `ECR_REPOSITORY`, and `ECS_SERVICE` secrets).

- **Manual Gates**: Production deployments require an environment protection rule in GitHub (`production` environment) ensuring human approval.

## Mobile App (`mobile` directory)

- **Workflow**: `.github/workflows/mobile-ci.yml`
- **Stages**:
  1. **Install** – Installs npm dependencies (Expo + React Native) when `mobile/package.json` exists.
  2. **Static Analysis** – Runs `npm run lint`.
  3. **Unit Tests** – Executes `npm run test` (Jest with React Native preset).
  4. **Integration / E2E** – Optional Detox suite triggered via `npm run test:e2e` if present.
  5. **Build & Distribute** – Uses Fastlane to produce an iOS archive and upload to TestFlight.

- **Secrets**: Requires `APPLE_ID`, `APP_STORE_CONNECT_API_KEY_ID`, `APP_STORE_CONNECT_API_KEY`, `APP_STORE_CONNECT_API_ISSUER_ID`, and `MATCH_PASSWORD`. Android distribution uses `GOOGLE_SERVICE_ACCOUNT`.

## Branching Strategy

- **Feature branches** trigger all checks except deployment.
- **`develop`** deploys to the staging environment automatically after tests.
- **`main`** deploys to production after manual approval.

## Observability Hooks

Both workflows emit deployment metadata to Datadog via `DATADOG_API_KEY`, enabling release correlation in dashboards. See `docs/devops/monitoring-feedback.md` for instrumentation details.
