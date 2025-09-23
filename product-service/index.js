const express = require('express');
const cors = require('cors'); 
const app = express();
const frontendUrls = process.env.FRONTEND_URLS || "http://localhost:3000";
const origins = frontendUrls.split(",").map(u => u.trim());
app.use(cors({ origin: origins }));
app.use(express.json());

const PORT = process.env.PORT || 8081;

// simple in-memory products
const products = [
  { id: 1, name: "Laptop", price: 1499.99 },
  { id: 2, name: "Phone",  price: 799.99 },
  { id: 3, name: "Mug",    price: 9.99 }
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product' }));
app.get('/products', (req, res) => res.json(products));
app.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === parseInt(req.params.id, 10));
  if (!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

app.listen(PORT, () => console.log(`Product service listening on ${PORT}`));
