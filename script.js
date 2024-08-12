const stationsList = ["شهید دستغیب", "شهید دوران", "فرصت شیرازی", "جانبازان", "غدیر", "رازی", "فضیلت", "کاوه", "ولیعصر", "وکیل الرعایا", "زندیه", "امام حسین", "نمازی", "شهید آوینی", "شهید مطهری", "قصردشت", "شاهد", "میرزای‌شیرازی", "دکتر شریعتی", "احسان"];


const scheduleTimesForward = 
{
        "شهید دستغیب": { "start": "06:10", "end": "22:10" },
        "شهید دوران": { "start": "06:12", "end": "22:12" },
        "فرصت شیرازی": { "start": "06:14", "end": "22:14" },
        "جانبازان": { "start": "06:16", "end": "22:16" },
        "غدیر": { "start": "06:18", "end": "22:18" },
        "رازی": { "start": "06:20", "end": "22:20" },
        "فضیلت": { "start": "06:22", "end": "22:22" },
        "کاوه": { "start": "06:24", "end": "22:24" },
        "ولیعصر": { "start": "06:26", "end": "22:26" },
        "وکیل الرعایا": { "start": "06:28", "end": "22:28" },
        "زندیه": { "start": "06:30", "end": "22:30" },
        "امام حسین": { "start": "06:32", "end": "22:32" },
        "نمازی": { "start": "06:34", "end": "22:34" },
        "شهید آوینی": { "start": "06:36", "end": "22:36" },
        "شهید مطهری": { "start": "06:38", "end": "22:38" },
        "قصردشت": { "start": "06:42", "end": "22:42" },
        "شاهد": { "start": "06:45", "end": "22:45" },
        "میرزای‌شیرازی": { "start": "06:49", "end": "22:49" },
        "دکتر شریعتی": { "start": "06:50", "end": "22:50" },
};

const scheduleTimesHolidayForward = 
{
    "شهید دستغیب": { "start": "07:10", "end": "21:10" },
    "شهید دوران": { "start": "07:12", "end": "21:12" },
    "فرصت شیرازی": { "start": "07:14", "end": "21:14" },
    "جانبازان": { "start": "07:16", "end": "21:16" },
    "غدیر": { "start": "07:18", "end": "21:18" },
    "رازی": { "start": "07:20", "end": "21:20" },
    "فضیلت": { "start": "07:22", "end": "21:22" },
    "کاوه": { "start": "07:24", "end": "21:24" },
    "ولیعصر": { "start": "07:26", "end": "21:26" },
    "وکیل الرعایا": { "start": "07:28", "end": "21:28" },
    "زندیه": { "start": "07:30", "end": "21:30" },
    "امام حسین": { "start": "07:32", "end": "21:32" },
    "نمازی": { "start": "07:34", "end": "21:34" },
    "شهید آوینی": { "start": "07:36", "end": "21:36" },
    "شهید مطهری": { "start": "07:38", "end": "21:38" },
    "قصردشت": { "start": "07:42", "end": "21:42" },
    "شاهد": { "start": "07:45", "end": "21:45" },
    "میرزای‌شیرازی": { "start": "07:49", "end": "21:49" },
    "دکتر شریعتی": { "start": "07:50", "end": "21:50" },
}

const scheduleTimesBackward = 
{
    "احسان": { "start": "06:05", "end": "22:05" },
    "دکتر شریعتی": { "start": "06:07", "end": "22:07" },
    "میرزای‌شیرازی": { "start": "06:09", "end": "22:09" },
    "شاهد": { "start": "06:13", "end": "22:13" },
    "قصردشت": { "start": "06:15", "end": "22:15" },
    "شهید مطهری": { "start": "06:19", "end": "22:19" },
    "شهید آوینی": { "start": "06:21", "end": "22:21" },
    "نمازی": { "start": "06:23", "end": "22:23" },
    "امام حسین": { "start": "06:26", "end": "22:26" },
    "زندیه": { "start": "06:28", "end": "22:28" },
    "وکیل الرعایا": { "start": "06:30", "end": "22:30" },
    "ولیعصر": { "start": "06:32", "end": "22:32" },
    "کاوه": { "start": "06:34", "end": "22:34" },
    "فضیلت": { "start": "06:36", "end": "22:36" },
    "رازی": { "start": "06:38", "end": "22:38" },
    "غدیر": { "start": "06:40", "end": "22:40" },
    "جانبازان": { "start": "06:42", "end": "22:42" },
    "فرصت شیرازی": { "start": "06:44", "end": "22:44" },
    "شهید دوران": { "start": "06:46", "end": "22:46" },
};
    
const scheduleTimesHolidayBackward =
{
    "احسان": { "start": "07:05", "end": "21:05" },
    "دکتر شریعتی": { "start": "07:07", "end": "21:07" },
    "میرزای‌شیرازی": { "start": "07:09", "end": "21:09" },
    "شاهد": { "start": "07:13", "end": "21:13" },
    "قصردشت": { "start": "07:15", "end": "21:15" },
    "شهید مطهری": { "start": "07:19", "end": "21:19" },
    "شهید آوینی": { "start": "07:21", "end": "21:21" },
    "نمازی": { "start": "07:23", "end": "21:23" },
    "امام حسین": { "start": "07:26", "end": "21:26" },
    "زندیه": { "start": "07:28", "end": "21:28" },
    "وکیل الرعایا": { "start": "07:30", "end": "21:30" },
    "ولیعصر": { "start": "07:32", "end": "21:32" },
    "کاوه": { "start": "07:34", "end": "21:34" },
    "فضیلت": { "start": "07:36", "end": "21:36" },
    "رازی": { "start": "07:38", "end": "21:38" },
    "غدیر": { "start": "07:40", "end": "21:40" },
    "جانبازان": { "start": "07:42", "end": "21:42" },
    "فرصت شیرازی": { "start": "07:44", "end": "21:44" },
    "شهید دوران": { "start": "07:46", "end": "21:46" },
}


function populateStations() {
    const startSelect = document.getElementById('start');
    const destinationSelect = document.getElementById('destination');
    
    stationsList.forEach(station => {
        const optionStart = document.createElement('option');
        optionStart.value = station;
        optionStart.textContent = station;
        startSelect.appendChild(optionStart);

        const optionDest = document.createElement('option');
        optionDest.value = station;
        optionDest.textContent = station;
        destinationSelect.appendChild(optionDest);
    });
}

function generateTimes(startTime, endTime, intervalMinutes) {
    const times = [];
    let currentTime = new Date(`1970-01-01T${startTime}:00`);
    const endDate = new Date(`1970-01-01T${endTime}:00`);
    
    while (currentTime <= endDate) {
        times.push(currentTime.toTimeString().substr(0, 5)); 
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
    
    return times;
}

let FORWARD = true;

function calculateTripTime(startIndex, destinationIndex) {
    let tripTime = 0;
    if (startIndex < destinationIndex) 
        {
            for (let i = startIndex + 1; i <= destinationIndex; i++) {
                if (i === 16 || i === 18) {
                    tripTime += 4;
                } else if (i === 17) {
                    tripTime += 3;
                } else if (i === 19) {
                    tripTime += 1;
                } else {
                    tripTime += 2;
                }
            }
        } else 
        {
            FORWARD = false;
            for (let i = startIndex - 1; i >= destinationIndex; i--) 
                {
                    if (i === 17 || i === 15) 
                    {
                        tripTime += 4;
                    } else if (i === 12) 
                    {
                        tripTime += 3;
                    } else 
                    {
                        tripTime += 2;
                    }
                }
        }
    
    
    return tripTime;
}


function addTripTime(startTimes, tripDuration) {
    return startTimes.map(startTime => {
        const departure = new Date(`1970-01-01T${startTime}:00`);
        const arrival = new Date(departure.getTime() + tripDuration * 60000);
        const arrivalTime = arrival.toTimeString().substr(0, 5);
        return {
            departure: startTime,
            arrival: arrivalTime
        };
    });
}

function checkSelection() {
    const startStation = document.getElementById('start').value;
    const destinationStation = document.getElementById('destination').value;
    const calculateButton = document.getElementById('calculate');
    
    if (startStation === "" || destinationStation === "" || startStation === destinationStation) {
        calculateButton.disabled = true;
    } else {
        calculateButton.disabled = false;
    }
}

function displaySchedule(schedule) {
    const now = new Date();
    const nowTime = now.getHours() * 60 + now.getMinutes();
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = '';

    schedule.forEach(({ departure, arrival }) => {
        const [depHours, depMinutes] = departure.split(':').map(Number);
        const [arrHours, arrMinutes] = arrival.split(':').map(Number);
        
        const departureTime = depHours * 60 + depMinutes;
        const arrivalTime = arrHours * 60 + arrMinutes;

        let status = 'missed';
        if (departureTime > nowTime) {
            status = 'future';
        }

        const scheduleItem = document.createElement('div');
        scheduleItem.className = `schedule-item ${status}`;
        scheduleItem.innerHTML = `
            <span class="departure-time">حرکت‌ازمبدا: ${departure}</span>
            <span class="arrival-time">رسیدن‌به‌مقصد: ${arrival}</span>
        `;
        scheduleContainer.appendChild(scheduleItem);
    });
}

document.getElementById('calculate').addEventListener('click', function() {
    const startStation = document.getElementById('start').value;
    const destinationStation = document.getElementById('destination').value;
    const isHoliday = document.getElementById('holiday').checked;


    const startIndex = stationsList.indexOf(startStation);
    const destinationIndex = stationsList.indexOf(destinationStation);
    const tripDuration = calculateTripTime(startIndex, destinationIndex);

    if (FORWARD){
        if (isHoliday) {
            ({ start: startTime, end: endTime } = scheduleTimesHolidayForward[startStation]);
        }else {
            ({ start: startTime, end: endTime } = scheduleTimesForward[startStation]);
        }
    } else {
        if (isHoliday) {
            ({ start: startTime, end: endTime } = scheduleTimesHolidayBackward[startStation]);
        }else {
            ({ start: startTime, end: endTime } = scheduleTimesBackward[startStation]);
        }
    }


    const schedule = generateTimes(startTime, endTime, 15);
    const tripSchedule = addTripTime(schedule, tripDuration);

    displaySchedule(tripSchedule);
});


populateStations();