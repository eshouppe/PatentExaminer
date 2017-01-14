from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
import os

PORT_NUMBER = 5000

try:

    print('starting server...')
    #os.chdir('dist/')
    HandlerClass = SimpleHTTPRequestHandler
    server_address = ('127.0.0.1', PORT_NUMBER)
    server = HTTPServer(server_address, HandlerClass)
    print('running server...')
    server.serve_forever()

except KeyboardInterrupt:
    print('^C received, shutting down the web server')
    server.socket.close()
