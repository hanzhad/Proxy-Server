import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';
import requestLogger from './utils/requestLogger';
import http from "http";

export default function (servers) {
  return async function (target) {

    const app = express();

    const options = {}

    if (target.https) {
      options.changeOrigin = true;
      options.target = { https: true }
    }

    const proxy = httpProxy.createProxyServer(options);

    app.use(cors());
    app.use(requestLogger(target.port));

    app.use(
      (req, res) => {
        proxy.web(req, res, { target: target.proxyTarget }, (error) => {
          res.status(500).send(error)
        });
      }
    );

    servers[target.port] = http.createServer(app);

    await servers[target.port].on('error', console.log).listen(target.port, (err) => {
      console.log(`Server is listening on port ${target.port}`);
      console.log(`Proxy to  ${target.proxyTarget}`);
    });

    const proxyServer = http.createServer(proxy.web);

    proxyServer.on('upgrade', function (req, socket, head) {
      proxy.ws(req, socket, head);
    });
  }
}

