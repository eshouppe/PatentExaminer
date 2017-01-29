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
                "per_page": 100
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
            abstracts = primary_search.process_post_result(resp_json=response_json,
                                                           search_type='primary')

            data_x = []
            for abstract in abstracts: # abstracts is a list of strings
                # Remove stopwords/punctuation and make lower case
                conditioned_abstract = primary_search.condition_text(abstract) # Returns string
                data_x.append(conditioned_abstract)
            
            # Instantiate model class and get most common words
            primary_model = Model_Text()
            most_common_words = primary_model.calculate_tf(data_x) # Returns list
            return_obj = {
                'primary_search': search_term_dict['primary'],
                'common_words' : most_common_words
            }
            return return_obj
        
        else:
            return_obj = {
                'message': 'Patent search error. Please try again.',
                'error' : '500 internal error'
            }
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

        all_patent_nums = [] # List of strings
        all_patent_titles = [] # List of strings
        all_patent_abstracts = [] # List of strings
        all_search_sources = [] # List of lists. Track which search yielded this patent

        series_id = {"primary": 0, "s1": 1, "s2": 2, "s3": 3} # Convert search name  series number

        for key in search_term_dict:
            search_term = search_term_dict[key]
            if len(search_term) > 0: # Unused series has an empty string
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
                    nums, titles, abstracts = secondary_search.process_post_result(resp_json=response_json,
                                                                                   search_type='secondary')
                    # Update cumulative list of search results
                    for idx, num in enumerate(nums):
                        if num not in all_patent_nums:
                            all_patent_nums.append(num)
                            all_patent_titles.append(titles[idx])
                            all_patent_abstracts.append(abstracts[idx])
                            all_search_sources.append([series_id[key]])
                        else:
                            # If already exists, add search source to sublist
                            patent_idx = all_patent_nums.index(num)
                            all_search_sources[patent_idx].append(series_id[key])

        # Instantiate model class
        secondary_model = Model_Text()
        cartesian_coords = secondary_model.mds_similarity_to_coords(all_patent_abstracts)
        all_series_point_info = secondary_model.split_into_groups(cartesian_coords,
                                                                  all_search_sources,
                                                                  all_patent_nums,
                                                                  all_patent_titles)
        all_points_array = []
        all_circles_array = []
        
        for series, points in enumerate(all_series_point_info):
            if len(points) > 0:
                points_array, circles_obj = secondary_model.create_plot_arrays(series, points)
                all_points_array.extend(points_array)
                all_circles_array.append(circles_obj)
        
        return all_points_array, all_circles_array, len(all_patent_nums)
