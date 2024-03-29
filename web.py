from __future__ import print_function
import wuy
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import base64

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/gmail.readonly']


class event(object):
    def __init__(self, title=None, time=None, allday=None):
        self.title = title
        self.time = time
        self.allday = allday

class email(object):
    def __init__(self, contents=None, time=None, id=None, file_path=None):
        self.contents = contents
        self.time = time
        self.id = id
        self.file_path = file_path

class home(wuy.Window):
    def calendarEvents(self):
        print('********* BEGIN CALENDAR EVENT FETCH *********')
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
        print('********* AUTH SET UP *********')

        
        now = datetime.datetime.now()
        midnight = now.replace(hour=0, minute=0, second=0, microsecond=0)
        midnighttoday = midnight.isoformat() + 'Z'
        
        fourdays =  datetime.datetime.now() + datetime.timedelta(days=4)
        fourdaysmidnight = fourdays.replace(hour=0, minute=0, second=0, microsecond=0)
        fourdays = fourdaysmidnight.isoformat() + 'Z'

        events_result = service.events().list(calendarId='primary', timeMin=midnighttoday, timeMax=fourdays,
                                              maxResults=40, singleEvents=True,
                                              orderBy='startTime').execute()
        events = events_result.get('items', [])
        agenda = []
        if not events:
            print('********* NO EVENTS FOUND *********')
        for e in events:
            start = e['start'].get('dateTime')
            allday = False
            if not start:
                start = e['start'].get('date')
                allday = True
            summary = e['summary']
            agenda.append(event(summary, start, allday))
           # print( start, allday)

        print('********* SUCCESSFULLY GOT EVENTS *********')
        return agenda

    def emails(self):
        print('********* BEGIN EMAIL FETCH *********')
        creds = None
        print('********* BEGIN EMAIL FETCH *********')
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
        print('********* AUTH SET UP *********')

        service = build('gmail', 'v1', credentials=creds)

        # Call the Gmail API
        messages = service.users().messages().list(userId='me').execute()
        latest = messages['messages'][0]

        message = service.users().messages().get(userId='me', id=latest['id']).execute()

        if message['payload']['parts'][0].get('parts'):
            bodydata = message['payload']['parts'][0]['parts'][0]['body']['data']
        else:
            bodydata = message['payload']['parts'][0]['body']['data']

        readablebody = base64.urlsafe_b64decode(bodydata.encode('ASCII'))

        id = ''
        time = ''
        for header in message['payload']['headers']:
            if header['name'] == 'Message-ID':
                id = header['value']
            elif header['name'] == 'Date':
                time = header['value']
        print(readablebody)
        print('********* SUCCESSFUL FETCH OF MAIL *********')

        path = ''
        for part in message['payload']['parts']:
            if part['filename']:
                data = part['body'].get('data')
                attachmentId = part['body'].get('attachmentId')
                print(attachmentId)
                if not data:
                    att = service.users().messages().attachments().get(userId='me', id=attachmentId, messageId=latest['id']).execute()
                    data = att['data']

                file_data = base64.urlsafe_b64decode(data.encode('UTF-8'))
                print('FOUND A FILE ')

                path = ''.join(['./web/photos/', part['filename']])

                f = open(path, 'wb')
                f.write(file_data)
                f.close()

        return email(readablebody, time, id, path)

home()
