#!/bin/sh
# for quick testing, use latest tag
cd ./product-service/
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/product-service:latest --push .
# docker push docker.io/wohshon/product-service:latest
cd ../order-service/
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/order-service:latest --push .
# docker push docker.io/wohshon/order-service:latest
cd ../payment-service/
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/payment-service:latest --push .
# docker push docker.io/wohshon/payment-service:latest
cd ../frontend/
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/frontend:latest --push .
# docker push docker.io/wohshon/frontend:latest

