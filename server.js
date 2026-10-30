const express = require('express');
const cors = require('cors');
const path = require('node:path');

const PROXY_PREFIX = '/api/onepiece';
const UPSTREAM_URL = 'https://onepieceapi.com/api';

function createApp(fetchUpstream = fetch) {
  const app = express();

  app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'OPTIONS']
  }));

  app.get(/^\/api\/onepiece(?:\/|$)/, async (req, res) => {
    try {
      const upstream = await fetchUpstream(
        `${UPSTREAM_URL}${req.originalUrl.slice(PROXY_PREFIX.length)}`,
        { signal: AbortSignal.timeout(15000) }
      );
      const body = Buffer.from(await upstream.arrayBuffer());
      const contentType = upstream.headers.get('content-type');

      if (contentType) {
        res.set('Content-Type', contentType);
      }

      res.status(upstream.status).send(body);
    } catch (error) {
      console.error('One Piece API proxy request failed:', error);
      const timedOut = error.name === 'TimeoutError';
      res.status(timedOut ? 504 : 502).json({
        error: timedOut
          ? 'The One Piece API request timed out.'
          : 'Unable to reach the One Piece API.'
      });
    }
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  app.use('/js', express.static(path.join(__dirname, 'js')));
  app.use('/css', express.static(path.join(__dirname, 'css')));

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, () => {
    console.log(`Open http://localhost:${port}`);
  });
}

module.exports = { createApp };
