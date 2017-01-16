import json
from stopwords import stopwords
import numpy as np
from gensim import corpora, models
from nltk.tokenize import RegexpTokenizer
from nltk.stem.porter import PorterStemmer
from sklearn.manifold import MDS


json_location = "patents.json"
tokenizer = RegexpTokenizer(r'\w+')
porter_stemmer = PorterStemmer()

with open(json_location) as json_data:
    matching_abstracts = json.load(json_data)

num_docs = len(matching_abstracts)
training_set_size = (num_docs // 3) * 2
preprocessed_docs = []
patent_id = []
for key in matching_abstracts:
    abstract = matching_abstracts[key]
    # Make lower case and split into list of strings without punctuation
    abstract = tokenizer.tokenize(abstract.lower())
    # Remove nondiscriminatory words
    abstract = [word for word in abstract if word not in stopwords]
    # Reduce tokens to roots
    abstract = [porter_stemmer.stem(word) for word in abstract]
    preprocessed_docs.append(abstract)
    patent_id.append(key)

# Latent Dirichlet Allocatio
# Create dictionary of unqiue words in document set
corp_dict_train = corpora.Dictionary(preprocessed_docs[:training_set_size])
# Create list of tuples where 1st position is word ID and 2nd position is count of word in doc
b_o_w_train = [corp_dict_train.doc2bow(doc) for doc in preprocessed_docs[:training_set_size]]
# Train LDA model
lda_model = models.ldamodel.LdaModel(b_o_w_train, num_topics=3, id2word=corp_dict_train, passes=15) 

# print("Topics:")
# for topic in lda_model.print_topics(num_words=5):
#     print(topic)

# Test the trained LDA model on test documents
corp_dict_test = corpora.Dictionary(preprocessed_docs[training_set_size:])
b_o_w_test = [corp_dict_test.doc2bow(doc) for doc in preprocessed_docs[training_set_size:]]
test_patent_id = patent_id[training_set_size:]

# Create probability vector for each test document
test_probabilities = []
for bag in b_o_w_test:
    topic_vec = lda_model[bag]
    template_list = [0.0, 0.0, 0.0]
    for position in topic_vec:
        template_list[position[0]] = position[1]
    test_probabilities.append(template_list)

# Convert list of lists to np array
test_probs = np.asarray(test_probabilities)
print("Test probabilities np array\n", test_probs, '\n')

# Multidimensional scaling to generate (x,y) coords from distances
MDS()
mds = MDS(n_components=2, dissimilarity="euclidean", random_state=1)
mds_fit_coordinates = mds.fit_transform(test_probs)
print("MDS fit using mds dissimilarity\n", mds_fit_coordinates, '\n')

ret_data = []
idx = 0
for coord in mds_fit_coordinates:
    this_point = {}
    this_point['x'] = coord[0]
    this_point['y'] = coord[1]
    this_point['patent_num'] = test_patent_id[idx]
    idx += 1
    ret_data.append(this_point)

