import React, { useState } from "react";
import Header from "./components/Header";
import InputCity from "./components/InputCity";
import ShowWeather from "./components/ShowWeather";
import "./App.css";

const App = () => {
  const [inputCity, setInputCity] = useState("Seattle");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const inputHandler = (event) => {
    setInputCity(event.target.value);
  };

  const fetchWeatherData = async (cityName) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid city name");
        setWeatherData(null);
      } else {
        setWeatherData(data);
        setError("");
      }
    } catch {
      setError("Network error. Please try again.");
      setWeatherData(null);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    fetchWeatherData(inputCity);
  };

  const getBackgroundColor = () => {
    if (!weatherData) return "#ffffff";
    const temp = weatherData.main.temp - 273.15;
    if (temp < 10) return "#4a90e2";
    if (temp <= 30) return "#7ed321";
    return "#d0021b";
  };

  return (
    <div
      className="App"
      style={{ backgroundColor: getBackgroundColor(), minHeight: "100vh" }}
    >
      <Header />

      <InputCity
        city={inputCity}
        onInputHandler={inputHandler}
        onSubmitHandler={submitHandler}
      />

      {error && <p className="error-message">{error}</p>}

      {weatherData && !error && <ShowWeather weather={weatherData} />}
    </div>
  );
}

export default App;