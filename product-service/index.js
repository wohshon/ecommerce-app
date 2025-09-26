const express = require('express');
const cors = require('cors'); 
const path = require('path');
const app = express();
const frontendUrls = process.env.FRONTEND_URLS || "http://localhost:3000";
const origins = frontendUrls.split(",").map(u => u.trim());
app.use(cors({ origin: origins }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || `http://localhost:${PORT}`;
console.log(`HOST is ${HOST}`);
// simple in-memory products
const products = [
  { id: 1, name: "Laptop", price: 1499.99, image: `${HOST}/images/laptop.png` },
  { id: 2, name: "Phone",  price: 799.99,  image: `${HOST}/images/phone.png` },
  { id: 3, name: "Mug",    price: 9.99,    image: `${HOST}/images/mug.jpg` },
  { id: 4, name: "Headphones", price: 199.99, image: `${HOST}/images/headphones.jpg` },
  { id: 5, name: "Smartwatch", price: 299.99, image: `${HOST}/images/smartwatch.jpg` },
  { id: 6, name: "Tablet", price: 499.99, image: `${HOST}/images/tablet.png` }
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product' }));
app.get('/products', (req, res) => res.json(products));
app.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === parseInt(req.params.id, 10));
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

app.listen(PORT, () => console.log(`Product service listening on ${PORT}`));
