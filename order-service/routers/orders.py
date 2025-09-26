from fastapi import APIRouter, HTTPException
from uuid import uuid4
from db import database
from models import orders

router = APIRouter()

@router.post("/orders")
async def create_order(order_in: dict):
    """
    Expects payload like:
    {
      "product": {
        "id": 1,
        "name": "Laptop",
        "price": 1499.99
      },
      "quantity": 2
    }
    """
    product = order_in.get("product")
    quantity = order_in.get("quantity")

    if not product or not quantity:
        raise HTTPException(status_code=400, detail="Invalid input")

    total = product["price"] * quantity
    order_id = str(uuid4())

    query = orders.insert().values(
        id=order_id,
        product_id=product["id"],
        product_name=product["name"],
        price=product["price"],
        quantity=quantity,
        total=total,
        status="created"
    )
    await database.execute(query)

    return {
        "id": order_id,
        "product": product,
        "quantity": quantity,
        "total": total,
        "status": "created"
    }

@router.get("/orders")
async def list_orders():
    query = orders.select()
    return await database.fetch_all(query)
