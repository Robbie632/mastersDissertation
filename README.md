# README

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
`https://www.raspberrypi.com/software/`
* During set up, add wifi credentials and enable ssh
* Insert formatted SD card containing OS into raspberry pi and turn on raspberry pi
* Wait, check wifi homepage to see connected and make note of ip address
* ssh in with username@<ipaddress>
* Install docker using below instructions

briefly:
* update apt repositories
```sudo apt-get update && sudo apt-get upgrade```
* fetch script for installing docker
```curl -fsSL https://get.docker.com -o get-docker.sh```
* install docker

```sudo sh get-docker.sh```
* Give user docker privelages
```sudo usermod -aG docker <username>```

These commands are from:

https://www.simplilearn.com/tutorials/docker-tutorial/raspberry-pi-docker

* Set up ssh key

`https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent`

* Clone repo

* Add secrets to directory

`mastersDissertation/backend/src/secrets`

* create directory `languageappdata` in home directory, this is where database data is stored on the host (via volume mapping between docker environment and host environment as defined in docker-compose file/)

```cd```
```mkdir languageappdata```

* Navigate to root of repository, then run software with 

`docker compose up --build -d`

* The web application will then be accessible on 

`<rpi ipaddress>:3000`

### firewall (optional but good idea)

```sudo apt install ufw```

```sudo ufw allow 22```

```sudo ufw allow 9000```

```sudo ufw show added```
```sudo ufw enable```

## comment out unsupported packages
comment out packages
`jupyterlab`
`notebook`
defined in 
`backend/requirements.txt`
because these arent supported in raspberry pi

## update ip address used for API calls in frontend 
update `REACT_APP_SERVER_IP` in `backend/src/env.js`