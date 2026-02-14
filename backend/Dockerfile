# Use Node 18 as the base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Set environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
