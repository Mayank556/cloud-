from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        data = {
            "message": "Hello from the Python Serverless Backend component!",
            "timestamp": datetime.now().isoformat()
        }
        self.wfile.write(json.dumps(data).encode('utf-8'))
        return
