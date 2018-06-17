FROM debian:stretch

# System
RUN apt-get update
RUN apt-get install -y screen vim sudo wget screen git curl python make automake gcc
RUN apt-get install apt-transport-https
#gcc-c++ postgresql-devel

# Postgres
RUN apt-get install -y postgresql

# Node
RUN curl -o /tmp/nodejs.deb https://deb.nodesource.com/node_8.x/pool/main/n/nodejs/nodejs_8.10.0-1nodesource1_amd64.deb && dpkg -i /tmp/nodejs.deb

# Python
#RUN apt-get install -y epel-release python-devel python-setuptools
RUN apt-get install -y python-pip
RUN pip install --upgrade pip
ADD requirements.txt .
RUN pip install -r requirements.txt

VOLUME ["/home/dragon"]
WORKDIR /home/dragon
ENTRYPOINT ["sh","/home/dragon/dragon/docker/app/entrypoint.sh"]

EXPOSE 5000
