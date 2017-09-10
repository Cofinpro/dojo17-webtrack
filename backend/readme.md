# (Lokal) 'Server' spielen

* `cd backend/bomber`
* `./gradlew init`
* `./gradlew bootPackage`
* `cd build/libs`
* `java -jar bomberXX.jar`

* ggf. im `websocket.service.ts` im Konstruktor in ``stomp.configure`` den Host durch
``localhost`` ersetzen
