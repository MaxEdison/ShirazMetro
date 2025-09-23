const API_URL = "http://localhost:8787/api/v1";

let metroData = {};

async function fetchStations() {
    try {
        const response = await fetch(`${API_URL}/stations/stations`);
        metroData = await response.json();
        loadStations('line1'); 
    } catch (error) {
        console.error("Error fetching stations:", error);
    }
}

function loadStations(line) {
    const startSelect = document.getElementById('start');
    const destinationSelect = document.getElementById('destination');

    startSelect.innerHTML = '<option value="">انتخاب ایستگاه مبدا</option>';
    destinationSelect.innerHTML = '<option value="">انتخاب ایستگاه مقصد</option>';

    metroData[line].stations.forEach(station => {
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

document.addEventListener('DOMContentLoaded', () => {
    fetchStations();

    const tabs = document.querySelectorAll('.switch-btn');
    const slider = document.querySelector('.switch-slider');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            slider.style.right = `${index * 50}%`;

            if (tab.dataset.line === "line1") {
                slider.style.background = "#db0000"; 
            } else if (tab.dataset.line === "line2") {
                slider.style.background = "#047a00ff";
            }

            loadStations(tab.dataset.line);
        });
    });

});





function checkSelection() {
    const startStation = document.getElementById('start').value;
    const destinationStation = document.getElementById('destination').value;
    const calculateButton = document.getElementById('calculate');
    const scheduleContainer = document.getElementById('schedule');

    scheduleContainer.classList.remove('show');

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

    let nextTrainItem = null;
    let hasResults = false;
    let currentTimeFound = false;

    schedule.forEach(({ departure, arrival }) => {
        const [depHours, depMinutes] = departure.split(':').map(Number);
        const [arrHours, arrMinutes] = arrival.split(':').map(Number);
        
        const departureTime = depHours * 60 + depMinutes;
        const arrivalTime = arrHours * 60 + arrMinutes;

        let status = 'missed';
        let isCurrentTime = false;
        let isNearTime = false;
        
        if (departureTime > nowTime) {
            status = 'future';
            const timeDiff = departureTime - nowTime;

            if (timeDiff <= 2 && timeDiff >= 0) {
                isCurrentTime = true;
                isNearTime = true;
                currentTimeFound = true;
            }

            if (!nextTrainItem) {
                nextTrainItem = true;
            }
        }

        const scheduleItem = document.createElement('div');
        scheduleItem.className = `schedule-item ${status}`;

        if (isCurrentTime) {
            scheduleItem.classList.add('current-time');
        }

        if (isNearTime) {
            scheduleItem.classList.add('near-time');
        }

        if (status === 'future' && nextTrainItem === true) {
            scheduleItem.id = 'next-train';
            nextTrainItem = scheduleItem;
        }

        scheduleItem.innerHTML = `
            <span class="departure-time">حرکت‌ازمبدا: ${departure}</span>
            <span class="arrival-time">رسیدن‌به‌مقصد: ${arrival}</span>
        `;
        scheduleContainer.appendChild(scheduleItem);
        hasResults = true;
    });

    if (hasResults) {
        scheduleContainer.classList.add('show');

        setTimeout(() => {
            let targetElement = null;
            const currentTimeElement = scheduleContainer.querySelector('.current-time');

            if (currentTimeElement) {
                targetElement = currentTimeElement;
            } else if (nextTrainItem && nextTrainItem !== true) {
                targetElement = nextTrainItem;
            }

            if (targetElement) {
                 targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);               
    } else {
        scheduleContainer.classList.remove('show');
    }
}

document.getElementById('calculate').addEventListener('click', async function() {
    const startStation = document.getElementById('start').value;
    const destinationStation = document.getElementById('destination').value;
    const isHoliday = document.getElementById('holiday').checked;

    try {
        const response = await fetch(
            `${API_URL}/schedules/calculate?startStation=${encodeURIComponent(startStation)}&destinationStation=${encodeURIComponent(destinationStation)}&holiday=${isHoliday ? 'yes' : 'no'}`
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        displaySchedule(data.schedule);
    } catch (error) {
        console.error("Error fetching schedule:", error);
    }
});


populateStations();