import subprocess


minTemp = 47
maxTemp = 51


def controlFridge(value, on):
    print "Got new value: %d", value
    if value >= maxTemp and not on:
        doSwitch("on")
        return True
    if value <= minTemp and on:
        doSwitch("off")
        return False
    return on


def doSwitch(value):
    subprocess.call(["wemo", "switch",  "Wemo Mini", value])
