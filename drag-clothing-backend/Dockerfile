# Step 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy application source
COPY . .

# Build production bundle
RUN npm run build

# Step 2: Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package manifests and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port (Cloud Run defaults to 8080 or PORT env)
EXPOSE 8080

# Start NestJS application
CMD ["node", "dist/main"]
