import React from "react";

const ShowWeather = ({ weather }) => {
  // Extract required values from API response
  const city = weather.name;
  const country = weather.sys.country;
  const temperature = (weather.main.temp - 273.15).toFixed(1);
  const pressure = weather.wind.speed;
  const visibility = weather.visibility / 1000;
  const humidity = weather.main.humidity;
  const clouds = weather.clouds.all;

  return (
    <div className="weather-card">
      <h2>
        {city}, {country}
      </h2>

      <div className="weather-info">
        <p>
          <strong>Temperature:</strong> {temperature} °C
        </p>
        <p>
          <strong>Wind Pressure:</strong> {pressure} m/s
        </p>
        <p>
          <strong>Visibility:</strong> {visibility} km
        </p>
        <p>
          <strong>Humidity:</strong> {humidity} %
        </p>
        <p>
          <strong>Cloud Cover:</strong> {clouds} %
        </p>
      </div>
    </div>
  );
};

export default ShowWeather;
