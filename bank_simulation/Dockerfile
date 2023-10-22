FROM python:3.9.18-slim-bullseye

COPY entrypoint.py /root/entrypoint.py

# FOR NOW, ENVS NEEDS TO BE PUTTED IN HERE

RUN apt-get update && \
    apt-get install -y cron && \
    pip3 install psycopg2-binary python-dotenv

WORKDIR /root

RUN echo "1 8,12,16,20 * * * /usr/local/bin/python3 /root/entrypoint.py >> /var/log/cron.log 2>&1" > /etc/cron.d/cronjob_python
RUN touch /var/log/cron.log

RUN chmod 0644 /etc/cron.d/cronjob_python

RUN crontab /etc/cron.d/cronjob_python

CMD cron && sleep infinity
