#!/bin/sh
# for quick testing, use latest tag
# ./build-all.sh docker.io or ./build-all.sh registry.wskn.local
# docker.io
# registry.wskn.local
echo "Building and Pushing all Docker images for ecommerce-app"
echo "for registry: $1"
cd ./product-service/
docker build -t $1/wohshon/product-service:latest .
docker push $i/wohshon/product-service:latest
cd ../order-service/
docker build -t $1/wohshon/order-service:latest .
docker push $1/wohshon/order-service:latest
cd ../payment-service/
docker build -t $1/wohshon/payment-service:latest .
docker push $1/wohshon/payment-service:latest
cd ../frontend/
docker build -t $1/wohshon/frontend:latest .
docker push $1/wohshon/frontend:latest

