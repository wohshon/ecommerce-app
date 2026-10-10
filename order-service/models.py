import sqlalchemy
from sqlalchemy import Table, Column, Integer, String, Float, MetaData

metadata = sqlalchemy.MetaData()

orders = Table(
    "orders",
    metadata,
    Column("id", String, primary_key=True),
    Column("product_id", Integer),
    Column("product_name", String),
    Column("price", Float),
    Column("quantity", Integer),
    Column("total", Float),
    Column("status", String),
)
