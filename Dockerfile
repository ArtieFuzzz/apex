#] ======== [#
#]   BASE   [#
#] ======== [#

FROM node:current-buster@sha256:e2ad2c659bc2ed6fbbdb346b5eeabca368aedb77e2b7c8e74c0776a07493f1cc as base

WORKDIR /usr/apex

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . .

ENTRYPOINT ["dumb-init", "--"]

#] =========== [#
#]   BUILDER   [#
#] =========== [#

FROM base as builder

WORKDIR /usr/apex/central

RUN yarn --immuntable
RUN yarn build

RUN yarn cache clear

#] ========== [#
#]   RUNNER   [#
#] ========== [#

FROM base as runner

USER node

EXPOSE 4090

WORKDIR /usr/apex/central

CMD ["yarn", "start"]