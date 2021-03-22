# syntax=docker/dockerfile:1.0-experimental
FROM node:10.17.0-jessie
ARG APP_ENV
ENV NODE_ENV=$APP_ENV
# Set workdir
WORKDIR /home/app
# Add files
ADD . /home/app
# Remove module and config package
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    rm -rf node_modules && \
    npm config set unsafe-perm true
# Install package & run
RUN --mount=type=cache,target=/root/.npm,rw npm install -g --unsafe-perm --allow-root && \
    npm install --unsafe-perm --allow-root && \
    npm install -g pm2 && \
    npm run build
# Expose
EXPOSE 3000
# Start application
CMD ["pm2-runtime","dist/src/main.js"]