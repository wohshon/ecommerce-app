//test5
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Backend service URLs from env, fallback to localhost for local dev
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE || 'http://localhost:8081';
const ORDER_SERVICE = process.env.ORDER_SERVICE || 'http://localhost:8082';
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE || 'http://localhost:8083';
const FRONTEND_PORT = process.env.PORT || 80;

const PRODUCT_IMAGE_BASE = process.env.PRODUCT_IMAGE_BASE || "";


// Proxy Product service (API + images)
app.use(
  '/api/product',
  createProxyMiddleware({
    target: PRODUCT_SERVICE,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Rewrite /api/product/images/... -> /images/... on product service
      if (path.startsWith('/api/product/images') && PRODUCT_IMAGE_BASE) {
        return path.replace('/api/product/images', PRODUCT_IMAGE_BASE);
      }
      // All other /api/product/... requests
      return path.replace('/api/product', '');
    },
  })
);

// Proxy Order service
app.use('/api/order', createProxyMiddleware({
  target: ORDER_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/order': '' },
}));

// Proxy Payment service
app.use('/api/payment', createProxyMiddleware({
  target: PAYMENT_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/payment': '' },
}));

// Serve React build
app.use(express.static(path.join(__dirname, 'build')));

// All other requests go to React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(FRONTEND_PORT, () => console.log(`Frontend Node server running on port ${FRONTEND_PORT}`));
