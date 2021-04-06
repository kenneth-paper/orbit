# syntax=docker/dockerfile:1.0-experimental
FROM node:10-alpine
ARG APP_ENV
# Set workdir
WORKDIR /home/app
# Add files
ADD . .
# COPY .env files
COPY .env.${APP_ENV} .env
# Update, install package, remove module and unused file
RUN apk update --no-cache && \
    apk add --no-cache bash && \
    apk add --no-cache -U tzdata && \
    cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
    npm cache clean --force && \
    rm -f package-lock.json && \
    rm -rf node_modules && \
    rm -rf Dockerfile \
    dockerfile \
    Dockerfile.bak \
    dockerfile.bak \
    Jenkinsfile \
    id_rsa_private_jenkins 
# Install package & run
RUN --mount=type=cache,target=/root/.npm,rw npm config set unsafe-perm true && \
    npm install -g --unsafe-perm --allow-root && \
    npm install --unsafe-perm --allow-root && \
    npm install -g pm2 && \
    npm run build
# Expose
EXPOSE 3000
# Start application
CMD ["pm2-runtime","dist/src/main.js"]