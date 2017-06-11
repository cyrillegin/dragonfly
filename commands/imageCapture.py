import os
import pygame
import pygame.camera
from pygame.locals import *

IMAGE_FOLDER = 'static/images/fishcam'
CAPTURE_RATE = 60 * 5


def recordImages():
    print 'starting image record'
    pygame.init()
    pygame.camera.init()

    try:
        cam = pygame.camera.Camera("/dev/video0", (640, 480))
        cam.start()
    except Exception, e:
        print "error connecting to camera:"
        print e

    imageIndex = 0
    for i in os.listdir(IMAGE_FOLDER):
        if i.startswith('image'):
            if int(i.split('.')[1]) > imageIndex:
                imageIndex = i.split('.')[1]
    print 'image index starting at {}'.format(imageIndex)

    Recording = True
    while(Recording):
        print "Getting image"
        try:
            image = cam.get_image()
        except Exception, e:
            print "error getting image:"
            print e
            Recording = False
            break

        print "Saveing image"

        try:
            pygame.image.save(image, os.path.join(IMAGE_FOLDER, 'image_{}.jpg'.format(imageIndex)))
        except Exception, e:
            print "Error saving image:"
            print e
            Recording = False
            break
        time.sleep(CAPTURE_RATE)
