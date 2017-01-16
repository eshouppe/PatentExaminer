#!flask/bin/python
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS, cross_origin
from processor.search import Search_and_Match
from processor.topic_model import LDA_Model


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
    processor = Search_and_Match(json_filepath="processor/test_data.json")
    # Call class method to perform search. If only 1 search, search2 is empty string.
    if len(request.json['search2']) > 0:
        search_list = [request.json['search1'], request.json['search2']]
    else:
        search_list = [request.json['search1']]
    search_results, searched_terms = processor.prepare_vars(raw_search_list=search_list)
    # Instantiate model class and pass search results, which is an object whose
    #  keys are the matched patent numbers and values are a list of searches made match
    model = LDA_Model(matched_docs=search_results)
    # Model results is an array of objects.  Keys are x, y, patent_id, and series
    model_results, search1_circle, search2_circle = model.multidim_scaling()

    #Create Response Obj
    task = {
        'numMatchedPatents': len(search_results),
        'searchedString(s)': search_list,
        'matchingPatentNums': list(search_results.keys()),
        'searchedTerms': searched_terms,
        'resultsToPlot': model_results,
        'search1Circle': search1_circle,
        'search2Circle': search2_circle
    }
    #Return Response to request from client(JS)
    return jsonify(task)

#Kick off the server
if __name__ == '__main__':
    application.run(debug=True)
