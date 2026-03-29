// Safe entrypoint for deployments — do not perform filesystem operations at module load
require('dotenv').config();

const isServerless = !!(process.env.VERCEL || process.env.AWS_REGION || process.env.FUNCTIONS_WORKER_RUNTIME);
if (isServerless) {
  // In serverless environments we keep this file inert. The serverless functions live under /api.
  console.log('server.js loaded in serverless mode — no local server will be started.');
  module.exports = {};
} else {
  // For local development, delegate to server.local.js
  console.log('server.js running in local mode — starting local server from server.local.js');
  require('./server.local.js');
}
