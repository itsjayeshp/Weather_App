import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * InputCity Component
 * Input form for searching weather by city name
 *
 * @param {string} inputCity - Current input value
 * @param {Function} onInputHandler - Handler for input changes
 * @param {Function} onSubmitHandler - Handler for form submission
 * @param {boolean} isLoading - Loading state
 * @param {string|null} error - Error message if any
 */
const InputCity = ({
  inputCity,
  onInputHandler,
  onSubmitHandler,
  isLoading = false,
  error = null,
}) => {
  const inputRef = useRef(null);

  // Focus input on mount for better UX
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  /**
   * Handle input change with sanitization
   */
  const handleInputChange = (e) => {
    // Remove any leading/trailing whitespace as user types
    const value = e.target.value;

    // Prevent XSS by not allowing < > characters
    const sanitizedValue = value.replace(/[<>]/g, "");

    if (sanitizedValue !== value) {
      e.target.value = sanitizedValue;
    }

    onInputHandler(e);
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e) => {
    // Clear input on Escape key
    if (e.key === "Escape" && inputRef.current) {
      inputRef.current.value = "";
      onInputHandler({ target: { value: "" } });
    }
  };

  return (
    <div className="input-section">
      <form
        onSubmit={onSubmitHandler}
        className="input-form"
        noValidate
        role="search"
        aria-label="Weather search form"
      >
        <div className="input-wrapper">
          <div className="input-icon-wrapper">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={inputCity}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter city name (e.g., New York, London)"
              className={`city-input ${error ? "input-error" : ""} ${
                isLoading ? "input-loading" : ""
              }`}
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              maxLength="50"
              aria-label="City name input"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "input-error-message" : undefined}
              required
            />

            {inputCity && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = "";
                    onInputHandler({ target: { value: "" } });
                    inputRef.current.focus();
                  }
                }}
                className="clear-btn"
                aria-label="Clear input"
                tabIndex="0"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            className="search-btn"
            disabled={isLoading || !inputCity.trim()}
            aria-label={isLoading ? "Loading..." : "Search weather"}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <svg
                  className="btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div
            className="input-error-message"
            id="input-error-message"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="error-icon-small"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <p className="input-hint">
          💡 Tip: Press <kbd>Esc</kbd> to clear, <kbd>Enter</kbd> to search
        </p>
      </form>
    </div>
  );
};

// PropTypes for type checking
InputCity.propTypes = {
  inputCity: PropTypes.string.isRequired,
  onInputHandler: PropTypes.func.isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

export default InputCity;
