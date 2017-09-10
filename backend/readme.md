# (Lokal) 'Server' spielen

* `cd backend/bomber`
* `./gradlew init`
* `./gradlew bootPackage`
* `cd build/libs`
* `java -jar bomberXX.jar`

* ggf. im `websocket.service.ts` im Konstruktor in ``stomp.configure`` den Host durch
``localhost`` ersetzen

# Server als Server spielen

* Docker installieren (siehe Google, ihr schafft das!)
* im root-Verzeichnis ``./build.bat``
* IP-Adresse des Servers wieder in ``websocket.service.ts`` einbauen (siehe oben)
* Ports 3000 und 3100 müssen auf dem Server freigegeben werden
* ggf. muss noch ein Docker-swarm angelegt werden ``docker swarm init`` (egal welches Verzeichnis)

* wenn es nicht gehen sollte, freut Kevin sich über Anrufe ;-)
