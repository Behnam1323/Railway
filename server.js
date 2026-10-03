'use strict';

// Railway adapter for VLESS-WS v4.6.
// The v4.6 WebSocket/TCP relay creates and exports a normal Node HTTP server.
// Railway terminates HTTPS/WSS at its edge and forwards HTTP/WS to this server.
const server = require('./api/ws');

const port = Number(process.env.PORT || 3000);
const host = '0.0.0.0';

server.on('error', (err) => {
  console.error('[server:error]', err);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`[startup] VLESS-WS v4.6 listening on http://${host}:${port}`);
  console.log(`[startup] WebSocket endpoint: /api/ws`);
  console.log(`[startup] Health endpoint: /api/health`);
});
