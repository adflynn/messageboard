
window.onload = function() {
    getDateTime();
    checkForMessages();

    // for now
    updateCalendar();
}

// Check every 6 hours if it is between 12am and 7am
// at that time, update the calendar
// now this would obviously be better to come from backend and alert hmmmm
window.setInterval(function(){ 
    let date = new Date(); 
    if(date.getHours <= 7){ 
        updateCalendar();
    }
}, 1000*60*60*6); 

function checkForMessages() {
    // call wuy.checkForMessages, continue checking, set timer for 5 hours
    // if nothing new in 5 hours, go ahead and go to default message

    // updateMessageInfo('&#9758; Nouveau! &#9756;', time, from, text)

    // default message
    updateMessageInfo('Boîte de Réception', null, 'Passes une bonne journée! \n Bisous, Anna')

    // now this would obviously be better to come from backend and alert hmmmm
}

async function updateCalendar() {
    console.log('gonna update cal');
    // let events = await wuy.calendarEvents();
    // console.log(events);
    // 2019-09-12T10:00:00-07:00 :: iso format
    // list of events : summary, start, allday
    let events = [{summary:'birthday', start:'2019-09-12T10:00:00-07:00', allday: false}]

    let date = new Date();
    let dayOfWeek = date.getDay();
    let agenda = [];

    for (let i = 0; i < 4; i++) {
        agenda.push({
            day: dayOfWeek + i,
            date: date.setDate(date.getDate() + 1),
            events: []
        });
    }
    console.log(agenda);

    for (let e of events) {
        console.log(e);
        let d = new Date('2019-09-12T10:00:00-07:00 ');
        console.log(d);
        let agendaItem = agenda.filter((item) => {
            if (item.date === d) return item;
        });
        console.log(agendaItem);
    }

    // now this would obviously be better to come from backend and alert hmmmm
}

// update area with #message-time with new message time
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
    let month = convertMonth(date.getMonth());
    let day = convertDay(date.getDay());
    let numeral = date.getDate();
    return day + ', ' + numeral + ' ' + month;
}

function formatTime(time) {
    let hours = time.getHours();
    let minutes = time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes();
    return hours + ':' + minutes;
}
            
function getTime() {
    let dt = new Date();
    let time = formatTime(dt);
    document.getElementById('time').innerHTML = time;
}

function getDate() {
    let dt = new Date();
    let date = formatDate(dt);
    document.getElementById('date').innerHTML = date;
}

function getDateTime() {
    getTime();
    getDate();
    setDateTimeDelay();
}

function setDateTimeDelay() {
    mydate=setTimeout('getDateTime()', 10000)
}