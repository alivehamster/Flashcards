FROM node:22-alpine
# Create app directory
WORKDIR /usr/src/app

ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME

# Set as environment variables for build
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME

COPY ./ ./

RUN npm ci --omit=dev
RUN npm run build

EXPOSE 4321

CMD [ "node", "./dist/server/entry.mjs" ]