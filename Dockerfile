#Base Stage for app
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
EXPOSE 3000
EXPOSE 5555

#Build stage
FROM base AS build
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build


#Development Stage
FROM base AS development
RUN yarn install --frozen-lockfile
COPY . .
CMD ["yarn", "dev:all"]


#Production Stage
FROM base AS production
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --production
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=base /app/package.json /app/package.json
CMD ["yarn", "start"]
