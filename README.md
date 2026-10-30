# API consumption

Requires Node.js 22 or newer.

```sh
npm install
npm start
```

Open http://localhost:3000.
Set `PORT` to use another port.

Express serves the page and proxies GET requests from `/api/onepiece/...` to
`https://onepieceapi.com/api/...`, preserving query parameters, response status
and content type. The proxy only targets the One Piece API, not arbitrary URLs.

CORS allows any origin (`Access-Control-Allow-Origin: *`) without cookies or
credentialed requests, and handles OPTIONS preflight requests. If you serve
your frontend separately (for example, with Live Server), use the absolute URL
`http://localhost:3000/api/onepiece/characters?limit=3` instead of a relative URL.
Restart the server after changing its configuration.

Upstream connection failures return HTTP 502; timeouts after 15 seconds return
HTTP 504. Other upstream errors retain their original status and body.

Run the local tests with `npm test`.
