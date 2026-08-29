# ── Stage 1: Build React/Vite Assets ──
FROM node:20-alpine AS builder
WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx Alpine ──
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default Nginx website
RUN rm -rf ./*

# Copy built frontend assets
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web server port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
