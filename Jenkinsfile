pipeline {

agent any

environment {

PROJECT="gke-demo-project-497408"

REGION="asia-south1"

REPO="demo-repo"

IMAGE_URL="asia-south1-docker.pkg.dev/${PROJECT}/${REPO}"

HOME="/var/lib/jenkins"

PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/google-cloud-sdk/bin"

GOOGLE_APPLICATION_CREDENTIALS="/var/lib/jenkins/gcp/gke-demo-project.json"

}

stages {

stage('Checkout') {

steps {

git branch: 'main',

url: 'https://github.com/anay2609/gke-pubsub-demo.git',

credentialsId: 'github-token'

}

}

stage('Authenticate GCP') {

steps {

sh '''

echo "=== PATH ==="

echo $PATH

echo "=== HOME ==="

echo $HOME

which gcloud

which docker-credential-gcloud

gcloud auth activate-service-account \

--key-file=$GOOGLE_APPLICATION_CREDENTIALS

gcloud config set project $PROJECT

gcloud auth configure-docker \

asia-south1-docker.pkg.dev \

--quiet

cat ~/.docker/config.json

'''

}

}

stage('Build Images') {

steps {

sh '''

docker build -t frontend ./frontend

docker build -t backend ./backend

docker build -t worker ./worker

'''

}

}

stage('Tag Images') {

steps {

sh '''

docker tag frontend \

$IMAGE_URL/frontend:v1

docker tag backend \

$IMAGE_URL/backend:v1

docker tag worker \

$IMAGE_URL/worker:v1

'''

}

}

stage('Push Images') {

steps {

sh '''

export HOME=/var/lib/jenkins

export PATH=$PATH:/opt/google-cloud-sdk/bin

which docker-credential-gcloud

docker push \

$IMAGE_URL/frontend:v1

docker push \

$IMAGE_URL/backend:v1

docker push \

$IMAGE_URL/worker:v1

'''

}

}

stage('Terraform Init') {

steps {

dir('terraform') {

sh '''

terraform init

'''

}

}

}

stage('Terraform Apply') {

steps {

dir('terraform') {

sh '''

terraform apply \

-auto-approve

'''

}

}

}

stage('Connect Cluster') {

steps {

sh '''

gcloud container clusters get-credentials \

gke-demo \

--region asia-south1

'''

}

}

stage('Deploy K8s') {

steps {

sh '''

kubectl apply -f k8s/

kubectl get pods

'''

}

}

}

post {

success {

echo "Deployment Successful"

}

failure {

echo "Deployment Failed"

}

always {

sh '''

docker images

'''

}

}

}
