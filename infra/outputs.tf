output "ecr_repository_url" {
  description = "ECR repository URL for the backend image"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_repository_name" {
  description = "ECR repository name (for GitHub Actions ECR_REPOSITORY variable)"
  value       = aws_ecr_repository.backend.name
}

output "ecs_cluster_name" {
  description = "ECS cluster name (for GitHub Actions ECS_CLUSTER variable)"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name (for GitHub Actions ECS_SERVICE variable)"
  value       = aws_ecs_service.backend.name
}

output "backend_url" {
  description = "Stable URL for the backend API (ALB)"
  value       = "http://${aws_lb.main.dns_name}"
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB Route53 zone ID (for alias records if you add a custom domain)"
  value       = aws_lb.main.zone_id
}
