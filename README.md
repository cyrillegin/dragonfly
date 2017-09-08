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

You should see at least the basis of dragonfly. As the poller
collects more data, the site will fill itself out.
Enjoy!



### TODO
rain meter:
https://codepen.io/widged/pen/MmWGoY
