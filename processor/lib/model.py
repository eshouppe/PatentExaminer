import string
import numpy as np
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
        

    def calculate_dissimilarity(self, abstract_list):
        """Function argument is a list of strings, where each string is an abstract.
        Create tfidf matrix and then calculate pairwise cosine distance."""
        # TODO Add stemming
        tfidf = TfidfVectorizer(stop_words=general_stopwords)
        tfidf_sparse_matrix = tfidf.fit_transform(abstract_list)
        cos_dist_matrix = cosine_distances(tfidf_sparse_matrix)
        return cos_dist_matrix


    def mds_similarity_to_coords(self, abstract_list):
        distance_matrix = self.calculate_dissimilarity(abstract_list)
        # Multidimensional scaling to generate (x,y) coords from distances
        mds = MDS(n_components=2, dissimilarity="precomputed", random_state=42)
        mds_fit_coordinates = mds.fit_transform(distance_matrix) # n_samples by n_samples
        return mds_fit_coordinates


    def split_into_groups(self, coords, search_ids, patent_nums, patent_titles):
        p_points = []
        s1_points = []
        s2_points = []
        s3_points = []
        all_points = []

        if (len(coords) == len(search_ids) == len(patent_nums) == len(patent_titles)):
            for pt, ids, num, title in zip(coords, search_ids, patent_nums, patent_titles):
                a_point = [pt, num, title]
                if 0 in ids:         
                    p_points.append(a_point)
                if 1 in ids:
                    s1_points.append(a_point)
                if 2 in ids:
                    s2_points.append(a_point)
                if 3 in ids:
                    s3_points.append(a_point)
            
        all_points.append(p_points)
        all_points.append(s1_points)
        all_points.append(s2_points)
        all_points.append(s3_points)

        return all_points


    def calculate_centroid_and_radius(self, series_coords):
        x = series_coords[:,0]
        y = series_coords[:,1]

        # coordinates of the barycenter
        x_m = np.mean(x)
        y_m = np.mean(y)

        # calculation of the reduced coordinates
        u = x - x_m
        v = y - y_m

        # linear system defining the center in reduced coordinates (uc, vc):
        #  Suu * uc + Suv * vc = (Suuu + Suvv)/2
        #  Suv * uc + Svv * vc = (Suuv + Svvv)/2
        Suv = np.sum(u*v)
        Suu = np.sum(u**2)
        Svv = np.sum(v**2)
        Suuv = np.sum(u**2 * v)
        Suvv = np.sum(u * v**2)
        Suuu = np.sum(u**3)
        Svvv = np.sum(v**3)

        # Solving the linear system
        A = np.array([[Suu, Suv], [Suv, Svv]])
        B = np.array([Suuu + Suvv, Svvv + Suuv]) / 2.0
        uc, vc = np.linalg.solve(A, B)

        xc_1 = x_m + uc
        yc_1 = y_m + vc

        # Calculation of all distances from the center (xc_1, yc_1)
        Ri_1 = np.sqrt((x-xc_1)**2 + (y-yc_1)**2)
        return x_m, y_m, np.mean(Ri_1)
    

    def create_points_vars(self, search_id, points_list):
        this_series_point_info = []
        this_series_xy = []

        for point in points_list:
            single_point_obj = {
                "x": point[0][0],
                "y": point[0][1],
                "patent_number": point[1],
                "patent_title": point[2],
                "series": search_id}
            this_series_point_info.append(single_point_obj)
            this_series_xy.append([point[0][0], point[0][1]])
        
        return this_series_point_info, this_series_xy

    
    def create_plot_arrays(self, search_id, points_list):
        # The sublists in points_list have form [[x, y], num, title]
        array_point_objs, coords_array = self.create_points_vars(search_id, points_list)
        x_ctr, y_ctr, r = self.calculate_centroid_and_radius(np.asarray(coords_array))
        circle_info = {"x_center": x_ctr,
                       "y_center": y_ctr,
                       "radius": r,
                       "series": search_id}

        return array_point_objs, circle_info
