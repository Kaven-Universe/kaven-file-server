# kaven-file-server

## Docker

```sh
# Linux
docker run -d \
    -it \
    --name kaven-file-server \
    -p 3000:80 \
    -v $(pwd)/uploads:/app/uploads \
    kavenzero/kaven-file-server:main

# Powershell
docker run -d -it --name kaven-file-server -p 3000:80 -v ${PWD}/uploads:/app/uploads kavenzero/kaven-file-server:main

# CMD
docker run -d -it --name kaven-file-server -p 3000:80 -v %cd%/uploads:/app/uploads kavenzero/kaven-file-server:main
```
