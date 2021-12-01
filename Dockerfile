FROM node:current-buster

WORKDIR /usr/apex

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommended && \
    apt-get install -y --no-install-recommended python3 dumb-init && \
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