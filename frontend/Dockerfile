FROM node:20-alpine

WORKDIR /app

# Install all dependencies, including react-scripts
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build React app
RUN npm run build

EXPOSE 80
CMD ["node", "server.js"]