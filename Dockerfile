# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose port
EXPOSE 4000

# Start dev server with ts-node-dev
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/server.ts"]

