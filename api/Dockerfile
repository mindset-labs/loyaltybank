FROM node:20.12.1-slim

# Install dependencies required for Prisma and general development
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    pkg-config \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript files
RUN yarn build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start"]
