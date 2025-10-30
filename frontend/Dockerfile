# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Stage 2: Node server for frontend + proxy
FROM node:20-alpine

WORKDIR /app

# Copy package.json (for production deps)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy React build from previous stage
COPY --from=build /app/build ./build

# Copy server.js
COPY server.js .

# Expose port
EXPOSE 80

# Start Node server
CMD ["node", "server.js"]