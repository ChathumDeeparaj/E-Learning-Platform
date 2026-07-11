// Simple in-memory metrics tracker
let metrics = {
  totalRequests: 0,
  totalErrors: 0,
  totalResponseTime: 0,
  activeUsers: new Set(),
  requestsHistory: []
};

// Track users seen in last 15 mins
const userActivity = new Map(); 

const recordMetrics = (req, status, duration) => {
  metrics.totalRequests++;
  metrics.totalResponseTime += duration;
  
  if (status >= 400) {
    metrics.totalErrors++;
  }

  if (req.user) {
    userActivity.set(req.user._id.toString(), Date.now());
  }

  metrics.requestsHistory.push({
    timestamp: Date.now(),
    duration
  });

  if (metrics.requestsHistory.length > 1000) {
    metrics.requestsHistory.shift();
  }
};

const getMetrics = () => {
  const now = Date.now();
  for (let [userId, lastActive] of userActivity.entries()) {
    if (now - lastActive > 900000) {
      userActivity.delete(userId);
    }
  }

  return {
    totalRequests: metrics.totalRequests,
    totalErrors: metrics.totalErrors,
    averageResponseTime: metrics.totalRequests > 0 ? (metrics.totalResponseTime / metrics.totalRequests).toFixed(2) : 0,
    activeUsers: userActivity.size,
    history: metrics.requestsHistory.slice(-50)
  };
};

module.exports = { recordMetrics, getMetrics };
