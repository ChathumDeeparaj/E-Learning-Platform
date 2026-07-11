const fs = require('fs');
const path = require('path');
const { recordMetrics } = require('../utils/monitoring');

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const ip = req.ip || req.connection.remoteAddress;
    const logLine = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - IP: ${ip}\n`;
    
    // Write to access.log
    fs.appendFile(path.join(__dirname, '../logs/access.log'), logLine, (err) => {
      if (err && process.env.NODE_ENV !== 'test') console.error('Logging Error:', err);
    });

    // Write to error.log if status >= 400
    if (res.statusCode >= 400) {
      fs.appendFile(path.join(__dirname, '../logs/error.log'), logLine, (err) => {
        if (err && process.env.NODE_ENV !== 'test') console.error('Logging Error:', err);
      });
    }

    // Record metrics in memory
    recordMetrics(req, res.statusCode, duration);
  });

  next();
};

module.exports = loggerMiddleware;
