#!/usr/bin/env python3
# Name: Random Colors
# Author: Blake Gearin (blakegearin@pm.me)
#
# Description: Random colors changing every 5 seconds

from neopixel import *
import datetime
from timeit import default_timer as timer
import sys
import random

from colorFunctions import colorBlend
from colorFunctions import wheel
from easing import easeOut

time_start = 0 # for elapsed time
transition = 0 # 0-1.0, fade between states

def init(strip, table_values):
    global transition, time_start, last_active
    time_start = 0
    transition = 0
    last_active = -1
    # print "Init rainbow pattern {0} {1}\n".format(time_start, transition),
    # sys.stdout.flush()

def update(strip, table_values):
    global transition, time_start, last_active
    if time_start == 0:
        time_start = timer()
        transition = 0
        # print "Start rainbow timer {0}\n".format(time_start),
        # sys.stdout.flush()

    led_count = strip.numPixels()

    now = datetime.datetime.now()

    if (now.minute == 0) and (now.second == 0) and (now.hour != last_active):
        last_active = now.hour

        for i in range(0,led_count):
            wheel_deg = random.randint(0, 255)
            if transition < 1.0:
                strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), wheel(wheel_deg), easeOut(transition)))
            else:
                strip.setPixelColor(i, wheel(wheel_deg))

    # increment time
    if transition < 1.0:
        time_end = timer()
        transition += time_end - time_start
        time_start = time_end
