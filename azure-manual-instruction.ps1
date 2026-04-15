# Stop relying on the CLI! Go completely SaaS / Browser based!
# We will use Microsoft Azure App Service (Platform as a Service)

# 1. Zip up your Java Backend code since Azure can build it remotely!
Write-Host "Zipping Java code for Azure App Service..." -ForegroundColor Cyan
if (Test-Path "java-backend.zip") { Remove-Item "java-backend.zip" }
Compress-Archive -Path java-backend\* -DestinationPath java-backend.zip

Write-Host "======================================================" -ForegroundColor Green
Write-Host "Code is bundled in java-backend.zip!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

Write-Host "Since the Azure CLI is blocking you with MFA," -ForegroundColor Yellow
Write-Host "we will deploy this manually using the Azure Website!" -ForegroundColor Yellow
Write-Host "Follow these exact steps:"
Write-Host "1. Go to portal.azure.com > App Services > Create."
Write-Host "2. Publish: Code"
Write-Host "3. Runtime Stack: Java 17 / Java SE (Embedded Web Server)"
Write-Host "4. Operating System: Linux"
Write-Host "5. Click 'Review + Create'!"
Write-Host "6. After it creates, go to your new App Service, click 'Deployment Center', select 'Local Git', and upload your java-backend.zip file!"
