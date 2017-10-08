Interacting with wemo devices:
git clone https://github.com/iancmcc/ouimeaux.git
python setup.py build
sudo python setup.py install

wemo status --> Gives the types(s) and name(s) of devices.

wemo [type] [name] [action] seems to be the pattern

My switch named 'Wemo mini':
    wemo switch 'Wemo Mini' on
    wemo switch 'Wemo Mini' off
