# 🚇 ShirazMetro-API
Files and configurations for deploying ShirazMetro API on CloudFlare Worker

## 👨‍💻 Main Developer

This project would not exist without the amazing work of [Parsa Bordbar](https://github.com/ParsaBordbar).  
He is the **main developer** of this API, and I want to give him a huge shout-out for making this happen! 🎉

### 📍 Get All Stations
Fetch a list of all metro stations.

**Endpoint:**
```
GET /api/v1/stations/stations
```

**Example:**
```bash
curl https://shirazmetro-api.amirhossein-heidari-email.workers.dev/api/v1/stations/stations
```

**Response:**
```json
[
  "شهید دستغیب",
  "شهید دوران",
  "فرصت شیرازی",
  "جانبازان",
  "غدیر",
]
```

---

### ⏱️ Calculate Schedule
Get travel time and schedule between two stations.

**Endpoint:**
```
GET /api/v1/scedules/calculate?startStation=STATION&destinationStation=STATION&holiday=true/false
```

**Parameters:**
- `startStation` – starting station name (string in Farsi)  
- `destinationStation` – destination station name (string in Farsi)  
- `holiday` – whether to calculate for holiday schedule (`true` or `false`)  

**Example:**
```bash
curl "https://shirazmetro-api.amirhossein-heidari-email.workers.dev/api/v1/scedules/calculate?startStation=رازی&destinationStation=احسان&holiday=false"
```

**Response Fields:**
- `startStation` *(string)* → The name of the starting station.  
- `destinationStation` *(string)* → The name of the destination station.  
- `schedule` *(array of objects)* → A list of available trips between the two stations.  
  - `departure` *(string, HH:MM)* → Time when the train leaves the start station.  
  - `arrival` *(string, HH:MM)* → Time when the train arrives at the destination.  
- `tripDuration` *(number)* → Duration of the trip in minutes (same for all listed trips).  

**Response:**
```json
{
  "startStation": "رازی",
  "destinationStation": "احسان",
  "schedule": [
    {
      "departure": "05:30",
      "arrival": "06:02"
    },
    {
      "departure": "05:35",
      "arrival": "06:07"
    },
    {
      "departure": "05:40",
      "arrival": "06:12"
    },
    {
      "departure": "05:45",
      "arrival": "06:17"
    },
    {
      "departure": "05:50",
      "arrival": "06:22"
    },
    {
      "departure": "05:55",
      "arrival": "06:27"
    },
    {
      "departure": "06:00",
      "arrival": "06:32"
    },
    {
      "departure": "06:05",
      "arrival": "06:37"
    },
    {
      "departure": "06:10",
      "arrival": "06:42"
    },
    {
      "departure": "06:15",
      "arrival": "06:47"
    },
    {
      "departure": "06:20",
      "arrival": "06:52"
    },
    {
      "departure": "06:25",
      "arrival": "06:57"
    },
    {
      "departure": "06:30",
      "arrival": "07:02"
    },
    {
      "departure": "06:35",
      "arrival": "07:07"
    },
    {
      "departure": "06:40",
      "arrival": "07:12"
    },
    {
      "departure": "06:45",
      "arrival": "07:17"
    },
    {
      "departure": "06:50",
      "arrival": "07:22"
    },
    {
      "departure": "06:55",
      "arrival": "07:27"
    },
    {
      "departure": "07:00",
      "arrival": "07:32"
    },
    {
      "departure": "07:05",
      "arrival": "07:37"
    },
    {
      "departure": "07:10",
      "arrival": "07:42"
    },
    {
      "departure": "07:15",
      "arrival": "07:47"
    },
    {
      "departure": "07:20",
      "arrival": "07:52"
    },
    {
      "departure": "07:25",
      "arrival": "07:57"
    },
    {
      "departure": "07:30",
      "arrival": "08:02"
    },
    {
      "departure": "07:35",
      "arrival": "08:07"
    },
    {
      "departure": "07:40",
      "arrival": "08:12"
    },
    {
      "departure": "07:45",
      "arrival": "08:17"
    },
    {
      "departure": "07:50",
      "arrival": "08:22"
    },
    {
      "departure": "07:55",
      "arrival": "08:27"
    },
    {
      "departure": "08:00",
      "arrival": "08:32"
    },
    {
      "departure": "08:05",
      "arrival": "08:37"
    },
    {
      "departure": "08:10",
      "arrival": "08:42"
    },
    {
      "departure": "08:15",
      "arrival": "08:47"
    },
    {
      "departure": "08:20",
      "arrival": "08:52"
    },
    {
      "departure": "08:25",
      "arrival": "08:57"
    },
    {
      "departure": "08:30",
      "arrival": "09:02"
    },
    {
      "departure": "08:35",
      "arrival": "09:07"
    },
    {
      "departure": "08:40",
      "arrival": "09:12"
    },
    {
      "departure": "08:45",
      "arrival": "09:17"
    },
    {
      "departure": "08:50",
      "arrival": "09:22"
    },
    {
      "departure": "08:55",
      "arrival": "09:27"
    },
    {
      "departure": "09:00",
      "arrival": "09:32"
    },
    {
      "departure": "09:05",
      "arrival": "09:37"
    },
    {
      "departure": "09:10",
      "arrival": "09:42"
    },
    {
      "departure": "09:15",
      "arrival": "09:47"
    },
    {
      "departure": "09:20",
      "arrival": "09:52"
    },
    {
      "departure": "09:25",
      "arrival": "09:57"
    },
    {
      "departure": "09:30",
      "arrival": "10:02"
    },
    {
      "departure": "09:35",
      "arrival": "10:07"
    },
    {
      "departure": "09:40",
      "arrival": "10:12"
    },
    {
      "departure": "09:45",
      "arrival": "10:17"
    },
    {
      "departure": "09:50",
      "arrival": "10:22"
    },
    {
      "departure": "09:55",
      "arrival": "10:27"
    },
    {
      "departure": "10:00",
      "arrival": "10:32"
    },
    {
      "departure": "10:05",
      "arrival": "10:37"
    },
    {
      "departure": "10:10",
      "arrival": "10:42"
    },
    {
      "departure": "10:15",
      "arrival": "10:47"
    },
    {
      "departure": "10:20",
      "arrival": "10:52"
    },
    {
      "departure": "10:25",
      "arrival": "10:57"
    },
    {
      "departure": "10:30",
      "arrival": "11:02"
    },
    {
      "departure": "10:35",
      "arrival": "11:07"
    },
    {
      "departure": "10:40",
      "arrival": "11:12"
    },
    {
      "departure": "10:45",
      "arrival": "11:17"
    },
    {
      "departure": "10:50",
      "arrival": "11:22"
    },
    {
      "departure": "10:55",
      "arrival": "11:27"
    },
    {
      "departure": "11:00",
      "arrival": "11:32"
    },
    {
      "departure": "11:05",
      "arrival": "11:37"
    },
    {
      "departure": "11:10",
      "arrival": "11:42"
    },
    {
      "departure": "11:15",
      "arrival": "11:47"
    },
    {
      "departure": "11:20",
      "arrival": "11:52"
    },
    {
      "departure": "11:25",
      "arrival": "11:57"
    },
    {
      "departure": "11:30",
      "arrival": "12:02"
    },
    {
      "departure": "11:35",
      "arrival": "12:07"
    },
    {
      "departure": "11:40",
      "arrival": "12:12"
    },
    {
      "departure": "11:45",
      "arrival": "12:17"
    },
    {
      "departure": "11:50",
      "arrival": "12:22"
    },
    {
      "departure": "11:55",
      "arrival": "12:27"
    },
    {
      "departure": "12:00",
      "arrival": "12:32"
    },
    {
      "departure": "12:05",
      "arrival": "12:37"
    },
    {
      "departure": "12:10",
      "arrival": "12:42"
    },
    {
      "departure": "12:15",
      "arrival": "12:47"
    },
    {
      "departure": "12:20",
      "arrival": "12:52"
    },
    {
      "departure": "12:25",
      "arrival": "12:57"
    },
    {
      "departure": "12:30",
      "arrival": "13:02"
    },
    {
      "departure": "12:35",
      "arrival": "13:07"
    },
    {
      "departure": "12:40",
      "arrival": "13:12"
    },
    {
      "departure": "12:45",
      "arrival": "13:17"
    },
    {
      "departure": "12:50",
      "arrival": "13:22"
    },
    {
      "departure": "12:55",
      "arrival": "13:27"
    },
    {
      "departure": "13:00",
      "arrival": "13:32"
    },
    {
      "departure": "13:05",
      "arrival": "13:37"
    },
    {
      "departure": "13:10",
      "arrival": "13:42"
    },
    {
      "departure": "13:15",
      "arrival": "13:47"
    },
    {
      "departure": "13:20",
      "arrival": "13:52"
    },
    {
      "departure": "13:25",
      "arrival": "13:57"
    },
    {
      "departure": "13:30",
      "arrival": "14:02"
    },
    {
      "departure": "13:35",
      "arrival": "14:07"
    },
    {
      "departure": "13:40",
      "arrival": "14:12"
    },
    {
      "departure": "13:45",
      "arrival": "14:17"
    },
    {
      "departure": "13:50",
      "arrival": "14:22"
    },
    {
      "departure": "13:55",
      "arrival": "14:27"
    },
    {
      "departure": "14:00",
      "arrival": "14:32"
    },
    {
      "departure": "14:05",
      "arrival": "14:37"
    },
    {
      "departure": "14:10",
      "arrival": "14:42"
    },
    {
      "departure": "14:15",
      "arrival": "14:47"
    },
    {
      "departure": "14:20",
      "arrival": "14:52"
    },
    {
      "departure": "14:25",
      "arrival": "14:57"
    },
    {
      "departure": "14:30",
      "arrival": "15:02"
    },
    {
      "departure": "14:35",
      "arrival": "15:07"
    },
    {
      "departure": "14:40",
      "arrival": "15:12"
    },
    {
      "departure": "14:45",
      "arrival": "15:17"
    },
    {
      "departure": "14:50",
      "arrival": "15:22"
    },
    {
      "departure": "14:55",
      "arrival": "15:27"
    },
    {
      "departure": "15:00",
      "arrival": "15:32"
    },
    {
      "departure": "15:05",
      "arrival": "15:37"
    },
    {
      "departure": "15:10",
      "arrival": "15:42"
    },
    {
      "departure": "15:15",
      "arrival": "15:47"
    },
    {
      "departure": "15:20",
      "arrival": "15:52"
    },
    {
      "departure": "15:25",
      "arrival": "15:57"
    },
    {
      "departure": "15:30",
      "arrival": "16:02"
    },
    {
      "departure": "15:35",
      "arrival": "16:07"
    },
    {
      "departure": "15:40",
      "arrival": "16:12"
    },
    {
      "departure": "15:45",
      "arrival": "16:17"
    },
    {
      "departure": "15:50",
      "arrival": "16:22"
    },
    {
      "departure": "15:55",
      "arrival": "16:27"
    },
    {
      "departure": "16:00",
      "arrival": "16:32"
    },
    {
      "departure": "16:05",
      "arrival": "16:37"
    },
    {
      "departure": "16:10",
      "arrival": "16:42"
    },
    {
      "departure": "16:15",
      "arrival": "16:47"
    },
    {
      "departure": "16:20",
      "arrival": "16:52"
    },
    {
      "departure": "16:25",
      "arrival": "16:57"
    },
    {
      "departure": "16:30",
      "arrival": "17:02"
    },
    {
      "departure": "16:35",
      "arrival": "17:07"
    },
    {
      "departure": "16:40",
      "arrival": "17:12"
    },
    {
      "departure": "16:45",
      "arrival": "17:17"
    },
    {
      "departure": "16:50",
      "arrival": "17:22"
    },
    {
      "departure": "16:55",
      "arrival": "17:27"
    },
    {
      "departure": "17:00",
      "arrival": "17:32"
    },
    {
      "departure": "17:05",
      "arrival": "17:37"
    },
    {
      "departure": "17:10",
      "arrival": "17:42"
    },
    {
      "departure": "17:15",
      "arrival": "17:47"
    },
    {
      "departure": "17:20",
      "arrival": "17:52"
    },
    {
      "departure": "17:25",
      "arrival": "17:57"
    },
    {
      "departure": "17:30",
      "arrival": "18:02"
    },
    {
      "departure": "17:35",
      "arrival": "18:07"
    },
    {
      "departure": "17:40",
      "arrival": "18:12"
    },
    {
      "departure": "17:45",
      "arrival": "18:17"
    },
    {
      "departure": "17:50",
      "arrival": "18:22"
    },
    {
      "departure": "17:55",
      "arrival": "18:27"
    },
    {
      "departure": "18:00",
      "arrival": "18:32"
    },
    {
      "departure": "18:05",
      "arrival": "18:37"
    },
    {
      "departure": "18:10",
      "arrival": "18:42"
    },
    {
      "departure": "18:15",
      "arrival": "18:47"
    },
    {
      "departure": "18:20",
      "arrival": "18:52"
    },
    {
      "departure": "18:25",
      "arrival": "18:57"
    },
    {
      "departure": "18:30",
      "arrival": "19:02"
    },
    {
      "departure": "18:35",
      "arrival": "19:07"
    },
    {
      "departure": "18:40",
      "arrival": "19:12"
    },
    {
      "departure": "18:45",
      "arrival": "19:17"
    },
    {
      "departure": "18:50",
      "arrival": "19:22"
    },
    {
      "departure": "18:55",
      "arrival": "19:27"
    },
    {
      "departure": "19:00",
      "arrival": "19:32"
    },
    {
      "departure": "19:05",
      "arrival": "19:37"
    },
    {
      "departure": "19:10",
      "arrival": "19:42"
    },
    {
      "departure": "19:15",
      "arrival": "19:47"
    },
    {
      "departure": "19:20",
      "arrival": "19:52"
    },
    {
      "departure": "19:25",
      "arrival": "19:57"
    },
    {
      "departure": "19:30",
      "arrival": "20:02"
    },
    {
      "departure": "19:35",
      "arrival": "20:07"
    },
    {
      "departure": "19:40",
      "arrival": "20:12"
    },
    {
      "departure": "19:45",
      "arrival": "20:17"
    },
    {
      "departure": "19:50",
      "arrival": "20:22"
    },
    {
      "departure": "19:55",
      "arrival": "20:27"
    },
    {
      "departure": "20:00",
      "arrival": "20:32"
    },
    {
      "departure": "20:05",
      "arrival": "20:37"
    },
    {
      "departure": "20:10",
      "arrival": "20:42"
    },
    {
      "departure": "20:15",
      "arrival": "20:47"
    },
    {
      "departure": "20:20",
      "arrival": "20:52"
    },
    {
      "departure": "20:25",
      "arrival": "20:57"
    },
    {
      "departure": "20:30",
      "arrival": "21:02"
    },
    {
      "departure": "20:35",
      "arrival": "21:07"
    },
    {
      "departure": "20:40",
      "arrival": "21:12"
    },
    {
      "departure": "20:45",
      "arrival": "21:17"
    },
    {
      "departure": "20:50",
      "arrival": "21:22"
    },
    {
      "departure": "20:55",
      "arrival": "21:27"
    },
    {
      "departure": "21:00",
      "arrival": "21:32"
    },
    {
      "departure": "21:05",
      "arrival": "21:37"
    },
    {
      "departure": "21:10",
      "arrival": "21:42"
    },
    {
      "departure": "21:15",
      "arrival": "21:47"
    },
    {
      "departure": "21:20",
      "arrival": "21:52"
    },
    {
      "departure": "21:25",
      "arrival": "21:57"
    },
    {
      "departure": "21:30",
      "arrival": "22:02"
    },
    {
      "departure": "21:35",
      "arrival": "22:07"
    },
    {
      "departure": "21:40",
      "arrival": "22:12"
    },
    {
      "departure": "21:45",
      "arrival": "22:17"
    },
    {
      "departure": "21:50",
      "arrival": "22:22"
    },
    {
      "departure": "21:55",
      "arrival": "22:27"
    },
    {
      "departure": "22:00",
      "arrival": "22:32"
    },
    {
      "departure": "22:05",
      "arrival": "22:37"
    },
    {
      "departure": "22:10",
      "arrival": "22:42"
    },
    {
      "departure": "22:15",
      "arrival": "22:47"
    },
    {
      "departure": "22:20",
      "arrival": "22:52"
    }
  ],
  "tripDuration": 32
}
```
