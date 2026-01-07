import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * ShowWeather Component
 * Displays comprehensive weather information with dynamic styling
 *
 * @param {Object} data - Weather data from API
 */
const ShowWeather = ({ data }) => {
  const [dynamicBackground, setDynamicBackground] = useState("");

  /**
   * Safely extracts data with fallback values
   */
  const weatherInfo = useMemo(() => {
    // Validate data object
    if (!data || typeof data !== "object") {
      return null;
    }

    // Extract data with null checks and fallbacks
    const city = data.name || "Unknown";
    const country = data.sys?.country || "N/A";
    const temperature = data.main?.temp ?? null;
    const feelsLike = data.main?.feels_like ?? null;
    const tempMin = data.main?.temp_min ?? null;
    const tempMax = data.main?.temp_max ?? null;
    const pressure = data.main?.pressure ?? null;
    const humidity = data.main?.humidity ?? null;
    const visibility = data.visibility ?? null;
    const clouds = data.clouds?.all ?? null;
    const windSpeed = data.wind?.speed ?? null;
    const windDeg = data.wind?.deg ?? null;
    const weatherMain = data.weather?.[0]?.main || "Unknown";
    const weatherDescription =
      data.weather?.[0]?.description || "No description";
    const weatherIcon = data.weather?.[0]?.icon || "01d";
    const timezone = data.timezone ?? 0;
    const sunrise = data.sys?.sunrise ?? null;
    const sunset = data.sys?.sunset ?? null;

    // Convert and format values
    const pressureInAtm =
      pressure !== null ? (pressure / 1013.25).toFixed(2) : "N/A";
    const visibilityInKM =
      visibility !== null ? (visibility / 1000).toFixed(1) : "N/A";

    // Temperature is already in Celsius from API (we set units=metric)
    const tempInCelsius =
      temperature !== null ? Math.round(temperature) : "N/A";
    const tempInFahrenheit =
      temperature !== null ? Math.round((temperature * 9) / 5 + 32) : "N/A";
    const feelsLikeTemp = feelsLike !== null ? Math.round(feelsLike) : "N/A";
    const minTemp = tempMin !== null ? Math.round(tempMin) : "N/A";
    const maxTemp = tempMax !== null ? Math.round(tempMax) : "N/A";

    // Wind direction
    const getWindDirection = (deg) => {
      if (deg === null) return "N/A";
      const directions = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW",
      ];
      const index = Math.round(deg / 22.5) % 16;
      return directions[index];
    };

    const windDirection = getWindDirection(windDeg);
    const windSpeedKmh =
      windSpeed !== null ? (windSpeed * 3.6).toFixed(1) : "N/A";

    // Format sunrise/sunset times
    const formatTime = (timestamp) => {
      if (!timestamp) return "N/A";
      const date = new Date((timestamp + timezone) * 1000);
      return date.toUTCString().slice(-12, -7);
    };

    const sunriseTime = formatTime(sunrise);
    const sunsetTime = formatTime(sunset);

    return {
      city,
      country,
      temperature: tempInCelsius,
      temperatureF: tempInFahrenheit,
      feelsLike: feelsLikeTemp,
      tempMin: minTemp,
      tempMax: maxTemp,
      pressure: pressureInAtm,
      humidity,
      visibility: visibilityInKM,
      clouds,
      windSpeed: windSpeedKmh,
      windDirection,
      weatherMain,
      weatherDescription,
      weatherIcon,
      sunrise: sunriseTime,
      sunset: sunsetTime,
    };
  }, [data]);

  /**
   * Get weather icon based on weather condition
   */
  const getWeatherIcon = (main) => {
    const icons = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "💨",
      Haze: "🌫️",
      Dust: "💨",
      Fog: "🌫️",
      Sand: "💨",
      Ash: "💨",
      Squall: "💨",
      Tornado: "🌪️",
    };
    return icons[main] || "🌡️";
  };

  /**
   * Determine background color based on temperature
   */
  const dynamicBackgroundColor = (temp) => {
    if (temp === "N/A") {
      setDynamicBackground("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
      return;
    }

    const temperature = parseInt(temp);

    if (temperature < 0) {
      setDynamicBackground("linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)");
    } else if (temperature >= 0 && temperature < 10) {
      setDynamicBackground("linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)");
    } else if (temperature >= 10 && temperature < 20) {
      setDynamicBackground("linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)");
    } else if (temperature >= 20 && temperature < 30) {
      setDynamicBackground("linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)");
    } else if (temperature >= 30) {
      setDynamicBackground("linear-gradient(135deg, #ff9a56 0%, #ff512f 100%)");
    }
  };

  // Update background on temperature change
  useEffect(() => {
    if (weatherInfo) {
      dynamicBackgroundColor(weatherInfo.temperature);
    }
  }, [weatherInfo]);

  // Handle null or invalid data
  if (!weatherInfo) {
    return (
      <div className="weather-error">
        <p>Unable to display weather data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="showWeather">
      <div className="weather_main" style={{ background: dynamicBackground }}>
        {/* Header Section */}
        <div className="weather-header">
          <div className="weather-icon-large">
            {getWeatherIcon(weatherInfo.weatherMain)}
          </div>
          <div className="weather-location">
            <h1 className="weather_heading">
              {weatherInfo.city}
              <span className="country-code">{weatherInfo.country}</span>
            </h1>
            <p className="weather-description">
              {weatherInfo.weatherDescription}
            </p>
          </div>
        </div>

        {/* Temperature Section */}
        <div className="temp-section">
          <div className="temp-main">
            <span className="temp-value">{weatherInfo.temperature}</span>
            <span className="temp-unit">°C</span>
          </div>
          <div className="temp-details">
            <p className="temp-feels">Feels like {weatherInfo.feelsLike}°C</p>
            <p className="temp-range">
              <span className="temp-min">↓ {weatherInfo.tempMin}°</span>
              <span className="temp-max">↑ {weatherInfo.tempMax}°</span>
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* Weather Data Grid */}
        <div className="weatherData-grid">
          {/* Atmospheric Data */}
          <div className="weather-card">
            <div className="card-icon">💨</div>
            <div className="card-content">
              <span className="card-label">Wind</span>
              <span className="card-value">{weatherInfo.windSpeed} km/h</span>
              <span className="card-sub">{weatherInfo.windDirection}</span>
            </div>
          </div>

          <div className="weather-card">
            <div className="card-icon">💧</div>
            <div className="card-content">
              <span className="card-label">Humidity</span>
              <span className="card-value">
                {weatherInfo.humidity !== null
                  ? `${weatherInfo.humidity}%`
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="weather-card">
            <div className="card-icon">🌡️</div>
            <div className="card-content">
              <span className="card-label">Pressure</span>
              <span className="card-value">{weatherInfo.pressure} atm</span>
            </div>
          </div>

          <div className="weather-card">
            <div className="card-icon">👁️</div>
            <div className="card-content">
              <span className="card-label">Visibility</span>
              <span className="card-value">{weatherInfo.visibility} km</span>
            </div>
          </div>

          <div className="weather-card">
            <div className="card-icon">☁️</div>
            <div className="card-content">
              <span className="card-label">Cloudiness</span>
              <span className="card-value">
                {weatherInfo.clouds !== null ? `${weatherInfo.clouds}%` : "N/A"}
              </span>
            </div>
          </div>

          <div className="weather-card">
            <div className="card-icon">🌅</div>
            <div className="card-content">
              <span className="card-label">Sunrise</span>
              <span className="card-value">{weatherInfo.sunrise}</span>
            </div>
          </div>

          <div className="weather-card">
            <div className="card-icon">🌇</div>
            <div className="card-content">
              <span className="card-label">Sunset</span>
              <span className="card-value">{weatherInfo.sunset}</span>
            </div>
          </div>

          <div className="weather-card">
            <div className="card-icon">🌡️</div>
            <div className="card-content">
              <span className="card-label">Temperature</span>
              <span className="card-value">{weatherInfo.temperatureF}°F</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
ShowWeather.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    sys: PropTypes.object,
    main: PropTypes.object,
    visibility: PropTypes.number,
    clouds: PropTypes.object,
    wind: PropTypes.object,
    weather: PropTypes.array,
    timezone: PropTypes.number,
  }),
};

export default ShowWeather;
