resource "aws_db_instance" "primary" {
  instance_class         = var.config.instance_class
  allocated_storage      = var.config.storage.allocated_storage
  storage_type           = var.config.storage.storage_type
  engine                 = var.config.engine
  engine_version         = var.config.engine_version
  identifier             = "${var.application}-${var.environment}"
  deletion_protection    = var.environment == "prod"
  vpc_security_group_ids = [var.aws_security_group.this.id]
  db_subnet_group_name   = var.db_subnet_group_name
  username               = var.username
  password               = var.password
  kms_key_id             = var.kms_key_id
  tags                   = merge(local.default_tags, var.additional_tags)

  # Ensure db_name is used correctly
  #db_name                = var.application
}

resource "aws_db_instance" "read_replica" {
  count               = var.environment == "prod" ? 1 : 0
  replicate_source_db = aws_db_instance.primary.identifier
  instance_class      = var.config.instance_class
  identifier          = "${var.application}-${var.environment}-replica"
  tags                = merge(local.default_tags, var.additional_tags)
}
