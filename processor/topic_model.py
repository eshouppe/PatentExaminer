import json
from processor.stopwords import stopwords
import numpy as np
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

    def multidim_scaling(self):
        test_probs, test_y = self.test_lda_model()

        # Multidimensional scaling to generate (x,y) coords from distances
        MDS()
        mds = MDS(n_components=2, dissimilarity="euclidean", random_state=1)
        mds_fit_coordinates = mds.fit_transform(test_probs)

        # Update search IDs to series values for plot
        matched_searches = list(self.matched_docs.values())
        for idx, match in enumerate(matched_searches):
            if match == [1]:
                matched_searches[idx] = 1
            elif match == [2]:
                matched_searches[idx] = 2
            elif match == [1,2] or match == [2,1]:
                matched_searches[idx] = 3
            else:
                print("What's up with the search ID? --> ", match)

        # Create return array
        plot_data = []
        for idx, coord in enumerate(mds_fit_coordinates):
            this_point = {}
            this_point['x'] = coord[0]
            this_point['y'] = coord[1]
            this_point['patent_ID'] = test_y[idx]
            this_point['series'] = matched_searches[idx]
            plot_data.append(this_point)
        
        return plot_data
