# Postgres

Some notes for future me.

## Launch postgres
```bash
npm run start-db
```
I named the container `postgres` specced by the `docker-compose.yaml` file in `docker/` and setup a postgres user with the credentials given in the .env file.

## Inspect logs
```bash
docker logs postgres
```

## Shell into container
This is nice for sandboxing some sql. Shell into the container and run the postgres cli tool as the postgres user:
```bash
docker exec -it postgres /bin/bash
...
psql -U postgres mydb
```

## CLI Commands
List all databases:
```postgres
\l
```

list all tables in database (`+` gives additional info):
```postgres
\dt+
```