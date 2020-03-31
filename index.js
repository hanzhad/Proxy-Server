import http from 'http';
import httpProxy from 'http-proxy';
import express from 'express';
import cors from 'cors';
import config from './config';
import requestLogger from './utils/requestLogger';

const app = express();
const proxy = httpProxy.createProxyServer();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(
  (req, res) => {
    proxy.web(req, res, { target: config.proxyTarget }, () => {
      res.status(500).send('server is not anabelle')
    });
  }
);

const httpServer = http.createServer(app);

httpServer.listen(config.port, () => {
  console.log(`Server is listening on port ${config.port}`);
});

const proxyServer = http.createServer(proxy.web);

proxyServer.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});
