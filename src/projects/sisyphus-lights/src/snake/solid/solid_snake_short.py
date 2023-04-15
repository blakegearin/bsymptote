#!/usr/bin/env python3
# Name: Solid Snake Short
# Author: Blake Gearin (blakegearin@pm.me)
#
# Description: Short snake with a solid color
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

last_active = -1

current_primary = Color(255,255,255,24)
current_secondary = Color(0,0,255,0)

def init(strip, table_values):
    global transition, time_start, last_active, current_primary, current_secondary
    time_start = 0
    transition = 0

    last_active = -1
    # print "Init spread pattern {0} {1}\n".format(time_start, transition),
    # sys.stdout.flush()

def update(strip, table_values):
    global transition, time_start, last_active, current_primary, current_secondary
    if time_start == 0:
        time_start = timer()
        transition = 0
        current_primary = table_values["primary_color"]
        current_secondary = table_values["secondary_color"]
        # print "Start spread timer {0}\n".format(time_start),
        # sys.stdout.flush()

    led_count = strip.numPixels()

    # reset target_color, transition if we are given a new primary_color
    if isDiff(current_primary, table_values["primary_color"]) or isDiff(current_secondary, table_values["secondary_color"]):
        current_primary = table_values["primary_color"]
        transition = 0
        time_start = timer() # reset

    if transition < 1.0:
        for i in range(strip.numPixels()+1):
            strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
    else:
        fill(strip, current_primary)

    now = datetime.datetime.now()

    if now.second != last_active:
        last_active = now.second

    # Seconds
    s_fixed = 360 - (now.second * 6) % 360
    spread = 2
    spread_l = s_fixed - spread
    spread_r = s_fixed + spread

    s_start = int( (spread_l * led_count) / 360 )
    s_end = int( (spread_r * led_count) / 360 ) + 1
    if (s_end < s_start):
        s_end += led_count

    for x in range((s_start - 5), s_end):
        pos = x % led_count
        strip.setPixelColor(pos, current_secondary)

    # if transition < 1.0:
    #     for i in range(strip.numPixels()+1):
    #         strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
    # else:
    #     fill(strip, current_primary)

    # for i in range(0,led_count):
    #     if (i <= s_start) or (i >= s_end):
    #         pos = i % led_count
    #         strip.setPixelColor(pos, current_secondary)
    #     # elif i < (s_end + 5):
    #     #     continue
    #     elif transition < 1.0:
    #         strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
    #     else:
    #         strip.setPixelColor(i, current_primary)

    # draw
    strip.show()

    # increment time
    if transition < 1.0:
        time_end = timer()
        transition += time_end - time_start
        time_start = time_end
