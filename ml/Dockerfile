FROM python

WORKDIR /ml

COPY ./requirements.txt /ml/requirements.txt 

RUN python -m pip install --upgrade pip

# rust is dependency for python library cryptography so need to install it
RUN pip install -r requirements.txt

COPY ./ml /ml/src


EXPOSE 8888

CMD ["jupyter-notebook", "--ip", "0.0.0.0", "--no-browser", "--allow-root"]

