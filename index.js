import http from 'http';
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const express = require('express');

const PORT = 2000;

const app = express();

app.use(
  (req, res) => {
    console.log(`${Date()} -`, req.url);
    proxy.web(req, res, { target: 'http://172.26.127.67:8000' }, () => {
      res.status(500).send('server is not anabelle')
    });
    // console.log('res', res)
  }
);

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

var proxyServer = http.createServer(function (req, res) {
  proxy.web(req, res);
});

proxyServer.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});
