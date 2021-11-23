# kaven-file-server

## Docker

```sh
# Linux
docker run -d \
    -it \
    --name kaven-file-server \
    -p 3000:80 \
    -v $(pwd)/uploads:/app/uploads \
    -v $(pwd)/env:/app/env \
    kavenzero/kaven-file-server:main

# Powershell
docker run -d -it --name kaven-file-server -p 3000:80 -v ${PWD}/uploads:/app/uploads -v ${PWD}/env:/app/env kavenzero/kaven-file-server:main

# CMD
docker run -d -it --name kaven-file-server -p 3000:80 -v %cd%/uploads:/app/uploads %cd%/env:/app/env kavenzero/kaven-file-server:main
```

`/env/.env.example`

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
