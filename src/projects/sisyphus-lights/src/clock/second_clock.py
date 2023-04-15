#!/usr/bin/env python3
# Name: Second Clock
# Author: Blake Gearin (blakegearin@pm.me)
#
# Description: Shows the current second
# Uses: Primary, Secondary

from neopixel import *
import datetime
from timeit import default_timer as timer
import sys

from colorFunctions import fill
from colorFunctions import colorBlend
from colorFunctions import isDiff
from easing import easeOut

time_start = 0 # for elapsed time
transition = 0 # 0-1.0, fade between states

current_primary = Color(0,0,0,0)
current_secondary = Color(0,0,0,0)

def init(strip, table_values):
    global transition, time_start, second_color
    time_start = 0
    transition = 0

    second_color = Color(255,255,255,255)
    # print "Init spread pattern {0} {1}\n".format(time_start, transition),
    # sys.stdout.flush()

def update(strip, table_values):
    global transition, time_start, current_primary, current_secondary
    if time_start == 0:
        time_start = timer()
        transition = 0
        current_primary = table_values["primary_color"]
        current_secondary = table_values["secondary_color"]
        # print "Start spread timer {0}\n".format(time_start),
        # sys.stdout.flush()

    # reset target_color, transition if we are given a new primary_color
    if isDiff(current_primary, table_values["primary_color"]) or isDiff(current_secondary, table_values["secondary_color"]):
        current_primary = table_values["primary_color"]
        current_secondary = table_values["secondary_color"]
        transition = 0
        time_start = timer() # reset

    led_count = strip.numPixels()

    now = datetime.datetime.now()

    if transition < 1.0:
        for i in range(led_count+1):
            strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
    else:
        fill(strip, current_primary) # default color

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
        strip.setPixelColor(pos, current_secondary)

    # draw
    strip.show()

    # increment time
    if transition < 1.0:
        time_end = timer()
        transition += time_end - time_start
        time_start = time_end
