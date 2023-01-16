This service uses deno's nessie to manage database migrations.

## Local development

1. Install deno version 1.29.3 (https://deno.land/manual/getting_started/installation)
2. Install nessie cli version 2.0.10 (https://deno.land/x/nessie@2.0.10)
```cmd
deno install --unstable --allow-net=localhost:1010 --allow-read=. --allow-write=nessie.config.ts,db -f  https://deno.land/x/nessie/cli.ts
```

Make sure you allow nessie access to the correct ports and files.

#### Create migration
```cmd
nessie make:migration <migration-name-in-snake-case>
```

#### Run migration
Use docker to access command line of postgres container
```cmd
nessie migrate
```

#### Create seed
```cmd
nessie make:seed <seed-name-in-snake-case>
```

#### Run seed
```cmd
nessie seed
```
