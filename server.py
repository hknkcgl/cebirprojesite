#!/usr/bin/env python3
"""
Simple HTTP server for testing the 3D logo with scroll-based random rotation.
Serves the site on http://localhost:8000
"""

import http.server
import socketserver
from pathlib import Path
import os

# Change to the directory of the script
os.chdir(os.path.dirname(__file__))

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
except Exception as e:
    print(f"Error starting server: {e}")
    print("Make sure the port is not already in use.")