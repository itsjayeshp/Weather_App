# 🔐 Security Best Practices

This document outlines security considerations and best practices for the Weather Forecast App.

## Table of Contents

- [Environment Variables](#environment-variables)
- [API Security](#api-security)
- [Input Validation](#input-validation)
- [XSS Protection](#xss-protection)
- [CORS Configuration](#cors-configuration)
- [Content Security Policy](#content-security-policy)
- [HTTPS](#https)
- [Dependencies](#dependencies)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)

---

## Environment Variables

### ✅ Best Practices

1. **Never commit `.env` files**

   - `.env` is listed in `.gitignore`
   - Use `.env.example` as a template

2. **Use platform-specific environment variables**

   ```bash
   # Development
   VITE_WEATHER_API_KEY=your_dev_api_key

   # Production (set in deployment platform)
   VITE_WEATHER_API_KEY=your_prod_api_key
   ```

3. **Validate environment variables on startup**
   - The app validates API key presence in `src/utils/config.js`
   - App throws error if key is missing or invalid

### ❌ Security Risks

- ❌ Hardcoding API keys in source code
- ❌ Committing `.env` files to version control
- ❌ Sharing API keys in public channels
- ❌ Using the same API key for dev and production

---

## API Security

### API Key Protection

The OpenWeatherMap API key is protected through:

1. **Environment Variables**: Stored in `.env`, never in code
2. **Build-Time Embedding**: Vite embeds the key at build time
3. **No Client-Side Exposure**: Though the key appears in network requests (this is expected for client-side apps)

### Limitations

⚠️ **Important**: Since this is a client-side application, the API key will be visible in network requests. This is unavoidable for frontend-only apps.

### Mitigation Strategies

To fully protect your API key, consider:

1. **Backend Proxy** (Recommended for Production)

   ```javascript
   // Instead of calling OpenWeatherMap directly:
   // https://api.openweathermap.org/data/2.5/weather?q=London&appid=KEY

   // Call your own backend:
   // https://your-api.com/weather?city=London
   ```

2. **API Key Restrictions**

   - Set up API key restrictions in OpenWeatherMap dashboard
   - Limit by HTTP referrer (domain)
   - Limit by IP address (for backend implementations)
   - Set usage quotas

3. **Rate Limiting**
   - Free tier: 60 calls/minute, 1M calls/month
   - Monitor usage in OpenWeatherMap dashboard
   - Implement client-side request throttling

---

## Input Validation

### Current Validation

The app validates user input in `src/App.jsx`:

```javascript
const validateCityInput = (city) => {
  // Empty check
  if (!city || city.trim() === "") {
    return { isValid: false, error: "Please enter a city name." };
  }

  // Character validation (letters, spaces, hyphens, apostrophes only)
  const validCityPattern = /^[a-zA-Z\s\-']+$/;
  if (!validCityPattern.test(city.trim())) {
    return { isValid: false, error: "Please enter a valid city name." };
  }

  // Length validation (1-50 characters)
  if (city.trim().length < 1 || city.trim().length > 50) {
    return { isValid: false, error: "Please enter a valid city name." };
  }

  return { isValid: true, error: null };
};
```

### Why This Matters

- ✅ Prevents malformed API requests
- ✅ Protects against injection attacks
- ✅ Provides better user experience
- ✅ Reduces unnecessary API calls

---

## XSS Protection

### Input Sanitization

In `src/Components/InputCity.jsx`:

```javascript
const handleInputChange = (e) => {
  const value = e.target.value;

  // Remove XSS-prone characters
  const sanitizedValue = value.replace(/[<>]/g, "");

  if (sanitizedValue !== value) {
    e.target.value = sanitizedValue;
  }

  onInputHandler(e);
};
```

### React's Built-in Protection

React automatically escapes content, protecting against XSS:

```javascript
// This is safe - React escapes the content
<h1>{weatherInfo.city}</h1>

// ⚠️ Dangerous - DON'T do this
<div dangerouslySetInnerHTML={{__html: unknownData}} />
```

---

## CORS Configuration

### Client-Side (Current Setup)

OpenWeatherMap API allows cross-origin requests, so no CORS configuration is needed.

### Backend Proxy (If Implemented)

If you implement a backend proxy:

```javascript
// Express.js example
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your frontend domain
    methods: ["GET"],
    credentials: true,
  })
);
```

---

## Content Security Policy

### Recommended CSP Headers

Add these headers to your deployment platform:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.openweathermap.org;
```

### Implementation

#### Netlify

Create `_headers` file:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openweathermap.org;
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

#### Vercel

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openweathermap.org;"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## HTTPS

### Why HTTPS Matters

- 🔒 Encrypts data in transit
- 🔒 Prevents man-in-the-middle attacks
- ✅ Required for modern web features
- ✅ Better SEO rankings
- ✅ User trust

### Implementation

Most modern hosting platforms provide free SSL:

- **Vercel**: Automatic HTTPS
- **Netlify**: Automatic HTTPS
- **GitHub Pages**: Supports HTTPS for custom domains
- **Manual Server**: Use Let's Encrypt (see [DEPLOYMENT.md](DEPLOYMENT.md))

⚠️ **Never use HTTP in production**

---

## Dependencies

### Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Regular Maintenance

- Review dependencies monthly
- Update React and security-critical packages promptly
- Remove unused dependencies
- Use `npm ci` in CI/CD for reproducible builds

### Current Security Status

```bash
# Run this to check current security status
npm audit
```

---

## Rate Limiting

### API Rate Limits

OpenWeatherMap Free Tier:

- **60 calls per minute**
- **1,000,000 calls per month**

### Client-Side Protection

The app includes:

1. **Request Timeout**: 10 seconds
2. **Abort Controllers**: Cancels pending requests
3. **Error Handling**: Displays rate limit errors

### Monitoring Usage

- Check usage in OpenWeatherMap dashboard
- Set up alerts for high usage
- Consider upgrading plan for production

---

## Error Handling

### Error Boundary

The app uses React Error Boundaries to catch runtime errors:

```javascript
// src/components/ErrorBoundary.jsx
// Catches all JavaScript errors in child components
// Displays user-friendly error UI
// Logs errors for debugging
```

### Sensitive Data in Errors

⚠️ **Never expose sensitive data in error messages**

✅ Good:

```javascript
setError("City not found. Please check the spelling.");
```

❌ Bad:

```javascript
setError(`API Error: ${err.message}`); // May expose internal details
```

### Production Logging

Current setup:

- Development: Console logging enabled
- Production: Only error logging

Consider adding:

- Error tracking service (Sentry, LogRocket)
- Analytics for failed requests
- User feedback mechanism

---

## Security Checklist

### Pre-Deployment

- [ ] API key in environment variables
- [ ] `.env` file in `.gitignore`
- [ ] Input validation implemented
- [ ] XSS protection in place
- [ ] Error messages don't expose sensitive data
- [ ] Dependencies up to date
- [ ] No security vulnerabilities (`npm audit`)

### Post-Deployment

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP policy set
- [ ] API key restrictions configured
- [ ] Rate limiting monitored
- [ ] Error tracking set up
- [ ] Regular security audits scheduled

---

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do NOT** create a public GitHub issue
2. Email: security@yourapp.com (replace with your email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We appreciate responsible disclosure and will respond within 48 hours.

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/keeping-components-pure#security)
- [Vite Security](https://vitejs.dev/guide/env-and-mode.html#env-files)
- [OpenWeatherMap API Security](https://openweathermap.org/faq#error401)

---

**Last Updated**: January 2026

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)
