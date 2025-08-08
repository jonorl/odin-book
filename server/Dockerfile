# Use a recommended Node.js base image
FROM node:20-slim

# Set the working directory to /app
WORKDIR /app

# Define a build argument for the database URL
ARG DATABASE_URL

# Set the DATABASE_URL environment variable for the build
ENV DATABASE_URL=$DATABASE_URL

# Copy package.json and package-lock.json first
COPY package*.json ./

# Copy the prisma directory next, so prisma generate can find the schema
COPY prisma ./prisma

# Install application dependencies and trigger the postinstall script
RUN npm install

# Copy the rest of the application code
COPY . .

# The PORT environment variable is automatically set by Cloud Run.
CMD ["npm", "start"]