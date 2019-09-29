
A simple application built for raspberry pi

## Goal / Motivation
Create a digital white board application for my grandmother, to keep myself in touch with her throughout the day and keep her aware of the date/time and daily tasks.

The project is in French, but could easily be forked and updated with any language :)


## Key Features
* Uncrowded display to avoid confusion
* Update as new messages come in, but persist messages to give time for them to be seen (and reseen)
* Display current day and time
* Display upcoming events 

## Tech Used
Raspberry pi + monitor

Vanilla Javascript for front end.
Python for back end.

Integrations with Google Calendar & Gmail

[WUY](https://github.com/manatlan/guy) to connect python back end to front end and serve a web application

Yes, this includes a token for the Google account set up solely for this project. I ask kindly that you do not use it for evil.

### TO RUN
`python web.py`

to disable screensaver

```
$ sudo xset s off
$ sudo xset -dpms
$ sudo xset s noblank
```

or use xscreensaver

`sudo apt-get install xscreensaver`