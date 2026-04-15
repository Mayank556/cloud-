# 🚀 MASTER INSTRUCTION GUIDE: Enterprise Multi-Cloud Architecture

This document contains **ALL** instructions, commands, code references, and steps to view and manage your data across Vercel, PostgreSQL, Salesforce, and your backends. 

---

## 📂 1. PROJECT STRUCTURE & CODE OVERVIEW

Your project is divided into several powerful micro-architectures:

- `\vercel-react-app`: The modern React (Next.js) Frontend & serverless API.
- `\python-backend`: Python FastAPI application meant for Google App Engine (GAE).
- `\java-backend`: Java Spring Boot application meant for AWS/Azure.
- `\salesforce`: Apex triggers and classes for CRM integration.
- `\openstack-infrastructure`: Vagrant and Bash scripts to spin up a private cloud.
- `\private-cloud`: Scripts for setting up OwnCloud.

---

## 💻 2. ALL TERMINAL COMMANDS TO RUN LOCAL SERVERS

### A. Run the Vercel React Dashboard (Frontend)
1. Open terminal and navigate to the frontend folder:
   ```bash
   cd c:\Users\rahul\OneDrive\Desktop\cloudproject\vercel-react-app
   ```
2. Install Node modules (if not installed):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. **View locally:** Open `http://localhost:3000` in your browser.

### B. Run the Python FastAPI Server
1. Navigate to the Python backend:
   ```bash
   cd c:\Users\rahul\OneDrive\Desktop\cloudproject\python-backend
   ```
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
4. **View locally:** Open `http://localhost:8000/docs` to see the interactive API.

### C. Run the Java Spring Boot Server
1. Navigate to the Java backend:
   ```bash
   cd c:\Users\rahul\OneDrive\Desktop\cloudproject\java-backend
   ```
2. Compile and Run using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. **View locally:** Open `http://localhost:8080`

---

## 🌐 3. HOW TO SEE ALL DATA & INFORMATION IN VERCEL

Since your React app is deployed on Vercel, Vercel acts as your modern command center.

### Viewing the Live Application
- Every time you push to GitHub (`git push`), Vercel automatically deploys your app.
- Go to your Vercel Dashboard (https://vercel.com/dashboard) and click on your **`vercel-react-app`** project to find the live URL.

### Viewing Logs and Errors
1. In your Vercel project dashboard, click on the **"Deployments"** tab.
2. Click on the latest deployment.
3. Click on the **"Logs"** (or Deployment Logs) tab. Here you will see all `console.log` data, API fetching information, and errors.

### Viewing PostgreSQL Data (Neon Database in Vercel)
1. In your Vercel project, go to the **"Storage"** tab.
2. Click on your connected **Postgres** database (powered by Neon).
3. Click on the **"Data"** or **"Query"** tab.
4. Run SQL commands to view your tasks, e.g.:
   ```sql
   SELECT * FROM tasks;
   ```
5. You can directly edit, delete, or add data from this Vercel window, and it will instantly reflect on your live website.

---

## ☁️ 4. HOW SALESFORCE INTEGRATION WORKS

### How the React app talks to Salesforce
- Look at the file: `/vercel-react-app/pages/api/salesforce.js`
- It uses the `jsforce` library. When your frontend asks for contacts, this Next.js Serverless Function sends a request to Salesforce using your `.env` credentials (SF_USERNAME, SF_PASSWORD, SF_SECURITY_TOKEN).

### How Salesforce talks to Vercel (Webhooks)
- Look at the files in `/salesforce/*.trigger` and `*.cls`.
- Whenever a new Contact or Account is created inside your Salesforce Dashboard, the Apex Trigger (`PushToVercelOnCreate.trigger`) fires.
- It calls an HTTP POST request to your Vercel application to instantly notify your dashboard.

---

## 🚀 5. FULL DEPLOYMENT COMMANDS (GITHUB TO VERCEL)

To update your live Vercel application, you simply need to push code to GitHub. Run these exact operations in your Terminal:

1. Go to your React folder (or root project folder):
   ```bash
   cd c:\Users\rahul\OneDrive\Desktop\cloudproject\vercel-react-app
   ```
2. Add all new files and changes:
   ```bash
   git add .
   ```
3. Save (Commit) the changes:
   ```bash
   git commit -m "Update dashboard and project files"
   ```
4. Push to GitHub (Vercel will intercept this and deploy!):
   ```bash
   git push origin main
   ```

---

## 📝 6. SUMMARY OF KEY CODES & WHERE TO EDIT

- **Change FrontEnd Look & Feel:** Edit `/vercel-react-app/pages/index.js`
- **Modify PostgreSQL DB Connection:** Edit `/vercel-react-app/pages/api/tasks.js`
- **Modify Salesforce API Connection:** Edit `/vercel-react-app/pages/api/salesforce.js`
- **Read the Master Project Report:** Read `/PROJECT_REPORT.md`