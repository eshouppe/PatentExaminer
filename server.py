#!flask/bin/python
from flask import Flask, jsonify, current_app

app = Flask(__name__, static_url_path='/public')

#Fake data for now
tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/venn/api/v1.0/search', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

#Kick off the server
if __name__ == '__main__':
    app.run(debug=True)
