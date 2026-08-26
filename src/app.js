import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the ShirazMetro API!',
    version: '1.0.0',
    endpoints:{
        stations: '/api/v1/stations/stations',
        schedules: '/api/v1/schedules/calculate?startStation=STATION&destinationStation=STATION&holiday=yes/no&line=line1/line2'
    }
   });
});

export default app;