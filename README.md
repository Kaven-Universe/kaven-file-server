# kaven-file-server

## Docker

```sh
docker run -d -it --name kaven-file-server \
    -p 3000:80 \
    -v "$(pwd)"/uploads:/app/uploads \
    kavenzero/kaven-file-server:main
```
