locals {
  default_tags = {
    "ManagedBy"   = "Terraform"
    "Environment" = var.environment
  }
}
