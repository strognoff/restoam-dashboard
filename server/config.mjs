const isProd = process.env.NODE_ENV === 'production';

function read(name, fallback = '') {
  const value = process.env[name];
  return typeof value === 'string' ? value : fallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd,
  port: Number(process.env.PORT || 5176),
  adminUsername: read('ADMIN_USERNAME', 'admin'),
  adminPassword: read('ADMIN_PASSWORD', 'admin'),
  sessionSecret: read('SESSION_SECRET', 'local-dev-session-secret-change-me'),
  dashboardWebUrl: read('DASHBOARD_WEB_URL', 'http://127.0.0.1:5176'),
};

export function validateConfig() {
  const errors = [];

  if (!config.adminUsername.trim()) errors.push('ADMIN_USERNAME is required');
  if (!config.adminPassword.trim()) errors.push('ADMIN_PASSWORD is required');
  if (!config.sessionSecret.trim()) errors.push('SESSION_SECRET is required');

  if (isProd && config.sessionSecret === 'local-dev-session-secret-change-me') {
    errors.push('SESSION_SECRET must be changed in production');
  }

  if (isProd && (config.adminUsername === 'admin' || config.adminPassword === 'admin')) {
    errors.push('ADMIN_USERNAME/ADMIN_PASSWORD must be non-default in production');
  }

  if (errors.length) {
    throw new Error(`Config validation failed: ${errors.join('; ')}`);
  }
}
