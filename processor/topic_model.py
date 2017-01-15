import json
from stopwords import stopwords
import numpy as np
from gensim import corpora, models
from nltk.tokenize import RegexpTokenizer
from nltk.stem.porter import PorterStemmer
import scipy.spatial.distance as distance


json_location = "patents.json"
tokenizer = RegexpTokenizer(r'\w+')
porter_stemmer = PorterStemmer()

with open(json_location) as json_data:
    matching_abstracts = json.load(json_data)

num_docs = len(matching_abstracts)
training_set_size = (num_docs // 3) * 2
preprocessed_docs = []
for key in matching_abstracts:
    abstract = matching_abstracts[key]
    # Make lower case and split into list of strings without punctuation
    abstract = tokenizer.tokenize(abstract.lower())
    # Remove nondiscriminatory words
    abstract = [word for word in abstract if word not in stopwords]
    # Reduce tokens to roots
    abstract = [porter_stemmer.stem(word) for word in abstract]
    preprocessed_docs.append(abstract)


corp_dict_train = corpora.Dictionary(preprocessed_docs[:training_set_size])
b_o_w_train = [corp_dict_train.doc2bow(doc) for doc in preprocessed_docs[:training_set_size]]

lda_model = models.ldamodel.LdaModel(b_o_w_train, num_topics=3, id2word=corp_dict_train, passes=15) 

# print("Topics:")
# for topic in lda_model.print_topics(num_words=5):
#     print(topic)

corp_dict_test = corpora.Dictionary(preprocessed_docs[training_set_size:])
b_o_w_test = [corp_dict_test.doc2bow(doc) for doc in preprocessed_docs[training_set_size:]]

test_probabilities = []
for bag in b_o_w_test:
    topic_vec = lda_model[bag]
    template_list = [0,0,0]
    for position in topic_vec:
        template_list[position[0]] = position[1]
    test_probabilities.append(template_list)

test_probs = np.asarray(test_probabilities)
print(test_probs)

distance_matrix = distance.squareform(distance.pdist(test_probs, metric='euclidean'))
print(distance_matrix)