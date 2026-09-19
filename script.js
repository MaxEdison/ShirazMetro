const API_URL = "https://shirazmetro-api.neda1.paasta.app/api/v1";
//const API_URL = "https://api.shiraz-metro.workers.dev/api/v1";
// const API_URL = "https://metro.sudoshz.ir/api/v1";
let metroData = {};
let line = "line1";

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
    const startOptions = document.getElementById('start-options');
    const destinationOptions = document.getElementById('destination-options');

    const startSelected = document.getElementById('start-selected');
    const destinationSelected = document.getElementById('destination-selected');

    // Reset selected stations
    startSelected.textContent = 'انتخاب ایستگاه مبدا';
    destinationSelected.textContent = 'انتخاب ایستگاه مقصد';

    // Store selected values
    document.getElementById('start-select').dataset.value = '';
    document.getElementById('destination-select').dataset.value = '';

    // Clear previous options
    startOptions.innerHTML = '';
    destinationOptions.innerHTML = '';

    metroData[line].stations.forEach(station => {
        // Start station
        const startOption = document.createElement('div');
        startOption.className = 'station-option';
        startOption.textContent = station;
        startOption.dataset.value = station;

        startOptions.appendChild(startOption);

        // Destination station
        const destinationOption = document.createElement('div');
        destinationOption.className = 'station-option';
        destinationOption.textContent = station;
        destinationOption.dataset.value = station;

        destinationOptions.appendChild(destinationOption);
    });
}

function setupStationDropdown(selectId, buttonId, selectedId, searchId, optionsId) {
    const select = document.getElementById(selectId);
    const button = document.getElementById(buttonId);
    const selected = document.getElementById(selectedId);
    const search = document.getElementById(searchId);
    const options = document.getElementById(optionsId);
    const dropdown = select.querySelector('.station-dropdown');

    button.addEventListener('click', () => {
        const isOpen = dropdown.classList.contains('open');

        closeAllDropdowns();

        if (!isOpen) {
            dropdown.classList.add('open');
            button.classList.add('open');

            search.value = '';
            filterStations(options, '');

            setTimeout(() => {
                search.focus();
            }, 50);
        }
    });

    search.addEventListener('input', () => {
        filterStations(options, search.value);
    });

    options.addEventListener('click', (event) => {
        const option = event.target.closest('.station-option');

        if (!option) {
            return;
        }

        const value = option.dataset.value;

        select.dataset.value = value;
        selected.textContent = value;

        options.querySelectorAll('.station-option').forEach(item => {
            item.classList.remove('selected');
        });

        option.classList.add('selected');

        dropdown.classList.remove('open');
        button.classList.remove('open');

        checkSelection();
    });
}

function filterStations(optionsContainer, searchText) {
    const search = searchText.trim().toLowerCase();
    const options = optionsContainer.querySelectorAll('.station-option');

    let visibleCount = 0;

    options.forEach(option => {
        const stationName = option.textContent.toLowerCase();

        if (stationName.includes(search)) {
            option.style.display = 'block';
            visibleCount++;
        } else {
            option.style.display = 'none';
        }
    });

    let noResults = optionsContainer.querySelector('.station-no-results');

    if (visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'station-no-results';
            noResults.textContent = 'ایستگاهی پیدا نشد';
            optionsContainer.appendChild(noResults);
        }
    } else if (noResults) {
        noResults.remove();
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.station-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
    });

    document.querySelectorAll('.station-select-button').forEach(button => {
        button.classList.remove('open');
    });
}

function checkSelection() {
    const startStation = document.getElementById('start-select').dataset.value;
    const destinationStation = document.getElementById('destination-select').dataset.value;

    const calculateButton = document.getElementById('calculate');
    const scheduleContainer = document.getElementById('schedule');

    scheduleContainer.classList.remove('show');

    if (
        startStation === "" ||
        destinationStation === "" ||
        startStation === destinationStation
    ) {
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
    if (schedule.length === 0) {
        const noServiceItem = document.createElement('div');
        noServiceItem.className = 'schedule-item no-service';
        scheduleContainer.classList.add('show')
        noServiceItem.textContent = "مترو در این روز خدمات رسانی ندارد";
        scheduleContainer.appendChild(noServiceItem);
    } else{

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

}


async function loadContributors() {
    const owner = "MaxEdison";
    const repo = "ShirazMetro";
    const list = document.getElementById("contributors-list");

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`);
        if (!response.ok) throw new Error("GitHub API error");

        const contributors = await response.json();

        contributors.sort((a, b) => b.contributions - a.contributions);

        if (contributors.length === 0) {
            list.innerHTML = "<p>هیچ مشارکت کننده ای یافت نشد</p>";
            return;
        }

        list.innerHTML = "";

        contributors.forEach(user => {
            const div = document.createElement("a");
            div.className = "contributor";
            div.href = user.html_url;
            div.target = "_blank";
            div.title = `${user.login} – ${user.contributions} commit`;

            div.innerHTML = `
                <img src="${user.avatar_url}&s=112" alt="${user.login}" loading="lazy">
                <span>${user.login}</span>
            `;

            list.appendChild(div);
        });

    } catch (err) {
        console.error("Failed to load contributors:", err);
        list.innerHTML = `<p style="color:#c70e30;">خطا در بارگذاری مشارکت کنندگان</p>`;
    }
}



document.addEventListener('DOMContentLoaded', () => {
    fetchStations();

    setupStationDropdown(
        'start-select',
        'start-button',
        'start-selected',
        'start-search',
        'start-options'
    );

    setupStationDropdown(
        'destination-select',
        'destination-button',
        'destination-selected',
        'destination-search',
        'destination-options'
    );

    const tabs = document.querySelectorAll('.switch-btn');
    const slider = document.querySelector('.switch-slider');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            slider.style.right = `${index * 50}%`;

            line = tab.dataset.line;

            if (line === "line1") {
                slider.style.background = "#db0000"; 
                // document.querySelector('.label-text').textContent = "روز تعطیل یا پنجشنبه ؟";
            } else if (line === "line2") {
                slider.style.background = "#047a00ff";
                // document.querySelector('.label-text').textContent = "روز تعطیل؟";
                
            }


            loadStations(line);
        });
    });
    loadContributors();

});

document.getElementById('calculate').addEventListener('click', async function() {
    const startStation = document.getElementById('start-select').dataset.value;
    const destinationStation = document.getElementById('destination-select').dataset.value;
    const isHoliday = document.getElementById('holiday').checked;

    try {
        const response = await fetch(
            `${API_URL}/schedules/calculate?startStation=${encodeURIComponent(startStation)}&destinationStation=${encodeURIComponent(destinationStation)}&holiday=${isHoliday ? 'yes' : 'no'}&line=${encodeURIComponent(line)}`
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



const btn = document.getElementById("donateToggle");
const content = document.getElementById("donateContent");
const arrow = document.getElementById("donateArrow");

btn.addEventListener("click", () => {
    content.classList.toggle("open");
    arrow.classList.toggle("open");
});

// Closing the dropdown when clicking outside it
document.addEventListener('click', (event) => {
    if (!event.target.closest('.station-select')) {
        closeAllDropdowns();
    }
});
