export function timeToDate(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export function calculateClockDistances(schedule) {
    const stations = Object.keys(schedule);
    const distances = {};

    for (let i = 1; i < stations.length; i++) {
        const prevStation = stations[i - 1];
        const currStation = stations[i];

        const prevTime = timeToDate(schedule[prevStation].start);
        const currTime = timeToDate(schedule[currStation].start);

        // Calculate absolute difference in minutes, because Backward schedule can have earlier times
        const duration = Math.abs((currTime - prevTime) / 60000);
        distances[i] = duration;
    }

    return distances;
}
