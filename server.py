#!/usr/bin/env python3
"""
Simple HTTP server with CORS support for serving face-api.js models
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        # Custom logging to show cleaner messages
        sys.stderr.write("%s - %s\n" % (self.address_string(), format % args))

def run(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print("=" * 60)
    print("  Focus Monitor - CORS-enabled Server")
    print("=" * 60)
    print(f"\n✅ Server running on http://localhost:{port}/")
    print(f"📦 Models available at http://localhost:{port}/models/")
    print("\n✨ CORS enabled - works with all websites!")
    print("\nPress Ctrl+C to stop the server\n")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped")
        sys.exit(0)

if __name__ == '__main__':
    run()
