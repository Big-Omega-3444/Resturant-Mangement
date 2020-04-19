@echo off
:choice1
set /P c=Are you sure you want to purge the database [y/N]? 
if /I "%c%" EQU "Y" goto :purge
if /I "%c%" EQU "n" goto :exit
goto :choice1

:purge
docker-compose down
docker container prune
docker image prune
docker volume prune
echo Database Purged. Next part will re-authenticate with the Flask container again.

:choice2
set /P c=Do you want to continue [y/N]? 
if /I "%c%" EQU "Y" goto :reauth
if /I "%c%" EQU "n" goto :exit
goto :choice2

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