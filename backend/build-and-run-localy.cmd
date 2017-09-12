cd bomber
CMD /C CALL gradlew bootRepackage
cd ..
java -jar bomber\build\libs\bomber-0.1.0.jar

