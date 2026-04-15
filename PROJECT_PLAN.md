# Master Enterprise Cloud Project Plan

## Architecture Overview
This project involves a highly distributed, multi-cloud enterprise system.

### Phase 1: Core Application (Java & Python)
- **Java App**: Spring Boot REST API for core business logic.
- **Python App**: FastAPI microservice for data processing.
- **Database**: Cloud-hosted PostgreSQL (AWS RDS or Google Cloud SQL).

### Phase 2: Public Cloud Deployment
- **Google App Engine (GAE)**: Deploy the Python FastAPI application (`app.yaml`).
- **Amazon EC2**: Deploy the Java application using an automated startup script (`user-data.sh`) and AWS CLI.

### Phase 3: SaaS (Salesforce)
- Register for a Developer Edition Salesforce account.
- Configure a custom domain (`Setup > My Domain`).
- Write Apex Callouts (provided in `/salesforce` folder) to connect Salesforce to the Java/Python apps.

### Phase 4: Private Cloud (OpenStack & OwnCloud)
- **OpenStack**: Requires physical hardware or nested virtualization. Use `DevStack` for local testing.
- **OwnCloud**: Deployed on the OpenStack compute nodes using Docker.

---

## Prerequisites (User Action Required)
1. **AWS Account**: Set up and download access keys.
2. **Google Cloud Account**: Enable App Engine and Cloud SQL.
3. **Salesforce Account**: Sign up for a free Developer Edition (developer.salesforce.com).
4. **Database URL**: Create a free tier PostgreSQL database (e.g., Supabase, ElephantSQL, or AWS RDS Free Tier) and get the connection string.
