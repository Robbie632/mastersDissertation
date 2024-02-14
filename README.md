# Services

All services are run using docker-compose, they can be started by running

```
docker-compose up --build -d
```

## `backend/`

### REST API that interacts with Postgres database

#### API Documentation

**GET Endpoints:**

- `/api/rating`: Modify to all ratings for a specific phrase.
- `/api/phrase`: Get all phrases.
- `/api/language`: Get all languages.
- `/api/phraseselection`: Modify to get all phrases associated with a user.

**POST Endpoints:**

- `/api/rating`: Write a new rating to the database.
- `/api/phrase`: Write a new phrase to the database.
- `/api/language`: Write a new language to the database.
- `/api/phraseselection`: Write a new phrase to the phrase selection for a given user.

## `frontend/`