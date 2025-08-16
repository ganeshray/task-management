// Environment configuration utility
export const config = {
  // Environment
  environment: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  
  // API Configuration
  apiUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 5000,
  
  // Debug Configuration
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'debug',
  
  // Vite mode
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
}

// Logger utility based on environment
export const logger = {
  debug: (...args) => {
    if (config.debugMode && (config.logLevel === 'debug' || config.isDevelopment)) {
      console.debug('[DEBUG]', ...args)
    }
  },
  info: (...args) => {
    if (config.logLevel !== 'error') {
      console.info('[INFO]', ...args)
    }
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args)
  },
  error: (...args) => {
    console.error('[ERROR]', ...args)
  }
}

// Development only utilities
export const devTools = {
  // Only available in development
  isEnabled: config.isDevelopment,
  
  // Log environment info
  logEnvironmentInfo: () => {
    if (config.isDevelopment) {
      logger.info('Environment Configuration:', {
        environment: config.environment,
        apiUrl: config.apiUrl,
        debugMode: config.debugMode,
        logLevel: config.logLevel
      })
    }
  }
}

export default config
