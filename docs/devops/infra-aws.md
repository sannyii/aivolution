# AWS Infrastructure Modules

Use Terraform or AWS CDK to codify the platform. Suggested module layout:

```
infra/
  networking/
  security/
  services/
  observability/
```

## Core Components

- **Networking**: VPC with public & private subnets across three AZs, NAT gateways, and security groups for ALB and ECS tasks.
- **ECS Cluster**: Fargate capacity providers, service auto-scaling policies (CPU, memory, custom CloudWatch metrics).
- **Database**: Amazon RDS PostgreSQL with Multi-AZ and automated backups. Use AWS Secrets Manager for credentials.
- **Cache**: Amazon ElastiCache (Redis) for caching and pub/sub use cases.
- **Storage**: S3 buckets for assets, logs, and mobile OTA bundles. Enable default encryption and lifecycle policies.

## CI/CD Integration

- Terraform backend stored in S3 with state locking via DynamoDB.
- GitHub Actions authenticates with AWS using OpenID Connect (`aws-actions/configure-aws-credentials`).
- Promotion workflow: apply infrastructure changes in `staging`, run automated verification (load tests), then promote to `production` via pull request and manual approval.

## Security Baseline

- Enforce IAM least privilege for GitHub deployments using scoped IAM roles.
- Enable AWS WAF on the Application Load Balancer with managed rule sets.
- Centralize audit logging in AWS CloudTrail with access via AWS Security Hub.

## Cost Controls

- Budgets & alerts for ECS, RDS, and data transfer costs.
- Scheduled scaling for dev/staging clusters outside business hours.
- Use Graviton-based Fargate where available for cost/performance gains.
