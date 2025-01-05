// logger.js
import * as Sentry from '@sentry/react-native';

export class Logger {
  static info(message, extra = {}) {
    if (__DEV__) {
      console.log(`INFO: ${message}`, extra);
    }
    
    // Send to Sentry as breadcrumb
    Sentry.addBreadcrumb({
      category: 'api',
      message: message,
      level: 'info',
      data: extra
    });
  }

  static warn(message, extra = {}) {
    if (__DEV__) {
      console.warn(`WARN: ${message}`, extra);
    }
    
    // Send warning to Sentry
    Sentry.captureMessage(message, {
      level: 'warning',
      extra: extra
    });
  }

  static error(error, extra = {}) {
    if (__DEV__) {
      console.error(`ERROR: ${error.message || error}`, extra);
    }

    // Send error to Sentry
    Sentry.captureException(error, {
      extra: extra,
      tags: {
        api_error: 'true'
      }
    });
  }

  static setUser(user) {
    Sentry.setUser(user);
  }

  static setTag(key, value) {
    Sentry.setTag(key, value);
  }
}