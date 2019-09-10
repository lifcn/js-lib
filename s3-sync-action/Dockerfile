FROM python:3.7-alpine

LABEL repository="https://github.com/loyaltycorp/eoneo-js-sdk-v2"
LABEL homepage="https://github.com/loyaltycorp/eoneo-js-sdk-v2"
LABEL maintainer="Feng Li <feng.li@loyaltycorp.com.au>"

RUN pip install --quiet --no-cache-dir awscli
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]
