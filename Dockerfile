FROM node:14-alpine

ENV NODE_ENV production

COPY . /app
WORKDIR /app
RUN npm ci

CMD ["node", "/app"]