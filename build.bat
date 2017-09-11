
echo BUILD BACKEND
cd backend
REM START CMD /C CALL docker build -t rabbit rabbit
cd bomber
START CMD /C CALL gradlew buildDocker

echo BUILD FRONTEND
cd ../..
cd frontend
rmdir -rf dist
CALL ng build -prod
CALL docker build -t bomberweb .
cd ..

CALL docker stack deploy -c docker-compose-single.yml bomberman