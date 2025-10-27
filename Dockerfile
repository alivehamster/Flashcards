FROM node:22-alpine
# Create app directory
WORKDIR /usr/src/app

COPY ./ ./

RUN npm ci --omit=dev
RUN npm run build

EXPOSE 4321

CMD [ "node", "./dist/server/entry.mjs" ]