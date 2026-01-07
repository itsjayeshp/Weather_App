import React, { useEffect, useState, useCallback } from "react";
import InputCity from "./Components/InputCity";
import Header from "./Components/Header";
import "./styles.css";
import ShowWeather from "./Components/ShowWeather";

// Constants
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_TIMEOUT = 10000; // 10 seconds
const DEFAULT_CITY = "Seattle";

// Error messages
const ERROR_MESSAGES = {
  NOT_FOUND: "City not found. Please check the spelling and try again.",
  NETWORK: "Network error. Please check your internet connection.",
  TIMEOUT: "Request timed out. Please try again.",
  INVALID_API_KEY: "Invalid API key. Please contact support.",
  SERVER_ERROR: "Server error. Please try again later.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  INVALID_INPUT: "Please enter a valid city name.",
  EMPTY_INPUT: "Please enter a city name.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
};

export default function App() {
  // State management
  const [weatherData, setWeatherData] = useState(null);
  const [inputCity, setInputCity] = useState(DEFAULT_CITY);
  const [cityName, setCityName] = useState(DEFAULT_CITY);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Validates city name input
   * @param {string} city - City name to validate
   * @returns {Object} - Validation result with isValid and error message
   */
  const validateCityInput = (city) => {
    if (!city || city.trim() === "") {
      return { isValid: false, error: ERROR_MESSAGES.EMPTY_INPUT };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const validCityPattern = /^[a-zA-Z\s\-']+$/;
    if (!validCityPattern.test(city.trim())) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_INPUT };
    }

    // Check length (most city names are between 1-50 characters)
    const trimmedCity = city.trim();
    if (trimmedCity.length < 1 || trimmedCity.length > 50) {
      return { isValid: false, error: ERROR_MESSAGES.INVALID_INPUT };
    }

    return { isValid: true, error: null };
  };

  /**
   * Handles input changes with validation
   */
  const inputHandler = useCallback(
    (e) => {
      const value = e.target.value;
      setInputCity(value);

      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    },
    [error]
  );

  /**
   * Handles form submission with validation
   */
  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();

      const validation = validateCityInput(inputCity);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      setError(null);
      setRetryCount(0);
      setCityName(inputCity.trim());
    },
    [inputCity]
  );

  /**
   * Fetches weather data with comprehensive error handling
   */
  const fetchWeatherData = useCallback(async (city) => {
    // Don't fetch if city is empty
    if (!city || city.trim() === "") {
      return;
    }

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`;

      const response = await fetch(URL, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      // Handle different HTTP status codes
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error(ERROR_MESSAGES.NOT_FOUND);
          case 401:
            throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
          case 429:
            throw new Error(ERROR_MESSAGES.RATE_LIMIT);
          case 500:
          case 502:
          case 503:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
          default:
            throw new Error(
              `HTTP ${response.status}: ${ERROR_MESSAGES.UNKNOWN}`
            );
        }
      }

      const data = await response.json();

      // Validate response data structure
      if (!data || typeof data !== "object") {
        throw new Error(ERROR_MESSAGES.UNKNOWN);
      }

      // Additional API-specific error handling
      if (data.cod && data.cod !== 200) {
        if (data.cod === "404") {
          throw new Error(ERROR_MESSAGES.NOT_FOUND);
        } else if (data.cod === "401") {
          throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
        } else {
          throw new Error(data.message || ERROR_MESSAGES.UNKNOWN);
        }
      }

      // Validate that we have the minimum required data
      if (!data.name || !data.main || !data.sys) {
        throw new Error(ERROR_MESSAGES.UNKNOWN);
      }

      setWeatherData(data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error("Weather fetch error:", err);

      // Handle specific error types
      if (err.name === "AbortError") {
        setError(ERROR_MESSAGES.TIMEOUT);
      } else if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError")
      ) {
        setError(ERROR_MESSAGES.NETWORK);
      } else {
        setError(err.message || ERROR_MESSAGES.UNKNOWN);
      }

      setWeatherData(null);
    } finally {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }
  }, []);

  /**
   * Retry mechanism for failed requests
   */
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    fetchWeatherData(cityName);
  }, [cityName, fetchWeatherData]);

  /**
   * Fetch weather data when city changes
   */
  useEffect(() => {
    fetchWeatherData(cityName);
  }, [cityName, fetchWeatherData]);

  return (
    <div className="app-container">
      <Header />
      <InputCity
        inputCity={inputCity}
        onInputHandler={inputHandler}
        onSubmitHandler={submitHandler}
        isLoading={isLoading}
        error={error}
      />

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Fetching weather data...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3 className="error-message">{error}</h3>
          <button className="retry-btn" onClick={handleRetry}>
            Try Again {retryCount > 0 && `(${retryCount})`}
          </button>
        </div>
      ) : weatherData ? (
        <ShowWeather data={weatherData} />
      ) : null}
    </div>
  );
}
