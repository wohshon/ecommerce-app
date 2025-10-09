#!/bin/sh
# for quick testing, use latest tag
cd ./product-service/
docker build -t registry.wskn.local/wohshon/product-service:latest .
docker push registry.wskn.local/wohshon/product-service:latest
cd ../order-service/
docker build -t registry.wskn.local/wohshon/order-service:latest .
docker push registry.wskn.local/wohshon/order-service:latest
cd ../payment-service/
docker build -t registry.wskn.local/wohshon/payment-service:latest .
docker push registry.wskn.local/wohshon/payment-service:latest
cd ../frontend/
docker build -t registry.wskn.local/wohshon/frontend:latest .
docker push registry.wskn.local/wohshon/frontend:latest

