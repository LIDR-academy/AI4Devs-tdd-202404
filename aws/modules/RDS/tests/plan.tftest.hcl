mock_provider "aws" {
  mock_resource "aws_db_instance" {
    defaults = {
      db_instance_endpoint = "mocked-endpoint"
      db_instance_id       = "mocked-id"
    }
  }
}

run "apply" {
  command = apply

  variables {
    config = {
      instance_class = "db.t2.micro"
      storage = {
        allocated_storage = 20
        storage_type      = "gp2"
      }
      engine         = "mysql"
      engine_version = "8.0.23"
    }
    application = "test-app"
    environment = "test"
    aws_security_group = {
      this = {
        id = "sg-123456"
      }
    }
    db_subnet_group_name = "test-subnet-group"
    username             = "admin"
    password             = "securepassword"
    kms_key_id           = "arn:aws:kms:us-east-1:123456789012:key/abcd1234-a123-456a-a12b-a123b4cd56ef"
    additional_tags = {
      "Project" = "Test"
    }
  }

  assert {
    condition     = aws_db_instance.primary.instance_class == "db.t2.micro"
    error_message = "The instance class is not as expected."
  }

  assert {
    condition     = aws_db_instance.primary.allocated_storage == 20
    error_message = "The allocated storage is not as expected."
  }

  assert {
    condition     = aws_db_instance.primary.engine == "mysql"
    error_message = "The engine is not as expected."
  }

  assert {
    condition     = aws_db_instance.primary.engine_version == "8.0.23"
    error_message = "The engine version is not as expected."
  }
}