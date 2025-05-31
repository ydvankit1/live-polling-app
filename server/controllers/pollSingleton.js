const PollManager = require('./pollManager');

// Singleton
global._pollManagerInstance = global._pollManagerInstance || new PollManager();
module.exports = global._pollManagerInstance;
