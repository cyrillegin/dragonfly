#!/bin/bash

echo "Setting up new dragonfly satellite..."

noApt=false
installNode=false
installPython=false

if [ "$1" == "noApt" ] || [ "$2" == "noApt" ] || [ "$3" == "noApt" ]; then
  noApt=true
fi

if [ "$1" == "node" ] || [ "$2" == "node" ] || [ "$3" == "node" ]; then
  installNode=true
fi

if  [ "$1" == "python" ] || [ "$2" == "python" ] || [ "$3" == "python" ]; then
  installPython=true
fi

# Install Apt updates
if [ "$noApt" == false ]; then
  echo "updating apt"
  sudo apt update
  sudo apt full-upgrade -y
  sudo apt-get update
  sudo apt-get dist-upgrade -y
  sudo apt-get install screen -y
  sudo apt autoremove -y
  echo "Apt successfully installed."
fi


# Install node
if [ "$installNode" == true ]; then
  echo "Installing node"
  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  sudo apt-get install -y nodejs
  echo "Node successfully installed:"
  node -v
  echo "Setting up Node server"
  npm i
  cp .env-template .env
  echo "Node setup successful, make sure to update your .env file."
fi

# Install python
if [ "$installPython" == true ]; then
  echo "Installing python"
  python3 -V
  python3 -m pip install --upgrade pip
  pip3 install -r satellite/requirements.txt
  cp satellite/.env-template satellite/.env
  echo "Python setup successful, make sure to update your satellite/.env file."
fi

echo "All set, have fun!"
