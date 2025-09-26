# ecommerce-apps

### Setup steps from scratch
```
# parent folder, assuming using user folder as root 
mkdir -p ~/projects/ecommerce-demo
cd ~/projects/ecommerce-demo

# Repo 1: microservices + frontend
mkdir -p ecommerce-apps/{product-service,order-service,payment-service,frontend}

# Repo 2: infra
mkdir -p ecommerce-infra/db
mkdir -p ecommerce-infra/k8s

# Optional: init git repos
cd ecommerce-apps && git init && echo "# ecommerce-apps" > README.md && git add README.md && git commit -m "init apps repo"
cd ../ecommerce-infra && git init && echo "# ecommerce-infra" > README.md && git add README.md && git commit -m "init infra repo"
```

```
ecommerce-demo/
├─ ecommerce-apps/
│  ├─ product-service/
│  ├─ order-service/
│  ├─ payment-service/
│  └─ frontend/
└─ ecommerce-infra/
   ├─ db/
   └─ k8s/
   ```

### some additional setup
For order service `pip install fastapi[all]` or in zsh `pip install "fastapi[all]"`  
For the other 2 services `npm install cors`
### for all services 
E.g.: 
```
cd ecommerce-apps/$SERVICE_NAME

# build Docker image
docker build -t docker.io/wohshon/$SERVICE_NAME .
```


### Test endpoint

```
curl http://localhost:$PORT:/health
curl http://localhost:$PORT:/<service>
```
service can be products , orders

For payment:
```
curl -X POST http://localhost:8083/pay -H "Content-Type: application/json" \
    -d '{"orderId":"test123","amount":100}'
```

### Frontend project setup

```
cd ecommerce-apps/frontend
npx create-react-app .   # initialize current folder

frontend/
├─ public/
├─ src/
│  ├─ App.js
│  └─ index.js
├─ package.json
└─ ...

```

### Run locally
```
# run container
docker run -p $PORT:$PORT docker.io/wohshon/$SERVICE_NAME

# with dynamic cors enablment
docker run -d  -p $PORT:$PORT \
  -e FRONTEND_URLS="http://localhost:3000,http://dev.example.com" \
  docker.io/wohshon/$SERVICE:latest
```

e.g.

```
docker run -d --name product-service -p 8081:8081 \
  -e FRONTEND_URLS="http://localhost:3000,http://dev.example.com" \
  docker.io/wohshon/product-service:latest
```

### Multi arch 

```
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/order-service:latest --push .
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/product-service:latest --push .
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/payment-service:latest --push .
docker buildx build --platform linux/amd64,linux/arm64 -t docker.io/wohshon/frontend:latest --push .
```

```
For local testing, you can override these by creating a .env.local file in your frontend repo:
in server.js
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE || 'http://localhost:8081';
const ORDER_SERVICE = process.env.ORDER_SERVICE || 'http://localhost:8082';
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE || 'http://localhost:8083';

to run in dev, do not use npm start

npm run build # this generate the static file in build folder
then run
node server.js # start the server side + load static file in build

```

### order service 

#### Local test
```
uvicorn main:app --host 0.0.0.0 --port 8082


docker run -d \
  --name postgres-local \
  -e POSTGRES_USER=order_user \
  -e POSTGRES_PASSWORD=order_pass \
  -e POSTGRES_DB=orderdb \
  -p 5432:5432 \
  postgres

docker rm postgres-local

docker exec -it postgres-local psql -U order_user -d orderdb

orderdb=# \d
```

#### K8s

db deinition (secrets and pvc request all in )
```
dn/order-postgres.yaml

```