import json


class Search_and_Match(object):
    def __init__(self, raw_search_string, json_filepath):
        self.raw_search_string = raw_search_string
        self.json_filepath = json_filepath

    def create_search_substrings(self):
        """function to create all possible ordered substrings from search string"""
        full_str_as_list = self.raw_search_string.split(' ')
        full_str_len = len(full_str_as_list)
        all_substr = [" ".join(full_str_as_list[i:j+1]) for i in range(full_str_len) for j in range(i, full_str_len)]
        return all_substr

    def search_json(self):
        """Call function to craft search terms. Perform search on all values in JSON.
        Exit search if any term found in value."""
        search_strings = self.create_search_substrings()
        with open(self.json_filepath) as json_data:
            full_corpus = json.load(json_data)
            matching_patent_nums = []
            matching_patent_abstracts = []

            for key in full_corpus:
                for this_str in search_strings:
                    if this_str in full_corpus[key]:
                        matching_patent_nums.append(key)
                        matching_patent_abstracts.append(full_corpus[key])
                        break
            
            return matching_patent_nums, matching_patent_abstracts, search_strings


# full_search_string = "earth mining data"
# json_location = "patents.json"
# inst = Search_and_Match(full_search_string, json_location)
# match_num, match_abstract, search_terms = inst.search_json()
# print("Matching patents: {}".format(", ".join(match_num)))
# print("Search terms: {}".format(", ".join(search_terms)))
