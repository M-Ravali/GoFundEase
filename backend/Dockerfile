# Use Node.js 16 LTS as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# copy the environmental variables
COPY .env /

# Load environment variables from the .env file
ENV $(cat /.env | grep -v ^# | xargs)

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code to the container
COPY . .

# Expose port 8080
EXPOSE 8080

# Command to run your application
CMD ["npm", "start"]
