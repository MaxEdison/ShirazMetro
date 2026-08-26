import express from 'express';

const app = express();

const API_INFO = {
  message: 'Welcome to the ShirazMetro API!',
  version: '1.0.0',
  endpoints: {
    stations: '/api/v1/stations/stations',
    schedules: '/api/v1/schedules/calculate?startStation=STATION&destinationStation=STATION&holiday=yes/no&line=line1/line2'
  }
};

app.get('/', (req, res) => {
  res.json(API_INFO);
});

app.get('/api', (req, res) => {
  res.json(API_INFO);
});

export default app;