import React, { useEffect, useState } from "react";
import "./App.css";

const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL;
const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL;
const PAYMENT_SERVICE_URL = process.env.REACT_APP_PAYMENT_SERVICE_URL;

function App() {
  const [products, setProducts] = useState([]);
  const [orderResp, setOrderResp] = useState(null);

  useEffect(() => {
    fetch(`${PRODUCT_SERVICE_URL}/products`)
      .then(r => r.json())
      .then(setProducts)
      .catch(err => console.error("Product fetch error:", err));
  }, []);

  async function buy(product) {
    // create order
    const order = await fetch(`${ORDER_SERVICE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, quantity: 1 })
    }).then(r => r.json());

    // call payment
    const payment = await fetch(`${PAYMENT_SERVICE_URL}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderResp.id, amount: orderResp.total })
    }).then(r => r.json());

    setOrderResp({ order: orderResp, payment: payResp });
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
