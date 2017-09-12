# Lokal Bomberman spielen, Entwicklungsbuild

## Server lokal bauen

## Einmalig durchführen:
* `cd backend/bomber`
* `./gradlew init`

## Bei jedem Build zu tun:
* `cd backend/bomber`
* `./gradlew bootRepackage`
* `cd build/libs`
* `java -jar bomberXX.jar`

#Im Ordner backend liegt das Skript 'build-and-run-localy.cmd', das das Buil lokal durchführt und anschließen den Server startet.
#Usage: Skript audführen, den Server nach Test mit <strg>C beenden, das Skript erneut ausführen.
#CAVEAT: Der Name der Jar- datei ist im Skript hinterlegt und muss bei Versionswechsel angepasst werden. 


## Anpassung des Frontends, damit es sich mit dem Server verbindet

* im `websocket.service.ts` im Konstruktor in ``stomp.configure`` den Host durch
``localhost`` ersetzen
* Frontend entsprechend der Readme unter ``frontend`` bauen + starten

# Bomberman im Netzwerk spielen, Produktionsbuild via Docker

* Docker installieren (siehe Google, ihr schafft das!)
* (Hinweis: Docker braucht sehr lange zum starten... )
* Ports 3000 und 3100 müssen auf dem Server freigegeben werden
* IP-Adresse des Servers herausfinden (``ipconfig``) und 
* in ``websocket.service.ts`` einbauen (siehe oben, Port 3000 bleibt)
* es muss noch ein Docker-swarm angelegt werden ``docker swarm init`` 
* im root-Verzeichnis ``exec ./build.bat`` ausführen
* ... warten
* localhost:3001 ruft den Docker Visualizer auf.
 Dort kann man überprüfen, dass das Deployment geklappt hat
* Clients müssen dann im Browser die IP des Servers aufrufen mit Port 3100

* wenn es nicht gehen sollte, freut Kevin sich über Anrufe ;-)
