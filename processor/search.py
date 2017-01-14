import json


#class Search_and_Match(object):
# function to create all possible ordered substrings from search string
def create_search_substrings(full_string):
    full_str_as_list = full_string.split(' ')
    full_str_len = len(full_str_as_list)
    all_substr = [" ".join(full_str_as_list[i:j+1]) for i in range(full_str_len) for j in range(i, full_str_len)]
    return all_substr

def search_json(filepath, full_string):
    search_strings = create_search_substrings(full_string)
    with open(filepath) as json_data:
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


#full_search_string = "earth-boring"
#json_location = "patents.json"
#match_num, match_abstract, search_terms = search_json(json_location, full_search_string)
#print("Matching patents: {}".format(", ".join(match_num)))
