# syntax=docker/dockerfile:1.0-experimental
FROM node:14-alpine
ARG APP_ENV
ARG COMPOSER_AUTH
ARG CLUSTER_K8S
ENV COMPOSER_AUTH=$COMPOSER_AUTH
ENV APP_ENV ${APP_ENV} ${NODE_ENV}
# Set workdir
WORKDIR /home/app
# Add files
COPY . .
# COPY .env files
RUN if [ "${APP_ENV}" = "staging" ]; then \
    cp ./environment/.env.staging.${CLUSTER_K8S} .env; \
    else \
    cp .env.${APP_ENV} .env; \
    fi
# COPY .env files
ARG APP_ENV
ARG CLUSTER_K8S
ENV APP_ENV ${APP_ENV} ${NODE_ENV}
RUN if [ "${APP_ENV}" = "staging" ]; then \
    cp ./environment/.env.staging.${CLUSTER_K8S} .env.${APP_ENV}; \
    else \
    cp .env.${APP_ENV} .env; \
    fi
# Update, install package, remove module and unused file
RUN apk update --no-cache && \
    apk add --no-cache bash && \
    apk add --no-cache -U tzdata && \
    cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime && \
    npm cache clean --force && \
    #rm -f package-lock.json && \
    rm -rf node_modules && \
    # Remove unwanted files
    rm -rf Dockerfile \
    dockerfile \
    Dockerfile.bak \
    dockerfile.bak \
    Jenkinsfile \
    id_rsa_private_jenkins \
    .git \
#    .env.* \
    deployment

# Install package & run
RUN --mount=type=cache,target=/root/.npm,rw npm config set unsafe-perm true && \
    npm install -g --unsafe-perm --allow-root && \
    npm install --unsafe-perm --allow-root && \
    npm install -g pm2 && \
    npm run build \
    npm run typeorm:run
# Declare another Args Docker build
ARG APP_ENV
ENV APP_ENV ${APP_ENV} ${NODE_ENV}
# Expose
EXPOSE 3000
# Start application
CMD pm2-runtime ecosystem.config.js --env ${APP_ENV}
