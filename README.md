![Docker Image CI](https://github.com/Big-Omega-3444/Resturant-Mangement/workflows/Docker%20Image%20CI/badge.svg?branch=master)

# Resturant-Mangement
CSCE 3444 Big Omega

This is a POS software

A new line in there

# In order to set this up for your enviroment:

In the docker-compose.yml modify 

MONGO_INITDB_ROOT_USERNAME: 
MONGO_INITDB_ROOT_PASSWORD: 

to be something other than the default

also modify 

#MONGODB_PASSWORD: 

to be the password you want to have set for your flaskuser

save docker-compose.yml

open a terminal (powershell)

and navigate to the Resturant-Mangement repository

run
`docker-compose up -d`

to see the services you just ran
`docker ps`

now we are going to create a user for mongodb for flask to use

`docker exec -it mongodb bash`

`mongo -u mongodbuser -p`

`use flaskdb`

Change the password here to whatever you set in docker-compose.yml for MONGODB_PASSWORD

`db.createUser({user: 'flaskuser', pwd: 'password', roles: [{role: 'readWrite', db: 'flaskdb'}]})`

`exit`

Change the password here to whatever you set in docker-compose.yml for MONGODB_PASSWORD

`mongo -u flaskuser -p password --authenticationDatabase flaskdb`

`exit`

`exit`


# To run unit tests
cd ./UnitTests
python3 Tests.py

