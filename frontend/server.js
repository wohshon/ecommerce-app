const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Backend service URLs from env
//default to localhost for local dev
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE || 'http://localhost:8081';
const ORDER_SERVICE = process.env.ORDER_SERVICE || 'http://localhost:8082';
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE || 'http://localhost:8083';

app.use('/api/product', (req, res, next) => {
  console.log(`[Proxy] /api/product -> ${PRODUCT_SERVICE} | Incoming path: ${req.path}`);
  next();
});

// Proxy API requests to the internal services
app.use('/api/product', createProxyMiddleware({
  target: PRODUCT_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/product': '' }, // remove prefix
}));

app.use('/api/order', createProxyMiddleware({
  target: ORDER_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/order': '' },
}));

app.use('/api/payment', createProxyMiddleware({
  target: PAYMENT_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/payment': '' },
}));

// Serve React build
app.use(express.static(path.join(__dirname, 'build')));

// All other requests go to React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Frontend Node server running on port ${PORT}`));