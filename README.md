# Dragonfly
Code base for an dragonfly

This readme is out of date....

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


### Raspberry Pi setup

##### Global preferences  
The following is some general house keeping you should do before setting up any pollers or servers.
Change default password  
Connect to wifi  
Assign static ip
Enable ssh
Enable any other interfaces you may need, more in depth details will be under each specific poller.
Turn off bluetooth (There are no current uses for bluetooth in this project)

run these commands:
* `sudo apt-get update`
* `sudo apt-get upgrade -y`
* `sudo apt-get install screen vim -y`


##### Config
copy and rename the config template  
`cp config-template.py config.py`

DBFile: The location you'd like to store your database file.   
isMCP: Is this pi going to be the home base.  
MCPIP: The ip address of the home base pi. If this is the home base and it will also be running pollers, enter in localhost.  
MCPPORT: What port should the server run on, or, what port should the pollers send data to.  
STATIONNAME: What would you like your station to be called. This is used on the front end to organize which sensors should be grouped together.  

##### Node
Node is only required if it will be running the server. All other satelites can skip this step
`sudo --silent --location https://deb.nodesource.com/setup_8.x | sudo bash -`  
`sudo apt-get install --yes nodejs`  
`sudo npm install`

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
This will use gpio pin 2 by default, to change it, run `sudo dtoverlay w1-gpio gpiopin=x pullup=0` where x is the pin  
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





V2!


Setting up dragonfly on Raspberry Pi
With monitor / keyboard / mouse

menu - preferences - raspberry pi config
setup name / password/ and enable any protocols you need
right click on wifi and connect to internet

update apt
* `sudo apt-get update`
* `sudo apt-get upgrade -y`
* `sudo apt-get install screen vim -y`

install node
`sudo curl --silent --location https://deb.nodesource.com/setup_8.x | sudo bash -`
`sudo apt-get install -y nodejs`  
`sudo npm install`

setup repo
`git clone https://github.com/cyrillegin/dragonfly.git`

Setting up postgres
`sudo apt install postgresql libpq-dev postgresql-client`
`sudo su postgres`
`createuser pi -P --interactive`
  superuser - no
  databases - YES
  roles - YES
`psql`
`create database test`
exit back to pi user ( Ctrl + d)
`psql test`


Sensor PLUGINS

Crypto Poller
use name in the meta value

GPIO Poller
Once the poller has been setup, you need to activate it and get its device id.
`sudo dtoverlay w1-gpio gpiopin=17 pullup=0`
changing the gpiopin to whatever you have yours plugged into (run this command multiple times if you have multiple sensors plugged in).
To list the active devices, run
`ls /sys/bus/w1/devices/`
You should see listed devices that look like `28-0416a47a0aff`. These will be added to the metadata field when adding the sensor.



Action Plugins

Slack plugin
to use the slack plugin, you must create a slack app here: https://api.slack.com/incoming-webhooks#advanced_message_formatting
Once done, add the slack hook url to your config for SLACK_URL



TroubleShooting
To check if node installed correctly, run `node -v`. Under some instances, node has trouble correctly detecting the pis architecture. This has happened on the raspberry pi zero wireless. To fix this, you can download and install a different architecture based node manually:
`wget https://nodejs.org/dist/v8.10.0/node-v8.10.0-linux-armv6l.tar.gz`
`tar -xzf node-v8.10.0-linux-armv6l.tar.gz`
`cd node-v6.11.1-linux-armv6l/`
`sudo cp -R * /usr/local/`
To check to make sure everything worked, run `node -v`


If you get a peer authentication failed for user pi error when starting the server, you need to edit the pg_hba.conf file.
`vim /etc/postgresql/9.6/main/pg_hba.conf`
and change lines 
`local   all             postgres                                peer`
to
`local   all             postgres                                md5`
