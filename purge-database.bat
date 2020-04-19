@echo off
docker-compose down
docker container prune
docker image prune
docker volume prune
echo Database Purged. Next part will re-authenticate with the Flask container again.

:choice
set /P c=Do you want to continue [Y/n]? 
if /I "%c%" EQU "Y" goto :reauth
if /I "%c%" EQU "n" goto :exit
goto :choice

:reauth
docker-compose down
docker-compose build
docker-compose up -d
echo ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=
echo ^| A new shell will open up, so this is where the batch script ends.                                            ^|
echo ^| You must do the following in order in the shell:                                                             ^|
echo ^| [*] mongo -u mongodbuser -p                                                                                  ^|
echo ^| [*] use flaskdb                                                                                              ^|
echo ^| [*] db.createUser({user: 'flaskuser', pwd: 'password', roles: [{role: 'readWrite', db: 'flaskdb'}]})         ^|
echo ^| [*] exit                                                                                                     ^|
echo ^| [*] mongo -u flaskuser -p password --authenticationDatabase flaskdb                                          ^|
echo ^| [*] exit                                                                                                     ^|
echo ^| [*] exit                                                                                                     ^|
echo ^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=^=
docker exec -it mongodb bash
exit

:exit