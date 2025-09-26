import os
from databases import Database
from dotenv import load_dotenv

# Load environment variables from .env if it exists
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "orderdb")
DB_USER = os.getenv("DB_USER", "order_user")
DB_PASS = os.getenv("DB_PASS", "order_pass")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

database = Database(DATABASE_URL)
