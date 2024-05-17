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

## Deployment on raspberry pi

* put image on raspberry pi with imager software
* during set up add wifi credentials and enable ssh
* Insert formatted SD card containing OS into raspberry pi and turn on raspberry pi
* wait, check wifi homepage to see connected and make note of ip address
* ssh in with username@<ipaddress>
* install docker using below instructions

briefly:
```sudo apt-get update && sudo apt-get upgrade```

```curl -fsSL https://get.docker.com -o get-docker.sh```

```sudo sh get-docker.sh```

```sudo usermod -aG docker <username>```

These commands are from:

https://www.simplilearn.com/tutorials/docker-tutorial/raspberry-pi-docker

* set up ssh key

https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

* clone repo

### firewall

```sudo apt install ufw```
```sudo ufw allow 22```
```sudo ufw allow 9000```
```sudo ufw show added```
```sudo ufw enable```


* run software with docker compose up --build -d

* add secretes to

```
mastersDissertation/backend/secrets
```