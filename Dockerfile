# syntax=docker/dockerfile:1.4

FROM node:20-bookworm-slim AS development

WORKDIR /usr/local/app
RUN chown node:node /usr/local/app
USER node

COPY package.json package-lock.json ./
RUN npm ci
COPY --chown=app . .

EXPOSE 3000

CMD [ "npm", "start" ]
