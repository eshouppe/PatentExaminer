#!flask/bin/python
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS, cross_origin
from processor.search import search_json


app = Flask(__name__, static_url_path='/public')
#TODO: remove cors before deployment...use for development of UI
CORS(app)

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
    
    # Entry point to call search. Pass it the request.json['search'].
    #  It will return the response (take the place of task below)
    match_num, match_abstract, searched_terms = search_json("processor/patents.json", request.json['search'])
    print("Matching patents: {}".format(", ".join(match_num)))

    #Create Response Obj
    task = {
        'numMatchedPatents': len(match_num),
        'searchedString': request.json['search'],
        'matchingPatentNums': match_num,
        'searchedTerms': ", ".join(searched_terms)
    }
    #Return Response to request from client(JS)
    return jsonify(task)

#Kick off the server
if __name__ == '__main__':
    app.run(debug=True)
