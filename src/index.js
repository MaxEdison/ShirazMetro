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

// Utility functions
const calculateTripTime = (startIndex, destinationIndex, isForward) => {
  let tripTime = 0;
  if (isForward) {
    for (let i = startIndex + 1; i <= destinationIndex; i++) {
      tripTime += i === 16 || i === 18 ? 4 : i === 17 ? 3 : i === 19 ? 1 : 2;
    }
  } else {
    for (let i = startIndex - 1; i >= destinationIndex; i--) {
      tripTime += i === 17 || i === 15 ? 4 : i === 12 ? 3 : 2;
    }
  }
  return tripTime;
};

const generateTimes = (startTime, endTime, intervalMinutes) => {
  const times = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const endDate = new Date(`1970-01-01T${endTime}:00`);
  while (currentTime <= endDate) {
    times.push(currentTime.toTimeString().substr(0, 5));
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

  // Validation
  if (!startStation || !destinationStation) {
    return new Response(JSON.stringify({ 
      error: 'startStation and destinationStation are required' 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  const isForward = stationsList.indexOf(startStation) < stationsList.indexOf(destinationStation);
  const tripDuration = calculateTripTime(
    stationsList.indexOf(startStation),
    stationsList.indexOf(destinationStation),
    isForward,
  );

  const scheduleData = holiday === "true"
    ? isForward
      ? scheduleTimesHolidayForward
      : scheduleTimesHolidayBackward
    : isForward
      ? scheduleTimesForward
      : scheduleTimesBackward;

  const startTimes = generateTimes(
    scheduleData[startStation].start,
    scheduleData[startStation].end,
    5,
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
          schedules: '/api/v1/scedules/calculate?startStation=STATION&destinationStation=STATION&holiday=true/false'
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

    if (pathname === '/api/v1/scedules/calculate') {
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