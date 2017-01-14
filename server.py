#!flask/bin/python
from flask import Flask, request, jsonify, current_app

app = Flask(__name__, static_url_path='/public')

#Fake data for now
fresults = [
    {
        'docid': 1,
        'title': u'Buy groceries in Whole Foods',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'docid': 2,
        'title': u'Learn Python Apis today',
        'description': u'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/venn/api/v1.0/search', methods=['POST'])
def get_tasks():
    #TODO: Add calls to process incoming request ect
    #TODO: Add call capable of return the json below

    #Check to ensure we have a json search object passed to us
    #And we have a search param
    #if not Abort search with a 400 code
    if not request.json or not 'search' in request.json:
        abort(400)

    #Create Response Obj
    task = {
        'id': '1230i4',
        'numOfResults': 2,
        'searchedString': request.json['search'],
        'results': fresults,
        'done': False
    }
    #Return Response to request from client(JS)
    return jsonify({'task': task})

#Kick off the server
if __name__ == '__main__':
    app.run(debug=True)
