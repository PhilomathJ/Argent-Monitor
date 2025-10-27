# Use the Alpine-based Node.js image for improved security and smaller size
FROM node:20-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json to install dependencies
COPY package*.json ./

# Install Express
# Note: Alpine uses 'apk' for package management, but 'npm' is cross-platform.
# Running 'npm install' remains the same.
RUN npm install --production

# Copy application files (server.js and public directory)
COPY server.js .
COPY public/ ./public/

# The Express server runs on port 8080
EXPOSE 8080

# Command to run the application
CMD [ "npm", "start" ]