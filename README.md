# kaven-file-server

## Docker

```sh
# copy `.env` file
docker run --name temp -d kavenzero/kaven-file-server:latest
mkdir env
docker cp temp:/env/.env.example $(pwd)/env/.env
docker rm -f temp

# run
docker run -d \
    -it \
    --name kaven-file-server \
    -p 3000:80 \
    -v $(pwd)/uploads:/app/uploads \
    -v $(pwd)/env:/app/env \
    kavenzero/kaven-file-server:latest
```

`/env/.env`

```ini
NODE_ENV=development

PORT=80

ENABLE_HTTPS=false
SSL_KEY_PATH=
SSL_CERT_PATH=

ENABLE_LOG=false
LOG_FILE_PATH=
ERROR_FILE_PATH=

ENABLE_AUTHENTICATION=false
AUTH_USER=Kaven
AUTH_PASS=kaven@wuwenkai.com
```
