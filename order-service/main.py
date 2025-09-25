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

class Product(BaseModel):
    id: int
    name: str
    price: float
    image: str

class OrderIn(BaseModel):
    product: Product
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
    total = round(order_in.product.price * order_in.quantity, 2)
    order_id = str(uuid4())
    order = Order(
        id=order_id,
        product=order_in.product,
        quantity=order_in.quantity,
        total=total,
        status="created"
    )
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
