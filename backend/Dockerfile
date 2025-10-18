#Node.js image
FROM node:18

#Directory inside container
WORKDIR /usr/src/app

#Copy package.json and package-lock.json
#COPY package*.json ./

#Install dependencies
#RUN npm install

#Copy rest of apps source code
COPY . .

#Expose port 500
#EXPOSE 5000

#Run app
#CMD ["npm", "start"]
CMD ["echo", "Node container setup successful!"]
