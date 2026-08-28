import {
    scheduleTimesForward,
    scheduleTimesBackward,
} from '../data/data.js';

import { calculateClockDistances } from '../utils/timeUtils.js';

export const calculateTripTime = (startStation, destinationStation, isForward, line) => {
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

export const generateTimes = (startTime, endTime, intervalMinutes, MODE, line) => {
  const times = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const endDate = new Date(`1970-01-01T${endTime}:00`);

  for (let i = 0; currentTime <= endDate; i++) {
    const timeString = currentTime.toTimeString().substr(0, 5);
    times[i] = timeString;
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }
  return times;
};

export const addTripTime = (startTimes, tripDuration) => {
  return startTimes.map((startTime) => {
    const departure = new Date(`1970-01-01T${startTime}:00`);
    const arrival = new Date(departure.getTime() + tripDuration * 60000);
    return {
      departure: startTime,
      arrival: arrival.toTimeString().substr(0, 5),
    };
  });
};
