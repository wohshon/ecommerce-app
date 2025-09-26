import sqlalchemy

# Match the same credentials you used when running your local Postgres container
DATABASE_URL = "postgresql://order_user:order_pass@localhost:5432/orderdb"

# Create engine
engine = sqlalchemy.create_engine(DATABASE_URL)

metadata = sqlalchemy.MetaData()

orders = sqlalchemy.Table(
    "orders",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("product_id", sqlalchemy.Integer),
    sqlalchemy.Column("product_name", sqlalchemy.String),
    sqlalchemy.Column("price", sqlalchemy.Float),
    sqlalchemy.Column("quantity", sqlalchemy.Integer),
    sqlalchemy.Column("total", sqlalchemy.Float),
    sqlalchemy.Column("status", sqlalchemy.String),
)

# Create all tables
metadata.create_all(engine)
print("Database initialized successfully!")
