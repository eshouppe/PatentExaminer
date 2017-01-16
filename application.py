#!flask/bin/python
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS, cross_origin
from processor.search import Search_and_Match


application = Flask(__name__)
#TODO: remove cors before deployment...use for development of UI
CORS(application)

@application.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return application.send_static_file(path)

@application.route('/venn/api/v1.0/search', methods=['POST'])
def get_tasks():
    #TODO: Add calls to process incoming request ect
    #TODO: Add call capable of return the json below

    #Check to ensure we have a json search object passed to us
    #And we have a search param
    #if not Abort search with a 400 code
    if not request.json or ('search1' not in request.json and 'search2' not in request.json):
        abort(400)
    
    # Instantiate search class and pass json location as param
    processor = Search_and_Match(json_filepath="test_data.json")
    # Call class method to perform search. If only 1 search, search2 is empty string.
    if len(request.json['search2']) > 0:
        search_list = [request.json['search1'], request.json['search2']]
    else:
        search_list = [request.json['search1']]
    match_num, searched_terms = processor.prepare_vars(raw_search_list=search_list)

    #Create Response Obj
    task = {
        'numMatchedPatents': len(match_num),
        'searchedString(s)': search_list,
        'matchingPatentNums': list(match_num.keys()),
        'searchedTerms': searched_terms
    }
    #Return Response to request from client(JS)
    return jsonify(task)

#Kick off the server
if __name__ == '__main__':
    application.run(debug=True)
