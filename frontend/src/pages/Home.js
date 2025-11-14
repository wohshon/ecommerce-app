import React, { useEffect, useState } from "react";
import "../App.css";

// API endpoints (proxied via Node.js server)
const PRODUCT_SERVICE_BASE = process.env.REACT_APP_PRODUCT_BASE || "";
const PRODUCT_SERVICE_URL = `${PRODUCT_SERVICE_BASE}/api/product/products`;
const ORDER_SERVICE_URL = "/api/order/orders";
const PAYMENT_SERVICE_URL = "/api/payment/pay";

function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState({});
  const [orderResp, setOrderResp] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  // Fetch products
  useEffect(() => {
    fetch(PRODUCT_SERVICE_URL)
      .then(r => r.json())
      .then(setProducts)
      .catch(err => console.error("Product fetch error:", err));
  }, []);

  // Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(ORDER_SERVICE_URL);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setAllOrders(data);
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({ ...prev, [productId]: qty }));
  };

  async function buy(product) {
    const qty = quantities[product.id] || 1;
    setLoading(prev => ({ ...prev, [product.id]: true }));

    try {
      console.log(`Creating order for ${product.name}, Qty: ${qty}`);

      // Step 1: Create order
      const order = await fetch(ORDER_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, quantity: qty }),
      }).then(r => {
        if (!r.ok) throw new Error(`Order service error: ${r.status}`);
        return r.json();
      });

      console.log("Order created:", order);

      // Step 2: Process payment
      const payment = await fetch(PAYMENT_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, amount: order.total }),
      }).then(r => {
        if (!r.ok) throw new Error(`Payment service error: ${r.status}`);
        return r.json();
      });

      console.log("Payment processed:", payment);

      // Update UI
      setOrderResp({ order, payment });

      // Refresh all orders table
      fetchOrders();
    } catch (err) {
      console.error("Transaction failed:", err);
      setOrderResp({ error: err.message });
    } finally {
      setLoading(prev => ({ ...prev, [product.id]: false }));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Ecommerce Store Demo on NKP</h1>
      <h2>Products</h2>

      {products.length === 0 ? (
        <div>Loading products...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map(p => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 10,
                textAlign: "center",
                background: "#fff",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={`/api/product/images/${p.image.split("/").pop()}`}
                alt={p.name}
                style={{ width: "100%", borderRadius: 4, marginBottom: 8 }}
              />
              <h3>{p.name}</h3>
              <p style={{ fontWeight: "bold" }}>${p.price.toFixed(2)}</p>

              <div style={{ marginBottom: 8 }}>
                <input
                  type="number"
                  min="1"
                  value={quantities[p.id] || 1}
                  onChange={e => handleQuantityChange(p.id, e.target.value)}
                  style={{
                    width: "60px",
                    padding: "4px",
                    textAlign: "center",
                    marginRight: "8px",
                  }}
                />
              </div>

              <button
                onClick={() => buy(p)}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                disabled={loading[p.id]}
              >
                {loading[p.id] ? "Processing..." : "Buy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Transaction summary */}
      {orderResp && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            background: "#f7f8f9ff",
            borderRadius: 6,
          }}
        >
          <h3>Transaction Summary</h3>
          {orderResp.error ? (
            <p style={{ color: "red" }}>Error: {orderResp.error}</p>
          ) : (
            <div>
              <h4>Order</h4>
              <pre>{JSON.stringify(orderResp.order, null, 2)}</pre>

              <h4>Payment</h4>
              <pre>{JSON.stringify(orderResp.payment, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* All orders table - bottom right */}
      {allOrders.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 400,
            maxHeight: 300,
            overflowY: "auto",
            background: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 10,
            boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
            fontSize: 12,
          }}
        >
          <h4 style={{ marginTop: 0 }}>All Orders</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Product</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>Qty</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>Total</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id.slice(0, 6)}...</td>
                  <td>{order.product.name}</td>
                  <td style={{ textAlign: "right" }}>{order.quantity}</td>
                  <td style={{ textAlign: "right" }}>${order.total.toFixed(2)}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
