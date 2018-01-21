# Dragonfly
Code base for an dragonfly

# Description
Dragonfly is a simple data collection service for arduino-like
sensors. It comes with a server and front end to view gathered
data as well as a sample .ino file.

# Dependencies
nodejs
npm
cherrypy
pySerial

# Getting Started
1. git clone https://github.com/cyrillegin/Aquaponics.git into your preferred directory.
2. upload sample arudino code.
3. cd into dragonfly/static
4. npm install
5. cd into dragonfly
6. python run.py
7. In another terminal window
8. python run.py serialPoller
9. Navigate to http://localhost:8000


### TODO
rain meter:
https://codepen.io/widged/pen/MmWGoY

### Raspberry Pi setup
##### Config
copy and rename the config template 
cp config-template.py config.py 
DBFile: The location you'd like to store your database file. 
isMCP: Is this pi going to be the home base. 
MCPIP: The ip address of the home base pi. If this is the home base and it will also be running pollers, enter in localhost. 
MCPPORT: What port should the server run on, or, what port should the pollers send data to. 
STATIONNAME: What would you like your station to be called. This is used on the front end to organize which sensors should be grouped together. 

##### Node
sudo --silent --location https://deb.nodesource.com/setup_8.x | sudo bash - 
sudo apt-get install --yes nodejs

##### Main station
sudo apt-get install screen
sudo pip install cherrypy parse-http-list
setup config - see config section for details
sudo npm run startProd

