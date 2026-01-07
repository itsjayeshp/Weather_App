# 🚀 Deployment Guide

This guide covers deploying the Weather Forecast App to various platforms.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [GitHub Pages](#github-pages)
- [Docker Deployment](#docker-deployment)
- [Manual Server Deployment](#manual-server-deployment)

---

## Vercel Deployment

### Method 1: Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Add Environment Variables**

   ```bash
   vercel env add VITE_WEATHER_API_KEY
   ```

   Enter your OpenWeatherMap API key when prompted.

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - Key: `VITE_WEATHER_API_KEY`
   - Value: Your OpenWeatherMap API key
6. Click "Deploy"

---

## Netlify Deployment

### Method 1: Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build the app**

   ```bash
   npm run build
   ```

3. **Deploy**

   ```bash
   netlify deploy
   ```

4. **Deploy to production**
   ```bash
   netlify deploy --prod
   ```

### Method 2: Netlify Dashboard

1. Go to [netlify.com](https://www.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add Environment Variables:
   - Key: `VITE_WEATHER_API_KEY`
   - Value: Your API key
6. Click "Deploy site"

### netlify.toml Configuration

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## GitHub Pages

1. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to scripts:

   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

   Add homepage:

   ```json
   {
     "homepage": "https://yourusername.github.io/weather-forecast-app"
   }
   ```

3. **Update vite.config.js**

   ```javascript
   export default defineConfig({
     base: "/weather-forecast-app/",
     plugins: [react()],
   });
   ```

4. **Deploy**

   ```bash
   npm run deploy
   ```

5. **Add Environment Variables**

   - GitHub doesn't support runtime environment variables for static sites
   - Consider using GitHub Actions for builds:

   Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: "18"

         - name: Install dependencies
           run: npm ci

         - name: Build
           env:
             VITE_WEATHER_API_KEY: ${{ secrets.VITE_WEATHER_API_KEY }}
           run: npm run build

         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

   Add API key to GitHub Secrets:

   - Go to repository Settings → Secrets and variables → Actions
   - Add new secret: `VITE_WEATHER_API_KEY`

---

## Docker Deployment

### Dockerfile

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_WEATHER_API_KEY
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build and Run

```bash
# Build image
docker build --build-arg VITE_WEATHER_API_KEY=your_api_key -t weather-app .

# Run container
docker run -p 8080:80 weather-app
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  weather-app:
    build:
      context: .
      args:
        VITE_WEATHER_API_KEY: ${VITE_WEATHER_API_KEY}
    ports:
      - "8080:80"
    restart: unless-stopped
```

```bash
# Run with docker-compose
docker-compose up -d
```

---

## Manual Server Deployment

### Build the App

```bash
npm run build
```

### Upload to Server

```bash
# Using SCP
scp -r dist/* user@yourserver.com:/var/www/weather-app/

# Or using rsync
rsync -avz dist/ user@yourserver.com:/var/www/weather-app/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/weather-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### SSL with Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

---

## Environment Management

### Production Environment Variables

For security, NEVER commit your `.env` file. Use your deployment platform's environment variable management:

- **Vercel**: Dashboard → Project Settings → Environment Variables
- **Netlify**: Site settings → Build & deploy → Environment
- **GitHub**: Repository Settings → Secrets and variables
- **Docker**: Use `.env` file or pass via `--env-file` flag

---

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test the deployed application
- [ ] Check console for errors
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Verify SEO meta tags
- [ ] Test error scenarios
- [ ] Check API rate limits
- [ ] Set up monitoring (optional)
- [ ] Configure analytics (optional)

---

## Troubleshooting

### Build Failures

- Ensure Node version >= 18.0.0
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for missing environment variables

### Blank Page After Deployment

- Check browser console for errors
- Verify base URL in `vite.config.js` matches your deployment URL
- Ensure all assets are loading correctly

### API Not Working

- Verify environment variables are set correctly
- Check API key is valid on OpenWeatherMap
- Ensure API requests use HTTPS in production

---

## Performance Optimization

### Recommended Optimizations

1. **Enable CDN** on your hosting platform
2. **Configure caching headers** for static assets
3. **Enable Brotli/Gzip compression**
4. **Use a custom domain** for better SEO
5. **Set up monitoring** (Sentry, LogRocket, etc.)

---

Need help? Check the [README.md](README.md) or open an issue!
