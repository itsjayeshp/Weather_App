/**
 * Configuration Module
 * Validates and exports environment variables and app configuration
 */

// Environment variable validation
const validateEnvVariables = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'VITE_WEATHER_API_KEY is not defined. Please create a .env file with your OpenWeatherMap API key.'
    );
  }

  if (apiKey === 'your_api_key_here') {
    throw new Error(
      'Please update VITE_WEATHER_API_KEY in your .env file with a valid OpenWeatherMap API key.'
    );
  }

  return apiKey;
};

// Application configuration
export const config = {
  // API Configuration
  api: {
    key: validateEnvVariables(),
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    timeout: 10000, // 10 seconds
  },

  // App Configuration
  app: {
    name: 'Weather Forecast',
    version: '1.0.0',
    defaultCity: 'Seattle',
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },

  // Feature Flags
  features: {
    enableLogging: import.meta.env.DEV,
    enableAnalytics: import.meta.env.PROD,
  },
};

// Logger utility
export const logger = {
  info: (...args) => {
    if (config.features.enableLogging) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (config.features.enableLogging) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
};

export default config;
