FROM node:18

WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of frontend code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
