#!/bin/bash
# Script to install Docker, Docker Compose, and ownCloud on an OpenStack instance (Ubuntu/Debian)

echo "Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-compose-plugin

echo "Installing Docker Compose (standalone binary)..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "Starting ownCloud services..."
# Assuming you upload the docker-compose.yml to the same directory
sudo docker-compose up -d

echo "================================================"
echo "ownCloud deployed successfully on Private Cloud!"
echo "Access ownCloud at http://<openstack-instance-ip>:8080"
echo "================================================"
