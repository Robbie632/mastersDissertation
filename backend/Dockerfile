FROM python:alpine3.19

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt 

RUN python -m pip install --upgrade pip

# rust is dependency for python library cryptography so need to install it
RUN apk add --update \
  build-base \
  cairo \
  cairo-dev \
  cargo \
  freetype-dev \
  gcc \
  gdk-pixbuf-dev \
  gettext \
  jpeg-dev \
  lcms2-dev \
  libffi-dev \
  musl-dev \
  openjpeg-dev \
  openssl-dev \
  pango-dev \
  poppler-utils \
  postgresql-client \
  postgresql-dev \
  py-cffi \
  python3-dev \
  rust \
  tcl-dev \
  tiff-dev \
  tk-dev \
  zlib-dev

RUN pip install -r requirements.txt

COPY ./src /app/src

COPY ./tests /app/tests

# COPY ./explore.ipynb /app/explore.ipynb

EXPOSE 5000

EXPOSE 8888

CMD ["flask", "--app", "src", "run", "--debug", "--host", "0.0.0.0", "--port", "5000"]

