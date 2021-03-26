FROM node:10.17.0-jessie

#getting code to container
RUN mkdir /home/app
ADD . /home/app

WORKDIR /home/app
RUN cd /home/app

#arg
ARG APP_ENV
ENV NODE_ENV=$APP_ENV
#remove node modules
RUN npm cache clean --force
RUN rm -f package-lock.json
RUN rm -rf node_modules

#install package
RUN npm config set unsafe-perm true
RUN npm install -g --unsafe-perm --allow-root
RUN npm install --unsafe-perm --allow-root
RUN npm install -g pm2

#run migration
RUN npm run typeorm migration:run

RUN npm run build
#expose files
EXPOSE 3000

CMD [ "pm2-runtime","dist/src/main.js"]