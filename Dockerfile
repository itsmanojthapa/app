#Base Stage for app
FROM node:20 AS base

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

EXPOSE 3000
EXPOSE 5555


#Development Stage
FROM base AS development

RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "dev:all"]


#Production Stage
FROM base AS production

RUN yarn install --frozen-lockfile --production

COPY --from=build /app/.next /app/.next
COPY --from=base /app/public /app/public
COPY --from=base /app/package.json /app/package.json

CMD ["yarn", "start"]
