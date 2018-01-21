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
`cp config-template.py config.py`

DBFile: The location you'd like to store your database file.   
isMCP: Is this pi going to be the home base.  
MCPIP: The ip address of the home base pi. If this is the home base and it will also be running pollers, enter in localhost.  
MCPPORT: What port should the server run on, or, what port should the pollers send data to.  
STATIONNAME: What would you like your station to be called. This is used on the front end to organize which sensors should be grouped together.  

##### Node
`sudo --silent --location https://deb.nodesource.com/setup_8.x | sudo bash -`  
`sudo apt-get install --yes nodejs`  

##### Main station
`sudo apt-get install screen`  
`sudo pip3 install cherrypy sqlalchemy delorean` 
setup config - see config section for details  
`sudo npm run startProd`  

##### Running pollers
All pollers should be defined in the config.  
To begin polling all sensors, run `python3 run.py startPollers`


##### Serial Poller
`sudo pip3 install serial`  

##### WeatherSensor  
`sudo apt-get install python3-bs4`

##### image capture
`sudo pip3 install pygame`
Note: If developing on a mac, theres is currently an issue with pygame, see: https://stackoverflow.com/questions/22974339/pygame-installation-issue-in-mac-os


##### OneWire temperature sensor
Add dtoverlay=w1-gpio to /boot/config.txt  
This will use gpio pin 2 by default, to change it, run `dtoverlay=w1-gpio,gpiopin=x`  
`sudo modprobe w1-gpio`  
`sudo modprobe w1-therm`  
to see the device(s), `cd /sys/bus/w1/devices/`  
to get a reading from a sensor, cd the sensor.  
`cat w1_slave`  
you will receive something like:  
72 01 4b 46 7f ff 0e 10 57 : crc=57 YES  
72 01 4b 46 7f ff 0e 10 57 t=23125  
the t=23125 means that the temperature is 23.125 degrees celcius  

To add this sensor to your list of pollers, make sure you include the device Id to the config.  
To test it, run `python3 run.py wireSensor`. The temperature should be printed out.  
* Can control (see controllers)  


##### Motion Sensor
VCC needs to be hooked up to 5v, both sensitivity and time delay pots should be relativly low to avoid false positives.  


##### Controllers
Certain sensors like the one wire temperature sensor have the ability to control other things.  

The example config shows demonstrates how to set it up for controlling a wemo switch.
