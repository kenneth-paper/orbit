FROM node:8.16-alpine
RUN apk update && apk add bash && apk add mysql-client

#getting code to container
RUN mkdir /home/app
ADD . /home/app

WORKDIR /home/app
RUN cd /home/app

#install package
RUN npm config set unsafe-perm true

#expose files
EXPOSE 3000

CMD [ "npm" , "run", "start", "NODE_ENV=development" ]