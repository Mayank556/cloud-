# Master Guide to Launch the Remaining Clouds manually without CLI MFA issues

## 1. Vercel PostgreSQL Database (Done via GitHub!)
I just updated your Vercel React App repo! Vercel is currently rebuilding your website with the new Database Backend API.
*   **To make it live:** Log into the Vercel Dashboard, go to your Project, click the "Storage" tab, and click "Create Database". Vercel will instantly tie a live PostgreSQL cluster to your repo for free without any further code changes.

## 2. Google App Engine (Python)
Because you have MFA on your Microsoft/Google accounts, tools running strictly via the CLI are usually blocked. Here is the GUI approach:
1.  Go to `console.cloud.google.com`
2.  Enable the **App Engine** API.
3.  Click the "**Activate Cloud Shell**" icon in the top right of the browser (looks like `>_`). This opens a terminal *inside* your authorized browser window, completely bypassing your computer's MFA restrictions!
4.  There is an "Upload" button in the Cloud Shell. Upload the `/python-backend` files to it.
5.  Run `gcloud app deploy` inside the cloud shell.

## 3. Salesforce (SaaS Integration)
1.  Log into your **Salesforce Developer Edition**.
2.  In the top right, click the Gear icon > Developer Console.
3.  File > New > Apex Class.
4.  Copy the code from `salesforce/CloudIntegrationService.cls` and click Save. 
5.  You can then right click > Open Execute Anonymous Window and type `CloudIntegrationService.sendDataToCloud('123');` to ping your API!
