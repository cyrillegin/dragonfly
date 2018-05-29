FROM centos:7

# System
RUN yum install -y screen vim sudo wget screen git && yum clean all

# Postgres
RUN yum install -y postgresql  postgresql-devel make automake gcc gcc-c++ && yum clean all

# Node
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs-8.9.4-1nodesource

# Python
RUN yum install -y epel-release python-devel python-setuptools && yum clean all
RUN easy_install pip
ADD requirements.txt .
RUN pip install -r requirements.txt

VOLUME ["/home/dragon"]
WORKDIR /home/dragon
ENTRYPOINT ["sh","/home/dragon/dragon/docker/app/entrypoint.sh"]

EXPOSE 5000
