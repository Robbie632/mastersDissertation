
# supplementary readme 

This readme is not intended for examiners, but instead contains useful information for the developer when deploying the web application.

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
* ssh in with username@\<ipaddress>
* Install docker using below instructions

briefly:
* update apt repositories
```sudo apt-get update && sudo apt-get upgrade```
* fetch script for installing docker
```curl -fsSL https://get.docker.com -o get-docker.sh```
* install docker

```sudo sh get-docker.sh```
* Give user docker privelages

```sudo gpasswd -a <user> docker```
```newgrp docker```

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

`bash ./launch_prod_services.sh`

* The web application will then be accessible on 

`<rpi ipaddress>:3000`

### firewall (optional but good idea)

```sudo apt install ufw```

```sudo ufw allow 22```

```sudo ufw allow 9000```

```sudo ufw show added```

```sudo ufw enable```


## update ip address used for API calls in frontend 
update `REACT_APP_SERVER_IP` in `frontend/src/env.js`

# hosting
* connect the rpi to a guest network seperate to your main network 
* buy a domain name with a registrar, I used cheapname
* Implement tunneling with cloudflare, this is required because on vodafone guest network port forwarding isn't possible, so instead tunnel needs to be used
* Need to make cloudfare your authoratative DNS 
* add public hostname on cloudfare

# Analysis
* navigate to analysis directory
* put any data you want to analyse in analysis/volume as this is mounted on the container
* run 

```bash launch_analysis_services.sh```

navigate to 

```http://localhost:8888```

look at container logs to find token, copy and pasted into box
