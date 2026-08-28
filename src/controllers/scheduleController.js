import {
    stationsList,
    scheduleTimesForward,
    scheduleTimesHolidayForward,
    scheduleTimesBackward,
    scheduleTimesHolidayBackward,
} from '../data/data.js';

import { 
    calculateTripTime, 
    generateTimes, 
    addTripTime 
} from '../services/scheduleService.js';

export const getSchedule = (req, res) => {
    const reeq = req.query;

    const startStation = reeq.startStation;
    const destinationStation = reeq.destinationStation;
    const holiday = reeq.holiday;
    const line = reeq.line;

    if (!stationsList[line]) {
        return res.status(400).json({ error: 'Invalid line parameter' });
    }

    if (!stationsList[line].stations.includes(startStation) || !stationsList[line].stations.includes(destinationStation)) {
        return res.status(400).json({ 
            error: 'Invalid startStation or destinationStation for the given line' 
        });
    }

    if (!startStation || !destinationStation || !holiday || holiday !== 'yes' && holiday !== 'no' || !line) {
        return res.status(400).json({ error: 'Parameters are missing or invalid' });
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

    if (isForward) {
        if (holiday === 'yes') {
            ({start: startTime, end: endTime} = scheduleTimesHolidayForward[line][startStation]);
            MODE = 1; // Holiday Forward
        } else {
            ({start: startTime, end: endTime} = scheduleTimesForward[line][startStation]);
            MODE = 0; // Forward
        }
    } else {
        if (holiday === 'yes') {
            ({start: startTime, end: endTime} = scheduleTimesHolidayBackward[line][startStation]);
            MODE = 3; // Holiday Backward
        } else {
            ({start: startTime, end: endTime} = scheduleTimesBackward[line][startStation]);
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

    res.json({
        startStation,
        destinationStation,
        schedule: fullSchedule,
        tripDuration,
    });
}