# Dragonfly

A data collector primarily geared towards raspberry pis.

## Concepts

There are two main aspects to Dragonfly, the server and its satellites.

The server consists of an Express server and api connected to a postgres database. The server serves a react front end. The main purpose of this server is to collect data from various sources and display it for a user to browse on a 'dashboard', 'station', or 'sensor' basis.

A Satellite polls data from one or more 'sensors' and reports this data to the 'server'. Generally, a Satellite is considered a 'station', and each sensor or data input is called a 'sensor'. 'Sensors' can be hardwired to a station, for example, a temperature sensor connected on a raspberry pis GPIO pins. However, a 'sensor' could also be from a virtual source. For example, the GUI offers manual input of readings - this would also be considered a 'sensor'. You can also add plugins to poll apis, for example there is a crypto poller that finds the latest price of bitcoin.

The GUI has three main views - 'dashboard', 'station', 'sensor'.
The 'dashboard' view is a customizable list of graphs and widgets that pops up when the user goes to the main route of Dragonfly.
The 'station' view is like the 'dashboard' view in that it's customizable however it will only show data from the particular station that is selected.
The 'sensor' view is a single graph detailing the particular sensor that is selected. More in-depth information about a sensor can be found and edited here. Also, 'Actions' can be applied to the particular sensor.

'Actions' are scripts that run when a certain criteria is met. They can be created from the 'sensor' view. Common actions could include:

- Send a slack message when the price of a stock has dropped below a given number
- Turn on a light when the time is 6:00 a.m.
- Turn off a heater when the temperature has gone above 80 degrees.

## Development

#### Quickstart

Run each command in a separate terminal tab

- `docker-compose up`
- `npm run start`
- `npm run start:satellite`
- `npm run generate:fixtures`

#### Setup

- `git clone https://github.com/cyrillegin/dragonfly.git`
- `cd dragonfly/`
- `npm i`
- `cp .env-template .env` and replace values with your own postgres values.

To setup postgres, ensure that docker is installed and run `docker-compose up`. This will download the postgres image and run with the logs outputting to your console.

###### Raspberry Pi basic setup

Get the latest pi image from the raspberry pi website and flash it to an ssd.
In terminal connected to the pi, run the following commands:

- `sudo ./utility/setupPi.sh`

#### Development

`npm run start` will build the front and back end and run them in watch mode. The site will be running at `localhost:3000`. From here you can add stations and sensors from the ui. If you would like dummy data added to work with, you can run `npm run generate:fixtures` while the server is running. This will create two stations with two sensors each with readings in all of the graphs. A few npm scripts have also been added:

- `npm run watch:client` - runs only the front end in watch mode
- `npm run watch:server` - runs only the back end in watch mode
- `npm run db:shell` - This will drop you into an interactive postgres shell. (TODO: hardcoded database and user)

#### Handy postgres commands

These assume you used the `npm run db:shell` script and are in the postgres docker container.

- `\l` - List databases
- `\dt` - list tables
- `\c db` - switch to database 'db'

## Server deployment

For deployment instructions, I will be assuming that this is being deployed on a raspberry pi on a local network. I am also assuming that `node`, `npm`, and `postgress` have been installed. For more details on setting up a raspberry pi, see: (TODO: how to set up a raspberry pi)

- `ssh username@ip` - where username is the name of your user on the pi and ip is its ip address, should look something like: `shh pi@192.168.0.2`
- Enter password
- `git clone https://github.com/cyrillegin/dragonfly.git`
- `cd dragonfly`
- `cp .env-template .env` and fill out with pis credentials
- `npm i`
- `npm run build:prod` //TODO
- `sudo npm run start:prod` //TODO
  This will start the the server in production mode on the pi. To access it, navigate to the pis ip from any browser on the same network: `http://192.168.0.2`. If you run these commands as is, this will display all of the logs directly to the console that has sshd in. Generally speaking though, you don't care about the console. You can set up dragonfly as a system service (TODO: setup instructions for running as a service.) or as a semi-perminant solution, I like to run the server in `screen` (TODO: explain screen)

### Server updates

This is for when dragonfly is already up and running.

- `ssh username@ip`
- `cd path/to/dragonfly/folder`
- `git pull`
- `npm i` // Only needed if new deps have been added.
- `npm run build:server:prod` // Only needed if there are server changes
- `npm run build:client:prod` // Only needed if there are client changes

If you run the build:server:prod, you'll need to restart the server.

### Database migrations

If there was a change to the database schema, there's a few handy commands included in the package.json file:

- `npm run db:up` - runs all of the database migration scripts
- `npm run db:down` - undos the migration scripts
- `npm run db:status` - checks to see if you need to run any migrations

## Satellite deployment

Satellites can be deployed anywhere, including where the server is deployed, aws (TODO: prove), personal computers, or other raspberry pis. For these instructions, I will assume that this is a different raspberry pi being accessed via ssh from a personal computer.

- `ssh username@ip` - where username is the name of your user on the pi and ip is its ip address, should look something like: `shh pi@192.168.0.2`
- `git clone https://github.com/cyrillegin/dragonfly.git`
- `cd dragonfly/satellite`
- `sudo ./setup.sh` (TODO)
- `python __main__.py`
  This will start the python server and print out logs to the console. Like the server above, I suggest running this as a service or in screen.
  There are some sensors that require additional setup, this will be detailed in the Sensors section.

### Satellite updates

- `ssh username@ip`
- `cd path/to/dragonfly/folder`
- `git pull`
  That should be it. The cherrypy server is setup up to auto restart on code changes. That said, make sure you check your log outputs because some changes could either not be picked up or stall out the server. To be extra sure, you can always restart.

## Sensors

##### GPIO

Once the poller has been wired to the pi, you will need to activate it and get its device id. Run `sudo dtoverlay w1-gpio gpiopin=17 pullup=0`, changing the gpiopin to whatever you have yours plugged into (run this command multiple times if you have multiple sensors plugged in).
To list the active devices, run `ls /sys/bus/w1/devices/`
You should see listed devices that look like `28-0416a47a0aff`. These will be added to the metadata field when adding the sensor in the UI.

Method 2:
Ensure `dtoverlay=w1-gpio` is in your `/boot/config.txt`. Restart the pi with `sudo reboot now`.
Enter: `sudo modprobe w1-gpio` and `sudo modprobe w1-therm`. Now when you `ls /sys/bus/w1/devices/`, your device id should appear.
