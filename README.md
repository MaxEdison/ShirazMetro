
# Shiraz Metro Api
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)



Restful api for getting metro schedules and timelines of Shiraz.


## Demo
you can use our demo on github pages

```https://maxedison.github.io/ShirazMetro/```


## Features

- Station Names
- Scdules
- Hilodays Scdules


## API Reference

#### Station Names

```
  GET /api/v1/stations/stations
```

| Parameter | Return Type     | Description                |
| :-------- | :------- | :------------------------- |
| `-` | `json` | returns station names |

#### Scedules

```
  GET /api/v1/scedules/calculate?startStation=${START_STATION_NAME}&destinationStation=${DESTINATION_STATION_NAME}&holiday=${BOOL}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `startStation`      | `string` | **Required**|
| `destinationStation`      | `string` | **Required**|
| `holiday`      | `bool` | **Required**|




## Usage/Examples

so you want to find the scedules of a certain route what should you when useing the api?
you have to send a request (a simple GET request) to get the full scheduel for example you want to go from 'شهید دستغیب' to 'دکتر شریعتی' and you want to have the holidays scedules too so you pass true to 'holiday' field :

```
/api/v1/scedules/calculate?startStation=شهید دستغیب&destinationStation=دکتر شریعتی&holiday=true

```

### Installation for Local hosting

1. Clone the repository to your local machine:

   ```
    git clone https://github.com/MaxEdison/ShirazMetro.git
   ```

2. Navigate to the project directory:

   ```
    cd ShirazMetro
    ```


3. Install the required dependencies:

   ```
   npm install
   ```


4. Start the server:

   ```
   npm run dev
   ```


5. See the data:
The server will be running at
```
    http://localhost:8080
```
## Environment Variables for local hosting

To run this project, you will need to add the following environment variables to your .env file

`PORT: default value is 8080`


## Contributers

- [@MaxEdison](https://github.com/MaxEdison)
- [@ParsaBordbar](https://github.com/ParsaBordbar)
- [@metemaddar](https://github.com/metemaddar)


## Contributing

Contributions are always welcome!
