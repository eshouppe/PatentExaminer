import string
from collections import Counter
from processor.data.stopwords import general_stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_distances
from sklearn.manifold import MDS


class Model_Text(object):
   
    def calculate_tf(self, abstract_list, num_words_to_return=10):
        """Get the 10 most common non-stopwords"""
        # TODO Account for abstract size
        # TODO Change primary search to use tfidf
        cnt = Counter()
        for abstract in abstract_list:
            tokenized_abstract = word_tokenize(abstract)
            cnt.update(tokenized_abstract)
        most_common_words = [pair[0] for pair in cnt.most_common(num_words_to_return)]
        return most_common_words
        
    
    def calculate_tfidf(self, data_list):
        """Function argument is a list of strings, where each string is an abstract"""
        # TODO Add stemming
        tfidf = TfidfVectorizer(stop_words=general_stopwords)
        abstract_tfidf = tfidf.fit_transform(data_list)
        return abstract_tfidf


    def calculate_dissimilarity(self, text_list):
        tfidf_sparse_matrix = self.calculate_tfidf(text_list)
        cos_dist_matrix = cosine_distances(tfidf_sparse_matrix)
        return cos_dist_matrix


    def mds_similarity_to_coords(self, abstract_list):
        distance_matrix = self.calculate_dissimilarity(abstract_list)
        # Multidimensional scaling to generate (x,y) coords from distances
        MDS()
        mds = MDS(n_components=2, dissimilarity="precomputed", random_state=42)
        mds_fit_coordinates = mds.fit_transform(distance_matrix) # n_samples by n_samples
        return mds_fit_coordinates


    def calculate_centroid_and_radius(self):
        pass
    

    def collect_label_text(self):
        pass
