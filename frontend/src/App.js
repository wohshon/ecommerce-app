import React, { useEffect, useState } from "react";
import "./App.css";

//endpoints exposed by server.js
const PRODUCT_SERVICE_URL = "/api/product/products";
const ORDER_SERVICE_URL = "/api/order/orders";
const PAYMENT_SERVICE_URL = "/api/payment/pay";

function App() {
  const [products, setProducts] = useState([]);
  const [orderResp, setOrderResp] = useState(null);

  useEffect(() => {
    fetch(`${PRODUCT_SERVICE_URL}`)
      .then(r => r.json())
      .then(setProducts)
      .catch(err => console.error("Product fetch error:", err));
  }, []);

  async function buy(product) {
    // create order
    const order = await fetch(`${ORDER_SERVICE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, quantity: 1 })
    }).then(r => r.json());

    // call payment
    const payment = await fetch(`${PAYMENT_SERVICE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order.id, amount: order.total })
    }).then(r => r.json());

    setOrderResp({ order, payment });
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Ecommerce Demo</h1>
      <h2>Products</h2>
      {products.length === 0 ? <div>Loading...</div> : (
        <ul>
          {products.map(p => (
            <li key={p.id} style={{ marginBottom: 10 }}>
              <strong>{p.name}</strong> - ${p.price}
              <div><button onClick={() => buy(p)}>Buy 1</button></div>
            </li>
          ))}
        </ul>
      )}
      {orderResp && (
        <div style={{ marginTop: 20 }}>
          <h3>Last Transaction</h3>
          <pre>{JSON.stringify(orderResp, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;