FROM debian:stretch

# System
RUN apt-get update
RUN apt-get install -y screen vim sudo wget screen git curl python make automake gcc
RUN apt-get install apt-transport-https

# Postgres
RUN apt-get install -y postgresql

# Node
RUN curl -o /tmp/nodejs.deb https://deb.nodesource.com/node_10.x/pool/main/n/nodejs/nodejs_10.4.1-1nodesource1_amd64.deb && dpkg -i /tmp/nodejs.deb

# Python
RUN apt-get install -y python3-pip
RUN pip3 install --upgrade pip
ADD requirements.txt .
RUN pip3 install -r requirements.txt

VOLUME ["/home/dragon"]
WORKDIR /home/dragon
ENTRYPOINT ["sh","/home/dragon/dragon/docker/app/entrypoint.sh"]

EXPOSE 5000
