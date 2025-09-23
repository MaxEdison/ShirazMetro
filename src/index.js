// Import the data and utility functions
import { 
  stationsList, 
  scheduleTimesForward, 
  scheduleTimesHolidayForward, 
  scheduleTimesBackward, 
  scheduleTimesHolidayBackward 
} from './data.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


function timeToDate(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Calculate sequential durations in minutes
function calculateClockDistances(schedule) {
    const stations = Object.keys(schedule);
    const distances = {};

    for (let i = 1; i < stations.length; i++) {
        const prevStation = stations[i - 1];
        const currStation = stations[i];

        let prevTime = timeToDate(schedule[prevStation].start);
        let currTime = timeToDate(schedule[currStation].start);

        // Calculate absolute difference in minutes, because Backward schedule can have earlier times
        let duration = Math.abs((currTime - prevTime) / 60000);
        distances[i-0] = duration;
    }

    return distances;
}


// Utility functions
const calculateTripTime = (startStation, destinationStation, isForward, line) => {
  let tripTime = 0;
  
  const durations = calculateClockDistances(
    isForward ? scheduleTimesForward[line] : scheduleTimesBackward[line]
  );
  

  if (isForward) {
    const stations = Object.keys(scheduleTimesForward[line]);
    const startIndex = stations.indexOf(startStation);
    const destinationIndex = stations.indexOf(destinationStation);

    for (let i = startIndex + 1; i <= destinationIndex; i++) {
      tripTime += durations[i]; 
    }
    
  } else {
    
    const stations = Object.keys(scheduleTimesBackward[line]);
    const startIndex = stations.indexOf(startStation);
    const destinationIndex = stations.indexOf(destinationStation);

    for (let i = startIndex + 1; i <= destinationIndex; i++) {
      tripTime += durations[i]; 
    }

  }
  return tripTime;
};

const generateTimes = (startTime, endTime, intervalMinutes, MODE, line) => {
  const times = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const endDate = new Date(`1970-01-01T${endTime}:00`);

  for (let i = 0; currentTime <= endDate; i++) {
    if (line === 'line1') {
      if (i === 0 && MODE === 0) {
        intervalMinutes = 20;
      } else {
        intervalMinutes = 15; 
      }
    }
    const timeString = currentTime.toTimeString().substr(0, 5);
    times[i] = timeString; 
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }
  return times;
};

const addTripTime = (startTimes, tripDuration) => {
  return startTimes.map((startTime) => {
    const departure = new Date(`1970-01-01T${startTime}:00`);
    const arrival = new Date(departure.getTime() + tripDuration * 60000);
    return {
      departure: startTime,
      arrival: arrival.toTimeString().substr(0, 5),
    };
  });
};

// Route handlers
const getStations = () => {
  return new Response(JSON.stringify(stationsList), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
};

const getSchedule = (url) => {
  const { searchParams } = new URL(url);
  const startStation = searchParams.get('startStation');
  const destinationStation = searchParams.get('destinationStation');
  const holiday = searchParams.get('holiday'); 
  const line = searchParams.get('line');


  if (!startStation || !destinationStation || !holiday || holiday != 'yes' && holiday != 'no') {
    return new Response(JSON.stringify({ 
      error: 'startStation, destinationStation and holiday(yes or no) parameters are required' 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  const stations = stationsList[line].stations;

  const isForward = stations.indexOf(startStation) < stations.indexOf(destinationStation);
  const tripDuration = calculateTripTime(
    startStation,
    destinationStation,
    isForward,
    line,
  );

  let startTime, endTime;
  var MODE;

  if (isForward){
    if (holiday === 'yes') {
      ({ start: startTime, end: endTime } = scheduleTimesHolidayForward[line][startStation]);
      MODE = 1; // Holiday Forward
    }else {
      ({ start: startTime, end: endTime } = scheduleTimesForward[line][startStation]);
      MODE = 0; // Forward
    }
  } else {
    if (holiday === 'yes') {
      ({ start: startTime, end: endTime } = scheduleTimesHolidayBackward[line][startStation]);
      MODE = 3; // Holiday Backward
    }else {
      ({ start: startTime, end: endTime } = scheduleTimesBackward[line][startStation]);
      MODE = 2; // Backward
    } 
  }

  // Now it should set the mode in `generateTimes` function 
  // MODE = 0 ~> FORWARD
  // MODE = 1 ~> HOLIDAY FORWARD
  // MODE = 2 ~> BACKWARD
  // MODE = 3 ~> HOLIDAY BACKWARD

  const startTimes = generateTimes(
    startTime,
    endTime,
    stationsList[line].interval_time,
    MODE,
    line,
  );


  const fullSchedule = addTripTime(startTimes, tripDuration);

  return new Response(JSON.stringify({
    startStation,
    destinationStation,
    schedule: fullSchedule,
    tripDuration,
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
};

// Main worker handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    // Route handling
    if (pathname === '/' || pathname === '/api') {
      return new Response(JSON.stringify({ 
        message: 'This is Shiraz Subway API',
        version: '1.0.0',
        endpoints: {
          stations: '/api/v1/stations/stations',
          schedules: '/api/v1/schedules/calculate?startStation=STATION&destinationStation=STATION&holiday=yes/no,line=line1/line2'
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (pathname === '/api/v1/stations/stations') {
      return getStations();
    }

    if (pathname === '/api/v1/schedules/calculate') {
      return getSchedule(request.url);
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ 
      error: 'Not Found',
      message: 'The requested endpoint does not exist'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  },
};