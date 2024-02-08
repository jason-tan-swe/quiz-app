# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the entire application into the container
COPY . .

# Build the Vite frontend
RUN cd client && npm install && npm run build

# Expose port 3001 for the backend
EXPOSE 3000
EXPOSE 5173

# Start both backend and frontend
CMD ["npm", "start"]
