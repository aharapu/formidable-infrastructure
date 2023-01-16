# syntax=docker/dockerfile:1
FROM denoland/deno:ubuntu-1.29.3

WORKDIR /app
VOLUME /src
COPY ./src .

ENV USERS_DB_PORT=1010
ENV USERS_DB_USER=admin
ENV USERS_DB_PASSWORD=admin

RUN deno install --unstable --allow-net=localhost:1010 --allow-read=. --allow-write=nessie.config.ts,db -f  https://deno.land/x/nessie/cli.ts
CMD ["tail", "-F", "anything"]

EXPOSE 1020
