#!/bin/bash
# For a strange reason, numpy need to be installed before starting the container
echo "====>"
echo "====> Manually installing numpy and/or scipy"
echo "====>"
/opt/python/run/venv/bin/pip install -q --log /tmp/scipy.log --use-mirrors scipy==0.16.1
/opt/python/run/venv/bin/pip install -q --log /tmp/numpy.log --use-mirrors numpy==1.10.2
/opt/python/run/venv/bin/pip install -q --log /tmp/sklearn.log --use-mirrors scikit-learn==0.17
/opt/python/run/venv/bin/pip install -q --log /tmp/nltk.log --use-mirrors nltk==3.2.2
/opt/python/run/venv/bin/pip install -q --log /tmp/gensim.log --use-mirrors gensim==0.12.4
/opt/python/run/venv/bin/pip freeze