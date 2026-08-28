import { stationsList } from "../data/data";

export const getStations = (req, res) => {
    res.json(stationsList);
};