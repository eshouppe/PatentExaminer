import json


class Search_and_Match(object):
    def __init__(self, json_filepath):
        self.json_filepath = json_filepath
        self.match_patent_nums = {}

    def create_search_substrings(self, raw_search_string):
        """Method to create all possible ordered substrings from search string"""
        full_str_as_list = raw_search_string.split(' ')
        full_str_len = len(full_str_as_list)
        all_substr = [" ".join(full_str_as_list[i:j+1]) for i in range(full_str_len) for j in range(i, full_str_len)]
        return all_substr

    def search_json(self, search_term_list, search_num):
        """Perform search on all values in JSON. Exit search if any term found in value."""
        for key in self.full_corpus:
            for term in search_term_list:
                if term in self.full_corpus[key]:
                    val = self.match_patent_nums.get(key, None) # Check if patent already matched
                    if val is None: # If not already matched, add patent num & search number
                        self.match_patent_nums[key] = [search_num]
                    else: # If already matched, append search number
                        self.match_patent_nums[key].append(search_num)
                    break

    def prepare_vars(self, raw_search_list):
        """Group method that calls search term creation method and search json method"""
        search_string_one = self.create_search_substrings(raw_search_list[0])
        search_terms = list(search_string_one)

        try:
            search_string_two = self.create_search_substrings(raw_search_list[1])
            search_terms.extend(search_string_two)
        except IndexError:
            pass

        with open(self.json_filepath) as json_data:
            self.full_corpus = json.load(json_data)
            self.search_json(search_string_one, search_num=1)
            try:
                self.search_json(search_string_two, search_num=2)
            except NameError:
                pass

        return self.match_patent_nums, search_terms


# search1 = "earth mining data"
# search2 = "drill bits"
# json_location = "patents.json"
# inst = Search_and_Match(json_location)
# match_num, search_terms = inst.prepare_vars([search1])
# print("Matching patents: ", match_num)
# print("Search terms: ", search_terms)
