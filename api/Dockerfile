FROM node:20.12.1-slim

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
RUN rm -rf node_modules
RUN rm -rf yarn.lock

# Install app dependencies
RUN yarn install

# Build the TypeScript files
RUN yarn build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD npm run start
