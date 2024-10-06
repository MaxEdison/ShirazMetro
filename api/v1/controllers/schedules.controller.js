const {
  stationsList,
  scheduleTimesForward,
  scheduleTimesHolidayForward,
  scheduleTimesBackward,
  scheduleTimesHolidayBackward,
} = require("../utils/data");

const calculateTripTime = (startIndex, destinationIndex, isForward) => {
  let tripTime = 0;
  if (isForward) {
    for (let i = startIndex + 1; i <= destinationIndex; i++) {
      // Add conditions based on your original logic
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

const getSchedule = (req, res) => {
  const { startStation, destinationStation, holiday } = req.query;

  const isForward =
    stationsList.indexOf(startStation) <
    stationsList.indexOf(destinationStation);
  const tripDuration = calculateTripTime(
    stationsList.indexOf(startStation),
    stationsList.indexOf(destinationStation),
    isForward,
  );

  const scheduleData =
    holiday === "true"
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

  res.json({
    startStation,
    destinationStation,
    schedule: fullSchedule,
    tripDuration,
  });
};

module.exports = {
  getSchedule,
};
