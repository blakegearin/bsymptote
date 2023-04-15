#!/usr/bin/env python3
# Name: Rainbow Ouroboros Long
# Author: Blake Gearin (blakegearin@pm.me)
#
# Description: Ouroboros constantly rotating rainbow colors a small amount

from neopixel import *
import datetime
from timeit import default_timer as timer
import sys

from colorFunctions import wheel

time_start = 0 # for elapsed time
transition = 0 # 0-1.0, fade between states

wheel_deg = 0
last_active = -1

def init(strip, table_values):
    global transition, time_start, wheel_deg, last_active
    time_start = 0
    transition = 0

    wheel_deg = 85 # red
    last_active = -1
    # print "Init spread pattern {0} {1}\n".format(time_start, transition),
    # sys.stdout.flush()

def update(strip, table_values):
    global transition, time_start, wheel_deg, last_active
    if time_start == 0:
        time_start = timer()
        transition = 0
        # print "Start spread timer {0}\n".format(time_start),
        # sys.stdout.flush()

    led_count = strip.numPixels()

    now = datetime.datetime.now()

    if now.second != last_active:
        wheel_deg = wheel_deg - 1
        last_active = now.second

    if (wheel_deg < 0):
        wheel_deg = 256 + wheel_deg

    # Seconds
    s_fixed = 360 - (now.second * 6) % 360
    spread = 2
    spread_l = s_fixed - spread
    spread_r = s_fixed + spread

    s_start = int( (spread_l * led_count) / 360 )
    s_end = int( (spread_r * led_count) / 360 ) + 1
    if (s_end < s_start):
        s_end += led_count

    for x in range(s_start, s_end):
        pos = x % led_count
        strip.setPixelColor(pos, wheel(wheel_deg))

    # draw
    strip.show()

    # increment time
    if transition < 1.0:
        time_end = timer()
        transition += time_end - time_start
        time_start = time_end
