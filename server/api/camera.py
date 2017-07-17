import logging
import json
import os

IMAGE_FOLDER = 'src/images/fishcam'

class Camera:
    logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)
    exposed = True

    def GET(self, **kwargs):
        logging.info('GET request to camera endpoint')
        imageIndex = 0
        for i in os.listdir(IMAGE_FOLDER):
            if i.startswith('image'):
                index = int(i.split('_')[1].split('.')[0])
                if index > imageIndex:
                    imageIndex = index

        logging.info("the index is: {}".format(imageIndex))
        return json.dumps(imageIndex, indent=2)
