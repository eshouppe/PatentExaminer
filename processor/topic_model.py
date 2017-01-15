import json
from stopwords import stopwords
from gensim import corpora, models
from nltk.tokenize import RegexpTokenizer
from nltk.stem.porter import PorterStemmer


json_location = "patents.json"
tokenizer = RegexpTokenizer(r'\w+')
porter_stemmer = PorterStemmer()

with open(json_location) as json_data:
    matching_abstracts = json.load(json_data)

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


corp_dict = corpora.Dictionary(preprocessed_docs)
b_o_w = [corp_dict.doc2bow(doc) for doc in preprocessed_docs]

lda_model = models.ldamodel.LdaModel(b_o_w, num_topics=5, id2word=corp_dict, passes=30) 

print("Topics:")
for topic in lda_model.print_topics(num_topics=5, num_words=5):
    print(topic)

for bag in b_o_w:
    print(lda_model[bag])
