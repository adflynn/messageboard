from __future__ import print_function
import wuy
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
# class home(wuy.Window):
    # TODO: move within home, to call within js
    # TODO: check every night at midnight, pushup then
def calendarEvents():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)

    # Call the Calendar API for the next 4 days
    print('getting some events')
    now = datetime.datetime.utcnow().isoformat() + 'Z' 
    fourdays = date_N_days_ago = datetime.datetime.utcnow() + datetime.timedelta(days=4)
    fourdays = fourdays.isoformat() + 'Z'
    events_result = service.events().list(calendarId='primary', timeMin=now, timeMax=fourdays,
                                        maxResults=10, singleEvents=True,
                                        orderBy='startTime').execute()
    events = events_result.get('items', [])
    agenda = []
    if not events:
        print('No upcoming events found.')
    for e in events:
        start = e['start'].get('dateTime')
        allday = False
        if not start:
            start =  e['start'].get('date')
            allday = True
        summary = e['summary']
        agenda.append(event(summary, start, allday))
        print(summary, start, allday)

    print('got through')
    return agenda

class event(object):
    def __init__(self, title=None, time=None, allday=None):
        self.title = title
        self.time = time
        self.allday = allday

calendarEvents()
# home()