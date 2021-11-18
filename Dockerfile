FROM node:lts-slim

WORKDIR /app

COPY . .

RUN npm install --production

LABEL name="kaven-file-server" \
    author="Kaven" \
    email="kaven@wuwenkai.com" \
    version="latest" \
    description=""

EXPOSE 80:80
CMD [ "node", "index.js" ]