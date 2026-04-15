#!/bin/bash
# Microsoft Azure CLI command to launch the Virtual Machine automatically

# 1. Login to Azure
# az login

# 2. Create a Resource Group
echo "Creating Resource Group..."
az group create --name CloudProjectRG --location eastus

# 3. Create the Virtual Machine and pass the user-data script to install Java
echo "Creating Azure Virtual Machine..."
az vm create \
  --resource-group CloudProjectRG \
  --name JavaBackendVM \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --custom-data user-data.sh \
  --public-ip-sku Standard

# 4. Open Port 8080 for the Java Spring Boot Backend
echo "Opening Port 8080..."
az vm open-port --port 8080 --resource-group CloudProjectRG --name JavaBackendVM

echo "Deployment initiated! Check your Azure Portal for the Public IP."
