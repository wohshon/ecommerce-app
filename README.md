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