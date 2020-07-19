class SensorManager:
    class __SensorManager:
        def __init__(self):
            self.val = 1
        def startSensor(self):
            print('starting sensor')

        def stopSensor(self):
            print('stopping sensor')

        def checkSensor(self):
            print('checking sensor')
            self.val = self.val + 1
            print(self.val)

    instance = None

    def __init__(self):
        if not SensorManager.instance:
            SensorManager.instance = SensorManager.__SensorManager()

    def __getattr__(self, name):
        return getattr(self.instance, name)
