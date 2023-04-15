#!/usr/bin/env python3
# Name: Duotone Rainbow Minute
# Author: Blake Gearin (blakegearin@pm.me)
#
# Description: Two color rainbow cycle based on the current second in a minute

from neopixel import *
import datetime
from timeit import default_timer as timer
import sys

from colorFunctions import colorBlend
from colorFunctions import wheel
from easing import easeOut

time_start = 0 # for elapsed time
transition = 0 # 0-1.0, fade between states
print_led_count = True

def init(strip, table_values):
    global transition, time_start
    time_start = 0
    transition = 0
    # print "Init rainbow pattern {0} {1}\n".format(time_start, transition),
    # sys.stdout.flush()

def multitone_wheel_deg(number_of_tones, integer, wheel_deg):
    wheel_deg = wheel_deg - (integer % number_of_tones)

    if (wheel_deg < 0):
        wheel_deg = 256 + wheel_deg

    return wheel_deg

def update(strip, table_values):
    global transition, time_start
    if time_start == 0:
        time_start = timer()
        transition = 0
        # print "Start rainbow timer {0}\n".format(time_start),
        # sys.stdout.flush()

    led_count = strip.numPixels()
    if print_led_count:
        print_led_count = False
        print()
        print("led_count")
        print(led_count)

    now = datetime.datetime.now()

    seconds_since_minute = now.second

    minutely_seconds_to_wheel_deg_ratio = 0.235294
    wheel_deg = int(round(seconds_since_minute / minutely_seconds_to_wheel_deg_ratio))

    for i in range(0,led_count):
        wheel_deg = multitone_wheel_deg(2, i, wheel_deg)

        if transition < 1.0:
            strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), wheel(wheel_deg), easeOut(transition)))
        else:
            strip.setPixelColor(i, wheel(wheel_deg))

    # increment time
    if transition < 1.0:
        time_end = timer()
        transition += time_end - time_start
        time_start = time_end
