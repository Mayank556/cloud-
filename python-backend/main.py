from fastapi import FastAPI
import os
import psycopg2 # Assuming PostgreSQL cloud DB

app = FastAPI()

# Connect to cloud database (Update URL when deploying)
DB_URL = os.environ.get("DATABASE_URL", "postgresql://user:password@localhost/dbname")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Python Backend on Google App Engine"}

@app.get("/data")
def read_data():
    return {"status": "success", "data": "Processing data from cloud..."}
