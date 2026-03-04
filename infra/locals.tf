# Workspace "default" = production (main). Workspace "staging" = staging.
# Resource names get a suffix so staging has its own ECR, cluster, ALB, etc.
locals {
  env_suffix = terraform.workspace == "default" ? "" : "-${terraform.workspace}"
  name       = "${var.project_name}${local.env_suffix}"
}
