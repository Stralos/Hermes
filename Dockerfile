FROM node:8-alpine

USER node
WORKDIR /home/node


COPY package.json package.json
RUN npm install

COPY src src
COPY config config
COPY tsconfig.json tsconfig.json

ADD docker-entrypoint.sh entrypoint.sh
ENTRYPOINT ["/home/node/entrypoint.sh"]