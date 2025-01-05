# README

## Deployed web application
The live web application can be found at

https://languageapp.codex201.com/

## Running the codebase
If you wish to run the codebase yourself, please ensure you have docker installed.

All components of the web application including database, are created and managed using docker containers so a single command can be used to run the web application.

For development purposes, in the root folder of this codebase, run:

```bash
bash ./launch_dev_services.sh
```

and navigate to http://localhost:3000

To stop the dev containers run

```bash
docker compose stop -f docker-compose.dev.yml
```


For production, in the root folder of this codebase, run:

```bash
bash ./launch_prod_services.sh
```
and navigate to http://localhost:1336

To stop the production containers run:

```bash
docker compose stop -f docker-compose.prod.yml
```
