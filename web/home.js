
window.onload = function() {
    getDateTime();
}

// update area with #message-time with new message time

// update area with #message-body

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