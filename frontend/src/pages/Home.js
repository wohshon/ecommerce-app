import React, { useEffect, useState } from "react";
import "../App.css"; // global styles

// API endpoints (proxied via Node.js server)
const PRODUCT_SERVICE_URL = "/api/product/products";
const ORDER_SERVICE_URL = "/api/order/orders";
const PAYMENT_SERVICE_URL = "/api/payment/pay";

function Home() {
  const [products, setProducts] = useState([]);
  const [orderResp, setOrderResp] = useState(null);
  const [quantities, setQuantities] = useState({}); // track quantities for each product
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(PRODUCT_SERVICE_URL)
      .then(r => r.json())
      .then(setProducts)
      .catch(err => console.error("Product fetch error:", err));
  }, []);

  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1); // minimum 1
    setQuantities(prev => ({ ...prev, [productId]: qty }));
  };

  async function buy(product) {
    const qty = quantities[product.id] || 1;
    setLoading(true);

    try {
      console.log(`Creating order for ${product.name}, Qty: ${qty}`);

      // Step 1: Create the order
      const order = await fetch(ORDER_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, quantity: qty })
      }).then(r => {
        if (!r.ok) throw new Error(`Order service error: ${r.status}`);
        return r.json();
      });

      console.log("Order created:", order);

      // Step 2: Process payment
      const payment = await fetch(PAYMENT_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, amount: order.total })
      }).then(r => {
        if (!r.ok) throw new Error(`Payment service error: ${r.status}`);
        return r.json();
      });

      console.log("Payment processed:", payment);

      // Update UI with both order and payment
      setOrderResp({ order, payment });
    } catch (err) {
      console.error("Transaction failed:", err);
      setOrderResp({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Ecommerce Demo</h1>
      <h2>Products</h2>

      {products.length === 0 ? (
        <div>Loading products...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px"
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
                boxShadow: "2px 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", borderRadius: 4, marginBottom: 8 }}
              />
              <h3>{p.name}</h3>
              <p style={{ fontWeight: "bold" }}>${p.price.toFixed(2)}</p>

              {/* Quantity input */}
              <div style={{ marginBottom: 8 }}>
                <input
                  type="number"
                  min="1"
                  value={quantities[p.id] || 1}
                  onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                  style={{
                    width: "60px",
                    padding: "4px",
                    textAlign: "center",
                    marginRight: "8px"
                  }}
                />
              </div>

              {/* Buy button */}
              <button
                onClick={() => buy(p)}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Buy"}
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
            background: "#e7f5ff",
            borderRadius: 6
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
    </div>
  );
}

export default Home;
