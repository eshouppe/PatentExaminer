import json
import string
from sklearn.cross_validation import train_test_split
from topic_model import LDA_Model


# Create a list of stopwords from a text file of new-line delimited stop words
def create_stopwords_list():
    filepath = 'stopwords.txt'
    stopwords = []
    with open(filepath, 'r') as infile:
        stopwords = [line.rstrip('\n').replace("'", r"\'") for line in infile]


# Split full json into test and training data sets
# Perform minimal preprocessing of patent content
def split_data():
    with open('all_data.json') as json_data:
        all_data = json.load(json_data)
        all_patent_IDs = list(all_data.keys())

        x_train, x_test = train_test_split(all_patent_IDs, test_size=0.33)
        print("Training data set size: ", len(x_train))
        print("Testing data set size: ", len(x_test))

        train_data = {}
        test_data = {}

        translator = str.maketrans({key: None for key in string.punctuation})

        for doc_key in all_data:
            if doc_key in x_train:
                train_data[doc_key] = all_data[doc_key].translate(translator).lower()
            elif doc_key in x_test:
                test_data[doc_key] = all_data[doc_key].translate(translator).lower()
            else:
                print("Where did this patent come from? --> ", doc_key)

        with open('train_data.json', 'w') as train_json:
            json.dump(train_data, train_json)

        with open('test_data.json', 'w') as test_json:
            json.dump(test_data, test_json)


# Train LDA model and save to file
def train_model():
    lda_train = LDA_Model()
    lda_train.train_lda_model()

# Call helper methods
# create_stopwords_list()
# split_data()
train_model()

