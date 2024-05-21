variable "config" {
  type = object({
    instance_class = string
    storage = object({
      allocated_storage = number
      storage_type      = string
    })
    engine         = string
    engine_version = string
  })
  description = "Configuration object for the RDS instance"
}

variable "application" {
  type        = string
  description = "Application name"
}

variable "environment" {
  type        = string
  description = "Deployment environment (e.g., prod, dev)"
}

variable "aws_security_group" {
  type = object({
    this = object({
      id = string
    })
  })
  description = "AWS security group details"
}

variable "db_subnet_group_name" {
  type        = string
  description = "Database subnet group name"
}

variable "username" {
  type        = string
  description = "Username for the database"
}

variable "password" {
  type        = string
  description = "Password for the database"
}

variable "kms_key_id" {
  type        = string
  description = "KMS key ID for encryption"
}

variable "additional_tags" {
  type        = map(string)
  description = "Additional tags for the RDS instance"
}
