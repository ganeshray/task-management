# Environment Configuration

This frontend application supports multiple environments with proper configuration management.

## Environment Files

### Available Environment Files

- `.env` - Template file with default values (tracked in git)
- `.env.development` - Development environment variables (tracked in git)
- `.env.production` - Production environment variables (tracked in git) 
- `.env.local` - Local override file (not tracked in git)

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the frontend:

- `VITE_APP_ENV` - Application environment (development/production)
- `VITE_BACKEND_URL` - Backend API URL
- `VITE_API_TIMEOUT` - API request timeout in milliseconds
- `VITE_DEBUG_MODE` - Enable/disable debug logging (true/false)
- `VITE_LOG_LEVEL` - Logging level (debug/info/warn/error)

## NPM Scripts

### Development
```bash
npm run dev          # Run in development mode
npm run dev:prod     # Run in production mode (for testing)
```

### Building
```bash
npm run build        # Build for production
npm run build:dev    # Build for development (with sourcemaps)
npm run build:preview # Build and preview production build
```

### Other
```bash
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Usage in Code

### Using Configuration
```javascript
import { config, logger, devTools } from './utils/config.js';

// Access environment variables
console.log(config.apiUrl);
console.log(config.environment);
console.log(config.isDevelopment);

// Use logger based on environment
logger.debug('Debug message');
logger.info('Info message');
logger.error('Error message');

// Development utilities
if (devTools.isEnabled) {
  devTools.logEnvironmentInfo();
}
```

### Environment Detection
```javascript
import { config } from './utils/config.js';

if (config.isDevelopment) {
  // Development-only code
}

if (config.isProduction) {
  // Production-only code
}
```

## Local Development Setup

1. Copy `.env` to `.env.local`:
   ```bash
   cp .env .env.local
   ```

2. Customize `.env.local` for your local development needs

3. Start development server:
   ```bash
   npm run dev
   ```

## Production Deployment

1. Update `.env.production` with your production values:
   - Set `VITE_BACKEND_URL` to your production API URL
   - Set `VITE_DEBUG_MODE=false`
   - Set `VITE_LOG_LEVEL=error`

2. Build for production:
   ```bash
   npm run build
   ```

3. The `dist/` folder contains the production-ready files

## Environment Priority

Vite loads environment files in this order (higher priority overrides lower):

1. `.env.local` (highest priority, not tracked in git)
2. `.env.[mode].local` (e.g., `.env.development.local`)
3. `.env.[mode]` (e.g., `.env.development`)
4. `.env` (lowest priority, default values)

## Security Notes

- Never commit sensitive data like API keys to git
- Use `.env.local` for sensitive local development variables
- The `.env.local` file is ignored by git for security
- All `VITE_` prefixed variables are exposed to the client-side code
