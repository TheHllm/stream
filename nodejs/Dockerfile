FROM node
# Create app directory
WORKDIR /app

# Install app dependencies
COPY ./package.json /app/

RUN npm install

# Bundle app source
COPY . /app/

#Compile tsc
RUN npm run tsc

EXPOSE 5000
CMD [ "node", "dist/index.js" ]