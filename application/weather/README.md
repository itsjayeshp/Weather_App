# 🌤️ Weather Forecast App

A modern, responsive weather forecast application built with React and Vite. Get accurate, real-time weather information for any city worldwide with a beautiful, intuitive interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/vite-7.2.4-646cff.svg)

## ✨ Features

- 🌍 **Global Coverage**: Search weather for any city worldwide
- 📊 **Comprehensive Data**: Temperature, humidity, wind speed, visibility, pressure, cloudiness
- 🌅 **Sunrise & Sunset Times**: Local sunrise and sunset information
- 🎨 **Dynamic Backgrounds**: Color-coded temperature ranges for visual feedback
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-Time Updates**: Live weather data from OpenWeatherMap API
- 🎯 **Smart Search**: Input validation with helpful error messages
- ♿ **Accessible**: ARIA labels and semantic HTML for screen readers
- 🔄 **Offline Handling**: Graceful error handling for network issues
- 🎭 **Error Boundaries**: Robust error handling with user-friendly fallbacks

## 🚀 Live Demo

[View Live Demo](#) <!-- Add your deployment URL here -->

## 📸 Screenshots

<!-- Add screenshots of your application here -->

## 🛠️ Technologies

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **API**: OpenWeatherMap API
- **Styling**: Modern CSS with gradients and animations
- **Type Checking**: PropTypes
- **Code Quality**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/weather-forecast-app.git
   cd weather-forecast-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenWeatherMap API key:

   ```env
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

   > 💡 **Get your API key**: Sign up at [OpenWeatherMap](https://openweathermap.org/api) to get a free API key

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Standard build
npm run build

# Production build
npm run build:prod

# Preview production build
npm run preview
```

The optimized production files will be in the `dist/` directory.

## 📁 Project Structure

```
weather-forecast-app/
├── public/              # Static assets
├── src/
│   ├── Components/      # React components
│   │   ├── ErrorBoundary.jsx
│   │   ├── Header.jsx
│   │   ├── InputCity.jsx
│   │   └── ShowWeather.jsx
│   ├── utils/           # Utility functions
│   │   └── config.js    # Configuration and validation
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── styles.css       # Global styles
├── .env                 # Environment variables (create this)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🎨 Features in Detail

### Dynamic Temperature Display

- **Below 0°C**: Icy blue gradient
- **0-10°C**: Cool aqua theme
- **10-20°C**: Warm yellow theme
- **20-30°C**: Warm orange theme
- **Above 30°C**: Hot red gradient

### Weather Information Cards

- 💨 Wind Speed & Direction
- 💧 Humidity Percentage
- 🌡️ Atmospheric Pressure
- 👁️ Visibility Distance
- ☁️ Cloud Coverage
- 🌅 Sunrise Time
- 🌇 Sunset Time
- 🌡️ Temperature in Fahrenheit

### Error Handling

- Network timeout protection (10s)
- Invalid city name detection
- API rate limiting handling
- Network connectivity issues
- Server error management
- Input validation and sanitization

## 🔐 Environment Variables

| Variable               | Description                 | Required |
| ---------------------- | --------------------------- | -------- |
| `VITE_WEATHER_API_KEY` | Your OpenWeatherMap API key | Yes      |

## 🧪 Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 480px - 768px
- **Mobile**: < 480px

## 🐛 Troubleshooting

### API Key Issues

- **Error**: "Invalid API key"
  - **Solution**: Verify your `.env` file contains the correct API key
  - **Solution**: Ensure the key is prefixed with `VITE_`
  - **Solution**: Restart the dev server after updating `.env`

### Build Errors

- **Error**: "prop-types" module not found
  - **Solution**: Run `npm install` to install all dependencies

### Network Errors

- **Error**: "Network error. Please check your internet connection"
  - **Solution**: Check your internet connection
  - **Solution**: Verify the OpenWeatherMap API is accessible
  - **Solution**: Check if you've exceeded API rate limits (60 calls/minute for free tier)

## 📄 API Documentation

This app uses the [OpenWeatherMap Current Weather Data API](https://openweathermap.org/current).

**Endpoints used:**

- `GET /data/2.5/weather` - Current weather data

**Rate Limits (Free Tier):**

- 60 calls per minute
- 1,000,000 calls per month

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and emojis from Unicode standards
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/weather-forecast-app](https://github.com/yourusername/weather-forecast-app)

---

Made with ❤️ by [Your Name]
