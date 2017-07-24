import os
import pygame
import pygame.camera
import time
import logging
from pygame.locals import *

IMAGE_FOLDER = 'static/images/fishcam'
CAPTURE_RATE = 60 * 5

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def recordImages():
    logging.info('Starting image record.')
    pygame.init()
    pygame.camera.init()

    try:
        cam = pygame.camera.Camera("/dev/video0", (640, 480))
        cam.start()
    except Exception, e:
        logging.errer("Error connecting to camera.")
        logging.error(e)

    imageIndex = 0
    for i in os.listdir(IMAGE_FOLDER):
        if i.startswith('image'):
            index = int(i.split('_')[1].split('.')[0])
            if index > imageIndex:
                imageIndex = index
    logging.info('Image index starting at {}'.format(imageIndex))

    Recording = True
    while(Recording):
        logging.info("Getting image.")
        try:
            image = cam.get_image()
        except Exception, e:
            logging.error("Error getting image")
            logging.debug(e)
            Recording = False
            break

        logging.info("Saving image.")
        imageIndex += 1
        try:
            pygame.image.save(image, os.path.join(IMAGE_FOLDER, 'image_{}.jpg'.format(imageIndex)))
        except Exception, e:
            logging.error("Error saving image:")
            logging.debug(e)
            Recording = False
            break
        time.sleep(CAPTURE_RATE)
