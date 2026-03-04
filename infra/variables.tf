variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-west-2"
}

variable "project_name" {
  description = "Project name used in resource naming"
  type        = string
  default     = "aws-ci-test"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "ecr_repository_name" {
  description = "ECR repository name (can include path, e.g. test/aws-ci-test-backend)"
  type        = string
  default     = "test/aws-ci-test-backend"
}

variable "backend_container_port" {
  description = "Port the backend container listens on"
  type        = number
  default     = 8000
}

variable "desired_task_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
}

variable "task_cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "task_memory_mb" {
  description = "Fargate task memory in MiB"
  type        = number
  default     = 512
}
