
echo BUILD BACKEND
cd backend
START CMD /C CALL docker build -t rabbit rabbit
cd bomberscale
START CMD /C CALL gradlew buildDocker

echo BUILD FRONTEND
cd ../..
cd frontend
CALL ng build -prod
CALL docker build -t bomberweb .
cd ..