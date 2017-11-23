import subprocess


minTemp = 34
maxTemp = 40


def controlFridge(value, on):
    print "Got new value: %d", value
    if value >= maxTemp and not on:
        doSwitch("on")
        return True
    if value <= minTemp and on:
        doSwitch("off")
        return False
    if value >= maxTemp + 5:
        doSwitch("on")
        return True
    if value <= minTemp - 5:
        doSwitch("off")
        return False
    return on


def doSwitch(value):
    subprocess.call(["wemo", "switch",  "Wemo Mini", value])
