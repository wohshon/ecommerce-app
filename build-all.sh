#!/bin/sh
# for quick testing, use latest tag
cd ./product-service/
docker build -t docker.io/wohshon/product-service:latest .
docker push docker.io/wohshon/product-service:latest
cd ../order-service/
docker build -t docker.io/wohshon/order-service:latest .
docker push docker.io/wohshon/order-service:latest
cd ../payment-service/
docker build -t docker.io/wohshon/payment-service:latest .
docker push docker.io/wohshon/payment-service:latest
cd ../frontend/
docker build -t docker.io/wohshon/frontend:latest .
docker push docker.io/wohshon/frontend:latest