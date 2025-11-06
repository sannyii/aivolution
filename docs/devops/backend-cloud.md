# Backend & Cloud Foundation

## Technology Choices

- **Language & Framework**: TypeScript with Express (see `services/api`). TypeScript delivers compile-time safety and pairs well with the Next.js frontend. Express keeps the base stack lightweight while leaving room for future migration to NestJS or serverless handlers.
- **Cloud Provider**: **Amazon Web Services (AWS)**, chosen for its mature managed container tooling (ECS Fargate), event-driven services, and first-class observability suite.
- **Runtime Platform**: AWS Fargate running behind an Application Load Balancer. Container images are stored in Amazon Elastic Container Registry (ECR).
- **Data & Messaging (future-ready)**: Amazon RDS (PostgreSQL) for relational data and Amazon SQS for async workloads.

## Repository Layout

```
services/
  api/            # Express TypeScript service (unit & integration tests included)
```

## Local Workflow

1. `cd services/api`
2. `npm install`
3. `npm run dev`
4. Use `npm run test` / `npm run test:integration` to validate changes.

## AWS Deployment Pipeline

1. **Build & Test**: GitHub Actions workflow (`.github/workflows/backend-ci.yml`) executes linting and both test suites.
2. **Image Build**: On successful checks, GitHub Actions builds a Docker image, tags it with the commit SHA, and pushes to ECR.
3. **Deploy**: AWS CodeDeploy (or GitHub Actions with `aws-actions/amazon-ecs-deploy-task-definition`) updates the ECS service. Blue/green deployments are enabled by default via Application Load Balancer target groups.
4. **Secrets Management**: Application secrets live in AWS Systems Manager Parameter Store. The ECS task execution role reads parameters at runtime.
5. **Infrastructure as Code**: Provisioning handled via Terraform or AWS CDK (see `docs/devops/infra-aws.md` for module layout).

## Environment Topology

| Environment | Purpose | Notes |
| --- | --- | --- |
| `dev` | Feature branches, preview deployments | Auto-provision ephemeral ECS services with lower scale. |
| `staging` | Pre-release QA | Mirrors production scale, runs full integration/regression suite. |
| `production` | Customer traffic | Protected branch deployment, manual approval stage. |

Each environment uses dedicated AWS accounts linked via AWS Organizations to enforce blast-radius boundaries.
