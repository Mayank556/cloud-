terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" # Change to your preferred region
}

resource "aws_security_group" "java_sg" {
  name        = "java_backend_sg"
  description = "Security group for Java Backend on EC2"

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "java_backend" {
  ami           = "ami-0c101f26f147fa7fd" # Amazon Linux 2023 in us-east-1
  instance_type = "t2.micro"
  
  vpc_security_group_ids = [aws_security_group.java_sg.id]

  # Reads your user-data.sh script and passes it at startup
  user_data = file("../java-backend/user-data.sh")

  tags = {
    Name = "JavaBackend-EC2-Terraform"
  }
}

output "public_ip" {
  value = aws_instance.java_backend.public_ip
}
