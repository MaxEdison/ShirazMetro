import {
    scheduleTimesForward,
    scheduleTimesBackward,
} from '../data/data.js';

import { calculateClockDistances } from '../utils/timeUtils.js';

export const calcualteTripTime = (startStation, destinationStation, isForward, line) => {
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