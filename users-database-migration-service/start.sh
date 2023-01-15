mkdir -p "./../DENO_DIR"

export DENO_DIR="./../DENO_DIR"

deno run --allow-net ./server.ts

# TODO -> make it point to the config file?
# deno run --allow-net --config ../deno.json ./server.ts

deno install --unstable --allow-net=localhost:5432 --allow-read=. --allow-write=nessie.config.ts,db -f  https://deno.land/x/nessie/cli.ts
