import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="order-service")

# Read FRONTEND_URLS from environment variable, fallback to localhost
frontend_urls = os.getenv("FRONTEND_URLS", "http://localhost:3000")
origins = [url.strip() for url in frontend_urls.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
PORT = 8082  # not used directly, we map in Dockerfile

# In-memory orders store
orders = {}

class OrderIn(BaseModel):
    product_id: int
    quantity: int

class Order(OrderIn):
    id: str
    total: float
    status: str

@app.get("/health")
def health():
    return {"status": "ok", "service": "order"}

@app.post("/orders", response_model=Order)
def create_order(order_in: OrderIn):
    # naive pricing
    price_map = {1: 1499.99, 2: 799.99, 3: 9.99}
    price = price_map.get(order_in.product_id, 0)
    total = round(price * order_in.quantity, 2)
    order_id = str(uuid4())
    order = Order(id=order_id, product_id=order_in.product_id, quantity=order_in.quantity, total=total, status="created")
    orders[order_id] = order
    return order

@app.get("/orders/{order_id}", response_model=Order)
def get_order(order_id: str):
    order = orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="order not found")
    return order

@app.get("/orders")
def list_orders():
    return list(orders.values())
