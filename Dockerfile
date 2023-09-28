FROM node:18-alpine AS development

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000


FROM node:18-alpine as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

COPY --from=development app/dist ./dist

CMD ["node", "dist/main"]