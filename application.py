#!flask/bin/python
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS, cross_origin
from processor.main import Processor_Job


application = Flask(__name__)
#TODO: remove cors before deployment...use for development of UI
CORS(application)

@application.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return application.send_static_file(path)

@application.route('/venn/api/v1.0/search/primary', methods=['POST'])
def do_primary_search():
    if not request.json or ('primary' not in request.json):
        abort(500)
    new_primary_search = Processor_Job()
    returnObj = new_primary_search.initiate_primary_search(request.json)

    return jsonify(returnObj)

@application.route('/venn/api/v1.0/search/secondary', methods=['POST'])
def do_secondary_search():
    if not request.json or ('primary' not in request.json):
        abort(500)
    returnObj = {}
    #TODO: Do search logic here

    return jsonify(returnObj)


#Kick off the server
if __name__ == '__main__':
    application.run(debug=True)
