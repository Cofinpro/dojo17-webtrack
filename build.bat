cd backend
docker build -t rabbit rabbit
cd bomberscale
gradlew buildDocker
cd ../..
cd frontend
ng build -prod
docker build -t bomberweb .
cd ..