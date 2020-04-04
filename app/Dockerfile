FROM python:3.6.8-alpine3.9

LABEL MAINTAINER="FirstName LastName <example@domain.com>"

ENV GROUP_ID=1000 \
    USER_ID=1000

WORKDIR /var/www/

COPY ./requirements.txt /var/www/requirements.txt
RUN pip install -r requirements.txt
COPY . /var/www/
RUN pip install gunicorn

RUN addgroup -g $GROUP_ID www
RUN adduser -D -u $USER_ID -G www www -s /bin/sh

USER www

EXPOSE 5000

# Run gunicorn with 4 workers and bound to port 5000, wsgi is the app
CMD [ "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000", "wsgi"]