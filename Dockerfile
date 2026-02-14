# Use Node 18 as the base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend package files
COPY backend/package*.json ./backend/

# Install dependencies for the backend
RUN cd backend && npm install

# Copy the rest of the backend source code
COPY backend/ ./backend/

# Build the TypeScript code
RUN cd backend && npm run build

# Expose the port the app runs on (Render defaults to 10000 if not specified, 
# but our app uses process.env.PORT or 5000)
# Render will automatically map the container port to the public port.
EXPOSE 5000

# Set environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start", "--prefix", "backend"]
