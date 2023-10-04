# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR .

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose a port for your Node.js app to listen on (e.g., 3000)
EXPOSE 5000

# Define the command to run your Node.js application
CMD [ "node", "main.js" ]
