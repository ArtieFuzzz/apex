FROM node:current-buster-slim

WORKDIR /usr/apex

RUN apt-get update && \
    apt-get upgrade --no-install-recommendeds -y && \
    apt-get install --no-install-recommendeds -y build-essential python3 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . .

ENTRYPOINT ["dumb-init", "--"]

#] =========== [#
#]    BUILD    [#
#] =========== [#

WORKDIR /usr/apex/central

RUN yarn install
RUN yarn build

RUN yarn cache clear

#] ========== [#
#]    RUN     [#
#] ========== [#

USER node

EXPOSE 4090

CMD ["yarn", "start"]