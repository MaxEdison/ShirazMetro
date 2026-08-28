import { stationsList } from "../data/data.js";

export const getStations = (req, res) => {
    res.json(stationsList);
};