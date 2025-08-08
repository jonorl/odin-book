# Use the official Node.js image as a base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Cloud Run will automatically set the PORT environment variable.
# Your app needs to listen on process.env.PORT.
CMD ["npm", "start"]