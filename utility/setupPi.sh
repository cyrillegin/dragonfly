#!/bin/bash

echo "Setting up new dragonfly satellite..."

dryRun=false
installNode=false
installPython=false

if [ "$1" == "dryRun" ] || [ "$2" == "dryRun" ] || [ "$3" == "dryRun" ]; then
  dryRun=true
fi

if [ "$1" == "node" ] || [ "$2" == "node" ] || [ "$3" == "node" ]; then
  installNode=true
fi

if  [ "$1" == "python" ] || [ "$2" == "python" ] || [ "$3" == "python" ]; then
  installPython=true
fi

# Install Apt updates
if [ "$dryRun" == false ]; then
  echo "updating apt"
  sudo apt update
  sudo apt full-upgrade -y
  sudo apt-get update
  sudo apt-get dist-upgrade -y
  echo "Apt successfully installed."
fi


# Install node
if [ "$installNode" == true ]; then
  echo "Installing node"
  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  sudo apt-get install -y nodejs
  npm i
  echo "Node successfully installed:"
  node -v
fi

# Install python
if [ "$installPython" == true ]; then
  echo "Installing python"
  python3 -V
  python3 -m pip install --upgrade pip
  pip3 install -r satellite/requirements.txt
  echo "Python successfully installed:"
fi

echo "All set, have fun!"
