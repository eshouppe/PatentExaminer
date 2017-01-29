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

# Add git clone funcitonality
# Make ssh dir
RUN mkdir /root/.ssh/

# Copy over private key, and set permissions
ADD id_rsa_vennDemoBitbucket /root/.ssh/id_rsa_vennDemoBitbucket
RUN chmod 700 /root/.ssh/id_rsa_vennDemoBitbucket
RUN chown -R root:root /root/.ssh

# Create known_hosts
RUN touch /root/.ssh/known_hosts

# Remove host checking
RUN echo "Host bitbucket.org\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

# Clone the conf files into the docker container
RUN git clone git@bitbucket.org:ineedthekeyboard/venndemo.git /venndemo

#don't copy files directly
#ADD . /venndemo
 
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