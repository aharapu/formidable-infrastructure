# TODO -> cache DENO dependencies
FROM denoland/deno:ubuntu-1.29.3

WORKDIR /app

VOLUME /src
COPY ./src .

CMD ["deno", "run", "--allow-net", "--allow-env", "./server.ts"]
