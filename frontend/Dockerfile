# ============================================================
# DOCKERFILE - Frontend (React)
# ============================================================
# Multi-stage build:
#   Stage 1: Build React app (npm run build → creates static files)
#   Stage 2: Serve with Nginx (lightweight web server)
# ============================================================

# STAGE 1: Build React
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (for layer caching)
# If package.json didn't change, Docker skips npm install
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY public ./public
COPY src ./src

# Build React for production
# Creates optimized static files in /app/build folder
RUN npm run build

# ============================================================
# STAGE 2: Serve with Nginx
# ============================================================
# nginx:alpine = very small Nginx image (only ~5MB!)
FROM nginx:alpine

# Copy built React files to Nginx's serving directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config (handles React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx starts automatically as the default CMD in nginx image
