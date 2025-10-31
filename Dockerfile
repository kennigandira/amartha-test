# Use Node 20 LTS Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run Vite dev server with host flag to make it accessible from outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
