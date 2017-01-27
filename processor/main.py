from copy import deepcopy
from processor.lib.search import Search_and_Process
from processor.lib.model import Model_Text


class Processor_Job(object):

    def __init__(self):
        # TODO Allow user to conduct full phrase search
        self.post_request_template = {
            "q": {
                "_text_any":{
                    "patent_abstract": 1
                }
            },
            "f": 1,
            "s": [{"patent_date":"desc"}],
            "o": {
                "per_page":20
            }
        }
    

    def initiate_primary_search(self, search_term_dict):
        primary_search = Search_and_Process()

        search_term = search_term_dict['primary']
        # Remove stopwords/punctuation and make lower case
        search_term = primary_search.condition_text(text_string=search_term)

        # Format payload for request
        post_request_json = deepcopy(self.post_request_template)
        post_request_json["q"]["_text_any"]["patent_abstract"] = search_term
        post_request_json["f"] = ["patent_abstract"]
        
        response_json = primary_search.make_post_request(payload=post_request_json)
        if response_json != "HTTP error":
            abstracts = primary_search.process_post_result(resp_json=response_json)

            data_x = []
            for abstract in abstracts: # abstracts is a list of strings
                # Remove stopwords/punctuation and make lower case
                conditioned_abstract = primary_search.condition_text(abstract) # Returns string
                data_x.append(conditioned_abstract)
            
            # Instantiate model class and get most common words
            primary_model = Model_Text()
            most_common_words = primary_model.calculate_tf(data_x) # Returns list
            return {search_term_dict['primary']: most_common_words}
        
        else:
            return {search_term_dict['primary']: ['HTTP_error']}


    def initiate_secondary_search(self, search_term_dict):
        """
        Get request to process primary term plus 3- keyword terms.
        Call api and return abstracts for each search term.
        Calculate tf-idf on each abstract return.
        Derive x,y coordinates from distances.
        Calculate venn circle center and radius for each group of abstracts.
        """
        secondary_search = Search_and_Process()

        cumulative_patent_nums = [] # List of strings
        cumulative_patent_titles = [] # List of strings
        cumulative_patent_abstracts = [] # List of strings
        cumulative_search_source = [] # List of lists. Track which search yielded this patent

        for key in search_term_dict:
            search_term = search_term_dict[key]
            # Remove stopwords/punctuation and make lower case
            search_term = secondary_search.condition_text(text_string=search_term)
            # Format payload for request
            post_request_json = deepcopy(self.post_request_template)
            post_request_json["q"]["_text_any"]["patent_abstract"] = search_term
            post_request_json["f"] = ["patent_number","patent_title","patent_abstract"]
            # Make HTTP request
            response_json = secondary_search.make_post_request(payload=post_request_json)

            if response_json != "HTTP error":
                # Process from dictionary to lists of strings
                nums, titles, abstracts = secondary_search.process_post_result(resp_json=response_json)
                # Update cumulative list of search results
                for idx, num in enumerate(nums):
                    if num not in cumulative_patent_nums:
                        cumulative_patent_nums.append(num)
                        cumulative_patent_titles.append(titles[idx])
                        cumulative_patent_abstracts.append(abstracts[idx])
                        cumulative_search_source.append([key])
                    else:
                        # If already exists, add search source to sublist
                        patent_idx = cumulative_patent_nums.index(num)
                        cumulative_search_source[patent_idx].append(key)
            
            else: # If HTTP error, return early
                return "NOT SURE WHAT MY FINAL DATA STRUCTURE WILL BE YET"
                
        # Instantiate model class
        secondary_model = Model_Text()
        cartesian_coords = secondary_model.mds_similarity_to_coords(cumulative_patent_abstracts)
        x_center, y_center, radius = secondary_model.calculate_centroid_and_radius(cartesian_coords)
