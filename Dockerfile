FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install --production

LABEL name="kaven-file-server" \
    author="Kaven" \
    email="kaven@wuwenkai.com" \
    version="1.0.2" \
    description="A simple http server for file upload."

EXPOSE 80:80
CMD [ "node", "index.js" ]