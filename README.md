# Dragonfly

The primary focus of Dragonfly is for allow a plug-n-play framework for sensor data collection and display.

### Concepts

Dragonfly can run using only a single pi. It will poll whatever sensors you add and store the data on a local postgres database. It can also be used with multiple pis working together sending data to each other. A typical setup would be to have a few pis all transmitting data to a centralized server. In this configuration, the pis would be called "satellites".

### Dependencies

- nodejs
- python3
- Postgres on whatever server will be storing the data.

##### Installing Node

`sudo --silent --location https://deb.nodesource.com/setup_8.x | sudo bash -`  
`sudo apt-get install --yes nodejs`  
`sudo npm install`

##### Installing python and dependencies

Python comes installed on most pis by default however you will probably need to install some of the libraries used: `sudo pip3 install cherrypy sqlalchemy psycopg2 requests`
If you will be developing on Dragonfly, you will also need to `sudo pip3 install pep8 flake8` to run lint tests.

##### Installing postgres

Run the following commands:

- `sudo apt-get install postgresql libpq-dev postgresql-client -y`
- `sudo su postgres`
- `createuser pi -P --interactive`
  - superuser - no
  - databases - YES
  - roles - YES
- `psql` - This will drop you into the postgres shell
- `create database yourDbName;`
- exit back to pi user ( Ctrl + d)
- `psql yourDbName`

### Getting Started

Make sure that python3 and node are installed, then run the following commands:

- `git clone https://github.com/cyrillegin/dragonfly.git`
- `cd dragonfly`
- `npm run setup`

##### Global preferences

The following is some general house keeping you should do before setting up any pollers or servers.

- Change default password
- Connect to wifi
- Assign static ip
- Enable ssh
- Enable any other interfaces you may need, more in depth details will be under each specific poller.
- Turn off bluetooth (There are no current uses for bluetooth in this project)

These commands will make sure everything on your pi is up to date:

- `sudo apt-get update`
- `sudo apt-get upgrade -y`
- `sudo apt-get install screen vim -y`

##### Config

Copy and rename the config template  
`cp config-template.py config.py`

###### Config settings

- DBFile - The location you'd like to store your database file.
- isMCP - Is this pi going to be the home base.
- MCPIP - The ip address of the home base pi. If this is the home base and it will also be running pollers, use the value "localhost".
- MCPPORT - What port should the server run on, or, what port should the pollers send data to.
- STATIONNAME - What would you like your station to be called. This is used on the front end to organize which sensors should be grouped together.

##### Starting the Server

`sudo npm run start:prod` - This will start the python server, start polling for whatever sensors have been added to the local database, and build the front end ui.

### Pollers

##### Crypto

Use name of cryptocurrency in the meta value

##### GPIO

Once the poller has been wired to the pi, you will need to activate it and get its device id. Run `sudo dtoverlay w1-gpio gpiopin=17 pullup=0`, changing the gpiopin to whatever you have yours plugged into (run this command multiple times if you have multiple sensors plugged in).
To list the active devices, run `ls /sys/bus/w1/devices/`
You should see listed devices that look like `28-0416a47a0aff`. These will be added to the metadata field when adding the sensor in the UI.

##### BMP180

A nice tutorial on how to set the sensor up can be found here: http://osoyoo.com/2017/07/06/bmp180_pressure-sensor/
Dragonfly also uses their bmp180 class to interact with the sensor.
In the meta field, you can enter either 'temperature', 'pressure', or 'altitude' to read those values

##### DHT11

Tutorial from http://osoyoo.com/2017/07/06/dht11/
In the meta field, you can enter either 'temperature' or 'humidity'.

##### Custom Entry

This is a pseudo sensor. When created, no fields actually need to be filled out (although this is not recommended!). This sensor is just meant to graph things you would like to input yourself.

### Action Plugins

##### Slack plugin

Create a slack app here: https://api.slack.com/incoming-webhooks#advanced_message_formatting
Once done, add the slack hook url to your config for SLACK_URL
Once triggered, the alarm will send a message stating that it has gone out of bounds and give the rule that triggered the alarm. Once the sensor has returned within its bounds, another slack message will be sent stating so.
If you want to add a custom message to the alarm, you can add it in the meta field.

### TroubleShooting

To check if node installed correctly, run `node -v`. Under some instances, node has trouble correctly detecting the pis architecture. This has happened on the raspberry pi zero wireless. To fix this, you can download and install a different architecture based node manually:

- `wget https://nodejs.org/dist/v8.10.0/node-v8.10.0-linux-armv6l.tar.gz`
- `tar -xzf node-v8.10.0-linux-armv6l.tar.gz`
- `cd node-v6.11.1-linux-armv6l/`
- `sudo cp -R * /usr/local/`
  To check to make sure everything worked, run `node -v`

If you get a peer authentication failed for user pi error when starting the server, you need to edit the pg_hba.conf file.
`vim /etc/postgresql/9.6/main/pg_hba.conf`
and change lines
`local all postgres peer`
to
`local all postgres md5`

### Development

Docker is used for development, this allows us to mimic the same OS as a pi as well as the postgres server for the home base. To get started, make sure docker is installed on your machine and run the following commands:

- `cd docker/postgres`
- `./run.sh` - This will build the postgres container
- `cd ../app/`
- `./build.sh` - This will build a container based off of debian stretch

Once the containers have been built you can use these commands to interact with them:

- `./run.sh` - This will drop you into debian container.
- `run-app.sh` - This will start the webapp in watch mode from the container.

Make sure that you run any commands pertaining to development from within the container, for example `npm install` needs to be done within the container because some of the dependencies relay on the architecture to work.

##### NPM Commands

The following commands have been added to aid in development:

- `build:prod` - Builds the front end in production mode
- `clean` - Removes node modules, pyc files, and bundle.js
- `clean:all` - Runs above clean, then wipes and rebuilds database and reinstalls node modules
- `inc:minor` - increment the minor version
- `inc:patch` - increment the major version
- `install:git-hooks` - installs a pre push hook to lint code base
- `jest` - Runs jest on front end (Not yet implemented)
- `lint` - eslint and flake8 over code base
- `load:fixtures` - Creates a new sensor and adds a days worth of readings to it (Note: The server must be running because this makes use of the api)
- `prettier` - Runs prettier over code base
- `rebuild:db` - Drops all tables and re-adds them.
- `run:prod` - Builds the front end in production and runs the python server
- `setup` - installs node modules, git hooks, and rebuilds the database
- `start` - builds the front end in watch mode and starts the python server
- `start:server` - starts the python server
- `test` - Runs jest (Not yet implemented)
- `tests` - Runs jest and linters (Not yet implemented)
- `watch:client` - Builds the front end in watch mode
- `watch:prod` - Builds the front end in production mode
