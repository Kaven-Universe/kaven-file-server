FROM node:lts-alpine as build

WORKDIR /app

COPY . .

RUN npm install --production && npm i -g @vercel/ncc

RUN ncc build index.js -o dist

FROM node:lts-alpine

WORKDIR /app

# COPY --from=build /app/dist .
COPY --from=build /app/dist/index.js .
COPY env env

LABEL name="kaven-file-server" \
    author="Kaven" \
    email="kaven@wuwenkai.com" \
    version="1.0.3" \
    description="A simple http(s) server for file upload."

EXPOSE 80:80
CMD [ "node", "index.js" ]