const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
// Dynamic CORS from FRONTEND_URLS env variable
const frontendUrls = process.env.FRONTEND_URLS || "http://localhost:3000";
const origins = frontendUrls.split(",").map(u => u.trim());
app.use(cors({ origin: origins }));

app.use(express.json());

const PORT = process.env.PORT || 8083;

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment' }));

// Mock payment endpoint
app.post('/pay', (req, res) => {
    console.log('Payment request body:', req.body);
    const { orderId, amount } = req.body;
    if (!orderId || !amount) return res.status(400).json({ error: 'orderId and amount required' });
    const transaction = {
        id: uuidv4(),
        orderId,
        amount,
        status: 'success',
        provider: 'mock'
    };
    return res.json(transaction);
});

app.listen(PORT, () => console.log(`payment-service listening on ${PORT}`));
