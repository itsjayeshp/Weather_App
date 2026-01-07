import { useEffect, useState } from "react";

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <header className="heading">
      <div className="header-container">
        {/* Weather Icons Animation */}
        <div className="weather-icons">
          <svg
            className="weather-icon sun"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>

          <svg
            className="weather-icon cloud"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>

          <svg
            className="weather-icon rain"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <line x1="8" y1="19" x2="8" y2="21" />
            <line x1="8" y1="13" x2="8" y2="15" />
            <line x1="16" y1="19" x2="16" y2="21" />
            <line x1="16" y1="13" x2="16" y2="15" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="12" y1="15" x2="12" y2="17" />
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
          </svg>
        </div>

        {/* Main Title */}
        <div className="header-content">
          <h1 className="header-title">
            <span className="title-gradient">Weather</span>
            <span className="title-accent">Forecast</span>
          </h1>
          <p className="header-subtitle">Your Personal Weather Companion</p>
        </div>

        {/* Live Clock */}
        <div className="header-time">
          <svg
            className="clock-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="time-display">{formatTime(time)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
