# Python Web Server

## Websockets
https://websockets.readthedocs.io/en/stable/intro.html


## Docker
https://hub.docker.com/_/python/

You can then build and run the Docker image:

$ docker build -t my-python-app .
$ docker run -it --rm --name my-running-app my-python-app


SINGLE RUN
$ docker run -it --rm --name my-running-script -v "$PWD":/usr/src/myapp -w /usr/src/myapp python:3 python your-daemon-or-script.py