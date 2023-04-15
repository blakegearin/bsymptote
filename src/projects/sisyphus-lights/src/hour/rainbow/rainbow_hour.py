#!/usr/bin/env python3
# Name: Rainbow Hour
# Author: Blake Gearin (blakegearin@pm.me)
#
# Description: Rainbow cycle based on the current minute in an hour

from neopixel import *
import datetime
from timeit import default_timer as timer
import sys

from colorFunctions import colorBlend
from colorFunctions import wheel
from easing import easeOut

time_start = 0 # for elapsed time
transition = 0 # 0-1.0, fade between states

def init(strip, table_values):
    global transition, time_start
    time_start = 0
    transition = 0
    # print "Init rainbow pattern {0} {1}\n".format(time_start, transition),
    # sys.stdout.flush()

def update(strip, table_values):
    global transition, time_start
    if time_start == 0:
        time_start = timer()
        transition = 0
        # print "Start rainbow timer {0}\n".format(time_start),
        # sys.stdout.flush()

    led_count = strip.numPixels()

    now = datetime.datetime.now()

    seconds_since_hour = (now.minute) * 60 + now.second

    hourly_seconds_to_wheel_deg_ratio = 14.117647
    wheel_deg = int(round(seconds_since_hour / hourly_seconds_to_wheel_deg_ratio))

    for i in range(0,led_count):
        if transition < 1.0:
            strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), wheel(wheel_deg), easeOut(transition)))
        else:
            strip.setPixelColor(i, wheel(wheel_deg))

    # increment time
    if transition < 1.0:
        time_end = timer()
        transition += time_end - time_start
        time_start = time_end
