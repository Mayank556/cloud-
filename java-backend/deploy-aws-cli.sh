#!/bin/bash
# AWS CLI command to launch the EC2 instance automatically
# This replaces the need to click through the AWS web console!

# 1. First, make sure you configure your AWS credentials
# aws configure

# 2. Key Pair (You must create this once to SSH into your server)
# aws ec2 create-key-pair --key-name java-backend-key --query 'KeyMaterial' --output text > java-backend-key.pem
# chmod 400 java-backend-key.pem

# 3. Create a Security Group to open Port 8080 and 22
# aws ec2 create-security-group --group-name java-sg --description "Java Backend SG"
# aws ec2 authorize-security-group-ingress --group-name java-sg --protocol tcp --port 22 --cidr 0.0.0.0/0
# aws ec2 authorize-security-group-ingress --group-name java-sg --protocol tcp --port 8080 --cidr 0.0.0.0/0

# 4. Launch the Instance! (Using Amazon Linux 2023 AMI id: ami-0c101f26f147fa7fd - for us-east-1)
echo "Launching EC2 Instance..."
aws ec2 run-instances \
    --image-id ami-0c101f26f147fa7fd \
    --count 1 \
    --instance-type t2.micro \
    --key-name java-backend-key \
    --security-groups java-sg \
    --user-data file://user-data.sh \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=JavaBackend-EC2}]'
