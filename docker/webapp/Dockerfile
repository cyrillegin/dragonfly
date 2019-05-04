FROM ubuntu:16.04

# Ubuntu
RUN apt-get update
RUN apt-get install -y libpulse0 curl sudo apt-transport-https git vim python


# Mongo 
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
RUN apt-get update
RUN apt-get install -y mongodb-org-shell mongodb-org-tools

# Node
RUN curl -o /tmp/nodejs.deb https://deb.nodesource.com/node_10.x/pool/main/n/nodejs/nodejs_10.15.0-1nodesource1_amd64.deb && dpkg -i /tmp/nodejs.deb

# User
RUN useradd dragon
RUN mkdir /home/dragon
RUN chown dragon:dragon /home/dragon
USER root

# Entry
ENTRYPOINT ["sh","/home/dragon/dragonfly/docker/webapp/entrypoint.sh"]
USER dragon
