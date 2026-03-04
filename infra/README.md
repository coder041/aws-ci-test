# Terraform: AWS CI/CD test project

This directory defines the AWS infrastructure for **aws-ci-test**: ECR, ECS (Fargate), and an Application Load Balancer so the backend has a **stable URL**. Two environments are supported via **Terraform workspaces**: **default** (production/main) and **staging**.

## What gets created (per workspace)

| Resource | Production (default) | Staging |
|----------|----------------------|--------|
| **ECR** | `test/aws-ci-test-backend` | `test/aws-ci-test-staging-backend` |
| **ECS cluster** | `aws-ci-test-cluster` | `aws-ci-test-staging-cluster` |
| **ECS service** | `aws-ci-test-backend-svc` | `aws-ci-test-staging-backend-svc` |
| **ALB** | `aws-ci-test-alb` | `aws-ci-test-staging-alb` |
| **Target group** | `aws-ci-test-backend-tg` | `aws-ci-test-staging-backend-tg` |
| **Backend URL** | `http://<prod-alb-dns>` | `http://<staging-alb-dns>` |

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.5
- AWS CLI configured (e.g. `aws configure`) with credentials that can create ECR, ECS, ALB, IAM

If you **already created** the ECR repository or other resources manually, either remove them in the AWS console and let Terraform create them, or import them (see below).

### Fix: "Already exists" errors during apply

If `terraform apply` fails because **ECR**, **ECS cluster**, or **CloudWatch log group** already exist, import them (run from `infra/` with no other Terraform process running to avoid state lock):

```bash
cd infra

# 1. ECR repository
terraform import aws_ecr_repository.backend test/aws-ci-test-backend

# 2. ECS cluster
terraform import aws_ecs_cluster.main aws-ci-test-cluster

# 3. CloudWatch log group
terraform import aws_cloudwatch_log_group.backend /ecs/aws-ci-test-backend-task

# 4. Apply again to create task definition + ECS service (and align any config)
terraform apply
```

## Quick start

**Production (main)** — you may already have this:

```bash
cd infra
terraform init
terraform workspace select default   # or omit; default is default
terraform plan
terraform apply
```

**Staging** — create and apply in the staging workspace:

```bash
cd infra
terraform workspace new staging      # only first time
terraform workspace select staging
terraform plan
terraform apply
```

After each apply, note the **outputs** (e.g. `backend_url`, `ecr_repository_name`) for that workspace. Use them for GitHub Actions variables.

## GitHub Actions variables

In the repo **Settings → Secrets and variables → Actions → Variables**, set:

**Shared (both environments):**

| Variable | Value |
|----------|--------|
| `AWS_ACCOUNT_ID` | Your 12-digit account ID |
| `AWS_REGION` | `us-west-2` |

**Production (main branch)** — from `terraform workspace select default` then `terraform output`:

| Variable | Value |
|----------|--------|
| `ECR_REPOSITORY` | `terraform output -raw ecr_repository_name` → `test/aws-ci-test-backend` |
| `ECS_CLUSTER` | `terraform output -raw ecs_cluster_name` → `aws-ci-test-cluster` |
| `ECS_SERVICE` | `terraform output -raw ecs_service_name` → `aws-ci-test-backend-svc` |

**Staging (staging branch)** — from `terraform workspace select staging` then `terraform output`:

| Variable | Value |
|----------|--------|
| `ECR_REPOSITORY_STAGING` | `terraform output -raw ecr_repository_name` → `test/aws-ci-test-staging-backend` |
| `ECS_CLUSTER_STAGING` | `terraform output -raw ecs_cluster_name` → `aws-ci-test-staging-cluster` |
| `ECS_SERVICE_STAGING` | `terraform output -raw ecs_service_name` → `aws-ci-test-staging-backend-svc` |

Secrets `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are shared (same for both).

## First deploy after Terraform

- **main** → workflow **Deploy backend to ECS (dev)** runs; uses `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE` → production URL.
- **staging** → workflow **Deploy backend to ECS (staging)** runs; uses `ECR_REPOSITORY_STAGING`, `ECS_CLUSTER_STAGING`, `ECS_SERVICE_STAGING` → staging URL.

Backend URLs (no AWS console needed):

- **Production:** `terraform workspace select default && terraform output -raw backend_url`
- **Staging:** `terraform workspace select staging && terraform output -raw backend_url`

Then e.g. `curl <backend_url>/health` and `curl <backend_url>/api/hello`.

## Variables (optional)

See `variables.tf`. Override with `-var` or a `terraform.tfvars` file, e.g.:

```hcl
aws_region   = "us-west-2"
project_name = "aws-ci-test"
environment  = "dev"
```

## Staging and production

- **default** workspace = production (branch `main`). Resources named `aws-ci-test-*`.
- **staging** workspace = staging (branch `staging`). Resources named `aws-ci-test-staging-*`.
- Workflow `deploy-dev.yml` deploys to production on push to `main`. Workflow `deploy-staging.yml` deploys to staging on push to `staging`.

## State (optional)

By default Terraform keeps state locally. For a team or CI, use a remote backend (e.g. S3 + DynamoDB). Uncomment the `backend "s3"` block in `versions.tf` and create the bucket and table, then run `terraform init -reconfigure`.

## Destroy

Destroy the current workspace’s resources:

```bash
terraform workspace select staging   # or default
terraform destroy
```

To remove staging only, select the staging workspace and run `terraform destroy`. Production is unchanged while in the default workspace.
