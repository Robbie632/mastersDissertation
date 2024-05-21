FROM python:3

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt 

RUN apt-get update

RUN apt-get install -y \
    build-essential \
    curl
#python package crypotgraphy requires rus so need to install Rust
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y

ENV PATH="/root/.cargo/bin:$PATH"

RUN python3 -m pip install --upgrade pip

RUN pip install -r requirements.txt

COPY ./src /app/src

COPY ./tests /app/tests

#COPY ./explore.ipynb /app/explore.ipynb

EXPOSE 5000

#EXPOSE 8888

CMD ["flask", "--app", "src", "run", "--debug", "--host", "localhost", "--port", "5000"]