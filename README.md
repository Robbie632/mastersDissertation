## Database

To access the database container, run:

``` docker exec -it <containerid> bash```

Connect to PostgreSQL:

```psql -U languageapp```

to list databases

`\l`

Once connected, select the desired database:

`\c <databasename>`

To list tables:

`\d`

To list phrases:

```select * from phrases```

For exploring the database interactively, follow these steps:

1. Uncomment the following line in `docker-compose.yml`:

```# command: jupyter-notebook --ip 0.0.0.0 --no-browser```

2. Build the containers:

```docker-compose up --build languageapp languageapp-db-test```

3. Navigate to the URL logged in the languageapp container.

Since the notebook's folder is volume mapped, any changes made in the browser will update your local copy of the notebook. Now you can interact with the database.
