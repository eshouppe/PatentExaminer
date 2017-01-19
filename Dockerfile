# Set the base image to Ubuntu
FROM ubuntu
 
# File Author / Maintainer
MAINTAINER Ryan Carlton
 
RUN apt-get update
RUN apt-get install --yes --force-yes software-properties-common

RUN add-apt-repository main
RUN add-apt-repository universe
RUN add-apt-repository restricted
RUN add-apt-repository multiverse
#Add Python3.5 repo
RUN add-apt-repository ppa:fkrull/deadsnakes
RUN apt-get update

# Install Python and Basic Python Tools ~ 2.7 ???
# RUN apt-get install -y python python-dev python-distribute python-pip
# Install Modern Python
RUN apt-get install --yes --force-yes python3-pip python3.5
RUN apt-get install --yes --force-yes tar git curl nano wget dialog net-tools build-essential

ADD . /venndemo
 
# # Get pip to download and install requirements:
RUN pip3 install -r /venndemo/requirements.txt
 
# # Expose ports
EXPOSE 80

# # Set the default directory where CMD will execute
WORKDIR /venndemo
 
# Set the default command to execute   
# when creating a new container
# i.e. using CherryPy to serve the application
CMD python3.5 server.py