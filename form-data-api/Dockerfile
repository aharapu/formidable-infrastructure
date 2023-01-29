FROM denoland/deno:ubuntu-1.29.3

WORKDIR /app

COPY ./src/deps.ts .
RUN deno cache deps.ts

ADD ./src .
RUN deno cache server.ts

# TODO -> restrict allow-net to specific domains and allow-env to specific variables
CMD ["deno", "run", "--allow-net", "--allow-env", "./server.ts"]
