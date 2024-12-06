# syntax=docker/dockerfile:1.4

FROM node:20-bookworm-slim AS development

WORKDIR /usr/local/app

COPY package.json package-lock.json ./
RUN npm ci

RUN useradd app
COPY --chown=app . /usr/local/app
EXPOSE 3000
USER app

CMD [ "npm", "start" ]
