# main.py
# Order Service API
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware
# Add these for database
from db import database
from models import orders
import sqlalchemy
from db import DATABASE_URL

app = FastAPI(title="order-service")

@app.on_event("startup")
async def startup():
    await database.connect()
    
    # Create table if missing
    engine = sqlalchemy.create_engine(DATABASE_URL)
    metadata = orders.metadata
    metadata.create_all(engine)


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


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

# health check
@app.get("/health")
def health():
    return {"status": "ok", "service": "order"}

@app.post("/orders", response_model=Order)
async def create_order(order_in: OrderIn):
    total = round(order_in.product.price * order_in.quantity, 2)
    order_id = str(uuid4())

    query = orders.insert().values(
        id=order_id,
        product_id=order_in.product.id,
        product_name=order_in.product.name,
        price=order_in.product.price,
        quantity=order_in.quantity,
        total=total,
        status="created"
    )
    await database.execute(query)

    return Order(
        id=order_id,
        product=order_in.product,
        quantity=order_in.quantity,
        total=total,
        status="created"
    )

@app.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    query = orders.select().where(orders.c.id == order_id)
    result = await database.fetch_one(query)

    if not result:
        raise HTTPException(status_code=404, detail="Order not found")

    product = Product(
        id=result["product_id"],
        name=result["product_name"],
        price=result["price"],
        image=""  # image is not stored in DB yet
    )

    return Order(
        id=result["id"],
        product=product,
        quantity=result["quantity"],
        total=result["total"],
        status=result["status"]
    )



@app.get("/orders", response_model=list[Order])
async def list_orders():
    query = orders.select()
    results = await database.fetch_all(query)

    return [
        Order(
            id=row["id"],
            product=Product(
                id=row["product_id"],
                name=row["product_name"],
                price=row["price"],
                image=""  # optional placeholder
            ),
            quantity=row["quantity"],
            total=row["total"],
            status=row["status"]
        )
        for row in results
    ]

@app.get("/orders", response_model=list[Order])
async def list_orders():
    query = orders.select()
    results = await database.fetch_all(query)
    return [
        Order(
            id=row["id"],
            product=Product(
                id=row["product_id"],
                name=row["product_name"],
                price=row["price"],
                image=""  # optional placeholder
            ),
            quantity=row["quantity"],
            total=row["total"],
            status=row["status"]
        )
        for row in results
    ]

