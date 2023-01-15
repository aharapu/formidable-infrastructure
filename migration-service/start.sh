mkdir -p "./../DENO_DIR"

export DENO_DIR="./../DENO_DIR"

deno run --allow-net ./server.ts

# TODO -> make it point to the config file?
# deno run --allow-net --config ../deno.json ./server.ts
