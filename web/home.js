
window.onload = function () {
    getDateTime();
    checkForMessages();
    updateCalendar();
}

// check every 6 hours if it is between 12am and 6am
// at that time, update the calendar
window.setInterval(function () {
    let date = new Date();
    if (date.getHours <= 6) {
        updateCalendar();
    }
}, 1000 * 60 * 60 * 6);

async function updateCalendar() {
    let events = await wuy.calendarEvents();

    let datetime = moment();
    let date = datetime.date();
    let dayOfWeek = datetime.day();
    let agenda = [];

    for (let i = 0; i < 4; i++) {
        agenda.push({
            day: dayOfWeek + i,
            date: date + i,
            events: []
        });
    }

    for (let e of events) {
        let d = moment(e.time);
        let date = d.date();
        agenda.forEach((item) => {
            if (item.date === date) {
                if (e.allday) {
                    item.events.push({ title: e.title, time: null });
                } else {
                    let time = moment(e.time).format("HH:mm");
                    item.events.push({ title: e.title, time: time });
                }
            }
        });
    }
    agenda.forEach((item, index) => {
        if (item.events.length === 0) {
            item.events.push({ title: 'n\'importe quoi', time: null });
        }

        let titleID = 'day' + index;
        document.getElementById(titleID).innerHTML = convertDay(item.day) + ', ' + item.date;

        let contentsID = 'day' + index + 'contents';
        let contents = '';
        for (let e of item.events) {
            console.log(e);
            if (e.time) {
                contents += e.time + ' - ' + e.title + '\n';
            } else {
                contents += e.title + '\n';
            }
        }
        document.getElementById(contentsID).innerHTML = contents;
    });
}

// check every 20 minutes for new messages
window.setInterval(function () {
    checkForMessages();
}, 1000 * 60 * 10);

async function checkForMessages() {
    let message = await wuy.emails();
    let currentTime = moment();
    let messageTime = moment(message['time'])
    let fourHoursAgo = currentTime.subtract('4', 'hours');

    if (messageTime < fourHoursAgo) {
        updateMessageInfo('Boîte de Réception', null, 'Passes une bonne journée! \n Bisous, Anna')
    } else {
        updateMessageInfo('&#9758; Nouveau! &#9756;', messageTime.format('HH:mm'), message['contents'])
    }
}

function updateMessageInfo(notification, time, body) {
    document.getElementById('message-notification').innerHTML = notification;
    document.getElementById('message-body').innerHTML = body;
    document.getElementById('message-time').innerHTML = time;
}

function convertMonth(month) {
    switch (month) {
        case 0:
            return 'Janvier';
        case 1:
            return 'Février';
        case 2:
            return 'Mars';
        case 3:
            return 'Avril';
        case 4:
            return 'Mai';
        case 5:
            return 'Juin';
        case 6:
            return 'Juillet';
        case 7:
            return 'Août';
        case 8:
            return 'Septembre';
        case 9:
            return 'Octobre';
        case 10:
            return 'November';
        default:
            return 'Décembre';
    }
}

function convertDay(day) {
    switch (day) {
        case 1:
            return 'Lundi';
        case 2:
            return 'Mardi';
        case 3:
            return 'Mercredi';
        case 4:
            return 'Jeudi';
        case 5:
            return 'Vendredi';
        case 6:
            return 'Samedi';
        default:
            return 'Dimanche';
    }
}

function formatDate(date) {
    let month = convertMonth(date.month());
    let day = convertDay(date.day());
    let numeral = date.date();
    return day + ', ' + numeral + ' ' + month;
}

function getDateTime() {
    let date = moment();
    document.getElementById('date').innerHTML = formatDate(date);
    document.getElementById('time').innerHTML = date.format('HH:mm');

    setDateTimeDelay();
}

function setDateTimeDelay() {
    mydate = setTimeout('getDateTime()', 10000)
}