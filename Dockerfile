# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Change directory to src
WORKDIR src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Set the default command to run your app
CMD ["npm", "start"]
