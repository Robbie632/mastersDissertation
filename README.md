# Services

All services are run using docker-compose, they can be started by running

```
docker-compose up --build -d
```

## `backend/`

### REST API that interacts with Postgres database

#### API Documentation

**GET Endpoints:**

- `/api/rating`: Gets all ratings for a specific phrase.
- `/api/phrase`: Get all phrases.
- `/api/language`: Get all languages.
- `/api/phraseselection`: Get all phrases associated with a user and language.

**POST Endpoints:**

- `/api/rating`: Write a new rating to the database.
- `/api/phrase`: Write a new phrase to the database.
- `/api/language`: Write a new language to the database.
- `/api/phraseselection`: Write a new phrase to the phrase selection for a given user.

## `frontend/`

## Database

docker exec -it <containerid> bash
connect
psql -U languageapp

connect to dabase
\c <databasename>
list tables
\d 
list phrases
select * from phrases

for exploring database uncomment
command: jupyter-notebook --ip 0.0.0.0 --no-browser
in docker-compose.yml file
then build the containers with
docker-compose docker-compose up --build languageapp languageapp-db
then navigate to the url logged in the languageapp container
because the folder the notebook is in is volume mapped any changes you make in the browser will update dyour local copy of the notebook
you can now interact with the database
