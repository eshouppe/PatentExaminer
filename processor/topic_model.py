import json
import math
from processor.stopwords import stopwords
import numpy as np
from scipy import optimize
from gensim import corpora, models
from nltk.tokenize import word_tokenize
from nltk.stem.porter import PorterStemmer
from sklearn.manifold import MDS


class LDA_Model(object):
    def __init__(self, matched_docs=None):
        self.matched_docs = matched_docs

    def train_lda_model(self):
        # Load json to dictionary
        train_json_path = 'train_data.json'
        with open(train_json_path) as train_json_reader:
            train_json = json.load(train_json_reader)

        # Further preprocess text to prep for model
        porter_stemmer = PorterStemmer()
        train_x = []

        for patent_id in train_json:
            patent_content = train_json[patent_id]
            # Split into list of strings
            patent_content = word_tokenize(patent_content)
            # Remove nondiscriminatory words
            patent_content = [word for word in patent_content if word not in stopwords]
            # Reduce tokens to roots
            patent_content = [porter_stemmer.stem(word) for word in patent_content]
            train_x.append(patent_content)
        
        # Train Latent Dirichlet Allocation model
        # Create dictionary of unqiue words in document set
        dict_train = corpora.Dictionary(train_x)
        # Create list of tuples where 1st position is word ID and 2nd position is count of word in doc
        bow_train = [dict_train.doc2bow(doc) for doc in train_x]
        # Train LDA model
        lda_model = models.ldamodel.LdaModel(bow_train, num_topics=4, id2word=dict_train, passes=10)
        # Save model to file
        lda_model.save('trained_lda_model.model')

        # print("LDA Model Topics:")
        for topic in lda_model.print_topics(num_words=3):
            print(topic)

    def test_lda_model(self):
        # Matched docs is a dict with patent nums as keys and a list of matched searches as values
        test_json_path = 'processor/test_data.json'
        with open(test_json_path) as test_json_reader:
            test_json = json.load(test_json_reader)
        
        matched_patent_IDs = list(self.matched_docs.keys())

        # Further preprocess text to prep for model
        porter_stemmer = PorterStemmer()
        test_x = []
        test_y = []

        for patent_id in test_json:
            if patent_id in matched_patent_IDs:
                patent_content = test_json[patent_id]
                # Split into list of strings
                patent_content = word_tokenize(patent_content)
                # Remove nondiscriminatory words
                patent_content = [word for word in patent_content if word not in stopwords]
                # Reduce tokens to roots
                patent_content = [porter_stemmer.stem(word) for word in patent_content]
                test_x.append(patent_content)
                test_y.append(patent_id)
        
        # Test Latent Dirichlet Allocation model on matched documents
        # Load model from file
        lda_model = models.LdaModel.load('processor/trained_lda_model.model')

        # Test the trained LDA model on test documents
        dict_test = corpora.Dictionary(test_x)
        bow_test = [dict_test.doc2bow(doc) for doc in test_x]

        # Create probability vector for each test document
        test_probs = []
        for bag in bow_test:
            topic_vec = lda_model[bag]
            template_list = [0.0, 0.0, 0.0, 0.0]
            for position in topic_vec:
                template_list[position[0]] = position[1]
            test_probs.append(template_list)
        
        return np.asarray(test_probs), test_y
    
    def venn_circles(self, series_coords):
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

    def multidim_scaling(self):
        test_probs, test_y = self.test_lda_model()

        # Multidimensional scaling to generate (x,y) coords from distances
        MDS()
        mds = MDS(n_components=2, dissimilarity="euclidean", random_state=1)
        mds_fit_coordinates = mds.fit_transform(test_probs)

        # Update search IDs to series values for plot
        matched_searches = list(self.matched_docs.values())
        series = []
        for match in matched_searches:
            if match == [1]:
                series.append(1)
            elif match == [2]:
                series.append(2)
            elif match == [1,2] or match == [2,1]:
                series.append(3)
            else:
                print("What's up with this search ID? --> ", match)
                series.append(55) # If error append weird series num to keep order

        # Create return array
        plot_data = []
        for idx, coord in enumerate(mds_fit_coordinates):
            this_point = {}
            this_point['x'] = coord[0]
            this_point['y'] = coord[1]
            this_point['patent_ID'] = test_y[idx]
            this_point['series'] = series[idx]
            this_point['full_search'] = matched_searches[idx]
            plot_data.append(this_point)
        
        # Prepare data structure to calculate circle center and radius
        series1_points = np.empty((1,2),dtype=float)
        series2_points = np.empty((1,2),dtype=float)

        for obj in plot_data:
            if 1 in obj['full_search']:
                series1_points = np.append(series1_points, [[obj['x'], obj['y']]], axis=0)
            if 2 in obj['full_search']:
                series2_points = np.append(series2_points, [[obj['x'], obj['y']]], axis=0)    
        
        series1_points = series1_points[1:,:]
        series1_center_x, series1_center_y, series1_radius = self.venn_circles(series1_points)
        circle1 = {'x': series1_center_x, 'y': series1_center_y, 'r': series1_radius}

        if len(series2_points) > 1:
            series2_points = series2_points[1:,:]
            series2_center_x, series2_center_y, series2_radius = self.venn_circles(series2_points)
            circle2 = {'x': series2_center_x, 'y': series2_center_y, 'r': series2_radius}
        else:
            circle2 = {'No search 2': True}

        return plot_data, circle1, circle2
