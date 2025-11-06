# Monitoring & Feedback Stack

## Mobile (iOS & Android)

- **Crashlytics**: Integrated via Firebase SDK (`@react-native-firebase/crashlytics`). Enable crash reporting in release builds and capture non-fatal errors with custom keys (e.g., `screen`, `feature_flag`). Use Fastlane to upload dSYM files during TestFlight deployments.
- **Performance Monitoring**: Firebase Performance Monitoring (`@react-native-firebase/perf`) instruments network requests automatically. Annotate critical flows with `trace` markers for launch time, sign-in, and news feed refresh.
- **In-App Feedback**: Deploy Instabug or Appcues for beta testers. A lightweight alternative is a custom "Send Feedback" modal posting to the backend `/api/feedback` endpoint (to be implemented). Attach device metadata and optional screenshots.

## Backend (AWS)

- **Metrics & Logs**: Use AWS CloudWatch Container Insights for CPU, memory, and network metrics. Emit structured JSON logs (via a logger such as Pino) and ship them to CloudWatch Logs. Create metric filters for error rates.
- **Tracing**: Adopt AWS X-Ray (via `aws-xray-sdk`) to trace API requests, enabling correlation with downstream services.
- **Alerting**: CloudWatch Alarms send notifications to an SNS topic connected to Slack and PagerDuty. Key alarms: 5xx error rate, latency p95, queue depth, CPU > 80% for 5 minutes.

## Release Analytics

- **Datadog**: Forward deployment metadata (version, git SHA, environment) from CI to Datadog Events API. Dashboards combine CI events with CloudWatch metrics for release health.
- **Product Analytics**: Amplitude SDK in both web (Next.js) and mobile clients for feature adoption tracking. Backend emits server-side Amplitude events to match business KPIs.

## Operational Runbooks

1. **Crash Triage** – Review Crashlytics issues daily, prioritize by affected users, link to Jira ticket.
2. **SLO Monitoring** – Maintain SLOs (Availability 99.9%, latency p95 < 300ms). Violations trigger an incident review.
3. **Feedback Loop** – Weekly digest of Instabug feedback and App Store reviews, cross-referenced with analytics trends.
