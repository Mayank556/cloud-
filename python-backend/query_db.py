import psycopg2
import os

# Database connection string
DATABASE_URL = "postgresql://neondb_owner:npg_0xhPTI3goSBs@ep-little-pond-am7dkci8-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

try:
    # Connect to the database
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Query to fetch all data from tasks table
    cursor.execute("SELECT * FROM tasks;")

    # Fetch all rows
    rows = cursor.fetchall()

    # Print the data
    print("All data from tasks table:")
    for row in rows:
        print(row)

    # Close the connection
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")