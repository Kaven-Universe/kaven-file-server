# kaven-file-server

## Docker

```sh
# copy `.env` file
mkdir env
docker run --name temp -d kavenzero/kaven-file-server:latest
docker cp temp:/app/env/.env.example $(pwd)/env/.env
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
