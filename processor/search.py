import json


# function to create all possible ordered substrings from search string
def create_search_substrings(full_string):
    full_str_as_list = full_string.split(' ')
    full_str_len = len(full_str_as_list)
    all_substr = [" ".join(full_str_as_list[i:j+1]) for i in range(full_str_len) for j in range(i, full_str_len)]
    return all_substr

def search_json(filepath, search_strings):
    with open(other_location) as json_data:
        full_corpus = json.load(json_data)
        matching_patent_nums = []
        matching_patent_abstracts = []

        for key in full_corpus:
            for this_str in search_strings:
                if this_str in full_corpus[key]:
                    matching_patent_nums.append(key)
                    matching_patent_abstracts.append(full_corpus[key])
                    break
        
        return matching_patent_nums, matching_patent_abstracts


full_search_string = "earth mining"
search_terms = create_search_substrings(full_search_string)
print("Search terms: {}".format(", ".join(search_terms)))

json_location = "patent_abstracts.json"
other_location = "patents.json"
match_num, match_abstract = search_json(other_location, search_terms)
print("Matching patents: {}".format(", ".join(match_num)))
