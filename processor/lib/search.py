import requests
import string
from data.stopwords import general_stopwords


class Search_and_Process(object):
    def condition_text(text_string):
        """Make search terms lower case, remove punctuation, and strip stopwords"""
        print("Inside function: {}".format(text_string))
        text_string = text_string.lower()

        text_list = text_string.split(" ")
        text_list = [word for word in text_list if word not in general_stopwords]
        text_string = " ".join(text_list)

        translator = str.maketrans("", "", string.punctuation)
        text_string = text_string.translate(translator)
              
        return text_string


    def make_post_request(self, payload):
        resp = requests.post(
            "http://www.patentsview.org/api/patents/query",
            data=payload
            )
        
        resp.raise_for_status()

        try:
            return resp.json()
        except ValueError:
            print("HTTP error")
            return "HTTP error"


    def process_post_result(self, resp_json):
        # Make arrays of each result component
        abstracts_from_response = []
        titles_from_response = []
        patent_nums_from_response = []

        for obj in resp_json['patents']:
            abstracts_from_response.append(obj["patent_abstract"])
            titles_from_response.append(obj["patent_titles"])
            patent_nums_from_response.append(obj["patent_nums"])
        
        return patent_nums_from_response, titles_from_response, abstracts_from_response
