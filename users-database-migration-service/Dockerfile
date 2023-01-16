FROM denoland/deno:ubuntu-1.29.3

WORKDIR /app
VOLUME /src
COPY ./src .

# TODO -> use env variables as used by the postgres client
ENV USERS_DB_PORT=1010
ENV USERS_DB_USER=admin
ENV USERS_DB_PASSWORD=admin

RUN deno install\
    --unstable\
    --allow-net=users-database:5432,deno.land\
    --allow-read=.\
    --allow-write=nessie.config.ts,db\
    --allow-env\
    -f\
    https://deno.land/x/nessie/cli.ts

# Used to keep container running
CMD ["tail", "-F", "anything"]

EXPOSE 1020
