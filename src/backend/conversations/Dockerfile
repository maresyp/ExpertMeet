FROM python:3.12

# set work directory
WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# copy project
COPY . .

CMD python manage.py makemigrations && \
    python manage.py migrate && \
    gunicorn conversations.wsgi:application --bind 0.0.0.0:8082