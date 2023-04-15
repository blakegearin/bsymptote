#!/usr/bin/env python3
# Name: Rainbow Snake Short
# Author: Blake Gearin (blakegearin@pm.me)
#
# Description: Snake constantly rotating rainbow colors a large amount
# Uses: Primary

from neopixel import *
import datetime
from timeit import default_timer as timer
import sys

from colorFunctions import fill
from colorFunctions import wheel
from colorFunctions import colorBlend
from colorFunctions import isDiff
from easing import easeOut

time_start = 0 # for elapsed time
transition = 0 # 0-1.0, fade between states

wheel_deg = 0
last_active = -1

current_primary = Color(0,0,0,0)

def init(strip, table_values):
    global transition, time_start, wheel_deg, last_active, current_primary
    time_start = 0
    transition = 0

    wheel_deg = 85 # red
    last_active = -1
    # print "Init spread pattern {0} {1}\n".format(time_start, transition),
    # sys.stdout.flush()

def update(strip, table_values):
    global transition, time_start, wheel_deg, last_active, current_primary
    if time_start == 0:
        time_start = timer()
        transition = 0
        current_primary = table_values["primary_color"]
        # print "Start spread timer {0}\n".format(time_start),
        # sys.stdout.flush()

    led_count = strip.numPixels()

    if isDiff(current_primary, table_values["primary_color"]):
        current_primary = table_values["primary_color"]
        transition = 0
        time_start = timer() # reset

    now = datetime.datetime.now()

    if now.second != last_active:
        wheel_deg = wheel_deg - 15
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
    # if (s_end < s_start):
    #     s_end += led_count

    # for x in range(s_start, s_end):
    #     pos = x % led_count
    #     strip.setPixelColor(pos, wheel(wheel_deg))

    # if transition < 1.0:
    #     for i in range(strip.numPixels()+1):
    #         strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
    # else:
    #     fill(strip, current_primary)

    i_start = s_start % led_count
    i_end = s_end % led_count

    snake_length = 10
    ignore_i = snake_length - spread

    for i in range(0, led_count):
        # if i <= i_start and i_end >= i:
        # if i_start <= i or i >= i_end:
        if i_start <= i <= (i_end - 1):
            strip.setPixelColor(i, wheel(wheel_deg))
        # elif i < (i_end + ignore_i):
        # elif i < (i_end + ignore_i) and ignore_i < i_end:
        # elif i < min((i_end + ignore_i), i_end):
        # elif i > (i_end + ignore_i):
        # elif i < (i_end + ignore_i) and i > ignore_i:
        # elif i < (i_end + ignore_i) and i < ignore_i:
            # if i_end < ignore_i:
            #     if transition < 1.0:
            #         strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
            #     else:
            #         strip.setPixelColor(i, current_primary)
            # else:
                # continue
        elif i < (i_end + ignore_i):
            # continue
            if s_end < s_start:
                if s_end <= i <= s_start:
                    continue
                else:
                    if transition < 1.0:
                        strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
                    else:
                        strip.setPixelColor(i, current_primary)
            else:
                continue
            #     if transition < 1.0:
            #         strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
            #     else:
            #         strip.setPixelColor(i, current_primary)
            # else:
            #     continue
        elif transition < 1.0:
            strip.setPixelColor(i, colorBlend(strip.getPixelColor(i), current_primary, easeOut(transition)))
        else:
            strip.setPixelColor(i, current_primary)

    # draw
    strip.show()

    # increment time
    if transition < 1.0:
        time_end = timer()
        transition += time_end - time_start
        time_start = time_end
