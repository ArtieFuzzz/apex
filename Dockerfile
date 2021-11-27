# Base

FROM node:current-buster as base

WORKDIR /usr/apex

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . .

ENTRYPOINT ["dumb-init", "--"]

# Builder

FROM base as builder

WORKDIR /usr/apex/central

RUN yarn --immuntable
RUN yarn build

# RUNNER

FROM base as runner

USER node

EXPOSE 80

WORKDIR /usr/apex/central

CMD ["yarn", "start"]