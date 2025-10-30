# ----------------------------
# Stage 1: Build React app
# ----------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY public ./public
COPY src ./src

# Build React app
RUN npm run build

# ----------------------------
# Stage 2: Minimal image to serve static files
# ----------------------------
FROM node:20-slim

WORKDIR /app

# Install lightweight static server
RUN npm install -g serve

# Copy build artifacts
COPY --from=build /app/build ./build

# Expose port
EXPOSE 80

# Start serving React app
CMD ["serve", "-s", "build", "-l", "80"]
