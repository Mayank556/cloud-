# Enterprise Multi-Cloud Distributed Architecture Project

## 1. Project Overview
This project demonstrates the design, development, and deployment of a highly scalable, multi-cloud enterprise architecture. By integrating various cloud models—Platform-as-a-Service (PaaS), Infrastructure-as-a-Service (IaaS), and Software-as-a-Service (SaaS)—the system creates a unified data flow between a custom user interface, a cloud-hosted relational database, and an industry-standard CRM.

**Key Technologies Used:**
* **Frontend:** React.js / Next.js
* **Backend:** Node.js (Serverless API) & Python (FastAPI/App Engine scripts)
* **Cloud Hosting:** Vercel Global Edge Network
* **Database:** Serverless PostgreSQL (Neon Integration)
* **SaaS Integration:** Salesforce Developer Edition (Apex Classes, SOQL, Triggers)
* **Private Cloud / IaaS:** OpenStack (DevStack) & Vagrant Infrastructure
* **Version Control:** Git & GitHub for CI/CD

---

## 2. System Architecture

1. **The Core UI (Vercel React App):** A React-based web dashboard that aggregates data from different clouds in real-time.
2. **The Database (Neon PostgreSQL):** A cloud database holding the "Task" entities, directly queried by Vercel Serverless Functions.
3. **The CRM (Salesforce):** Used to manage enterprise Contacts. The React backend securely authenticates via OAuth/Security Tokens to query and display these records.
4. **The Private Datacenter (OpenStack):** Vagrant and Bash orchestration scripts designed to deploy a localized OpenStack hypervisor running `ownCloud` via Docker.

*[INSERT SCREENSHOT HERE: A diagram of the architecture or the final React Dashboard screen]*

---

## 3. Step-by-Step Implementation

### Step 1: Initial Infrastructure Planning & IaaS Scripts
* Generated backend APIs for Python (targeted at Google App Engine) and Java Spring Boot (targeted at Amazon EC2 / Azure VMs).
* Created orchestration files (Terraform `main.tf` and Bash scripts) to automate the deployment of compute instances.
* Wrote orchestration scripts (`Vagrantfile`, `install-openstack.sh`) to establish a localized Private Cloud environment using DevStack.

### Step 2: The Pivot to PaaS (Vercel) & CI/CD Setup
* Shifted from manual IaaS deployment to a modern PaaS approach using Vercel.
* Generated a full Next.js React frontend framework.
* Initialized a Git repository and connected local code to remote GitHub repository (`Rahulchaube1/vercel-react-app`).
* Linked GitHub repository to Vercel for automated Continuous Integration and Continuous Deployment (CI/CD).

*[INSERT SCREENSHOT HERE: The GitHub Repository showing the pushed code]*

### Step 3: Database Provisioning (PostgreSQL)
* Enabled Vercel Storage and provisioned a Serverless Postgres Database (Neon).
* Executed SQL queries to structure the `tasks` schema and seed mock data.
* Bridged the React frontend to the Database through a custom Node.js `/api/tasks` endpoint.

*[INSERT SCREENSHOT HERE: Vercel Storage/Neon Query Dashboard showing the SQL tables]*

### Step 4: Enterprise SaaS Integration (Salesforce)
* Integrated the `jsforce` NPM package to connect to Salesforce REST APIs.
* Stored secure Salesforce credentials (Username, Password, Security Token) as encrypted Environment Variables.
* Built the `/api/salesforce` endpoint to execute an SOQL query pulling the newest Contacts into the unified dashboard.
* Engineered an Apex Trigger (`PushToVercelOnCreate.trigger`) to allow Salesforce to push data back to Vercel upon record creation.

*[INSERT SCREENSHOT HERE: The Salesforce Developer Console showing the Apex Class / Trigger]*

---

## 4. Challenges & Technical Difficulties Overcome

During the development lifecycle, several major enterprise-level roadblocks were encountered and successfully resolved:

### Difficulty 1: Automated Login MFA Blocking (Azure CLI)
* **Problem:** When attempting to auto-deploy the Java Spring Boot app using the Azure CLI (`az login`), the organization's Azure Active Directory policies blocked the terminal due to strict Multi-Factor Authentication (MFA) enforcement (`invalid_grant AADSTS50076`).
* **Resolution:** Abandoned the terminal-based CLI approach and utilized manual zip-deploy mechanisms, ultimately pivoting to Vercel's automated Git-based deployment pipeline, fundamentally bypassing local MFA terminal restrictions.

### Difficulty 2: Git Large File Storage (LFS) Restrictions
* **Problem:** During the push to GitHub, the deployment was abruptly rejected because the Node module `@next/swc-win32-x64-msvc` exceeded GitHub’s 100MB strict file size limit (measuring at ~129MB). The `.gitignore` file had not properly excluded the `node_modules` directory in the initial rapid-prototyping phase.
* **Resolution:** The cached Git history had to be purged. We utilized PowerShell to completely delete the hidden `.git` directory, initialized a pristine repository, explicitly mapped `node_modules/` into a new `.gitignore` file, and executed a forced push (`git push -f`) to cleanly overwrite the bloated remote branch.

### Difficulty 3: PostgreSQL Prepared Statement Errors
* **Problem:** Billed as a security measure against SQL injection, the Vercel Neon Query Editor rejected chained procedural SQL execution (`cannot insert multiple commands into a prepared statement`) when attempting to create a table and insert mock data simultaneously.
* **Resolution:** Split the database seeding operation into distinct, atomic REST operations. The `CREATE TABLE` schema definition was executed first, verified for success, and followed sequentially by the `INSERT INTO` data mappings.

---

## 5. Conclusion
This project successfully achieved a fully operational, highly resilient multi-cloud architecture. By combining Vercel’s serverless edge computing, a cloud-native PostgreSQL database, and live bidirectional communication with Salesforce, the resulting Enterprise Cloud Dashboard reflects real-time, synchronized data without any need to manage physical localized hardware.

*[INSERT SCREENSHOT HERE: The final working Vercel website showing the two columns with Tasks and Contacts successfully loaded]*