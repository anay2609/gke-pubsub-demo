pipeline {

agent any

environment {

PROJECT="gke-demo-project-497408"

REGION="asia-south1"

REPO="demo-repo"

IMAGE_URL="asia-south1-docker.pkg.dev/${PROJECT}/${REPO}"

}

stages {

stage('Checkout') {

steps {

git branch:'main',
url:'https://github.com/anay2609/gke-pubsub-demo.git',
credentialsId:'github-token'

}

}

stage('Authenticate GCP') {

steps {

sh '''

export HOME=/var/lib/jenkins

export PATH=$PATH:/opt/google-cloud-sdk/bin

which gcloud

which docker-credential-gcloud

ls -l /var/lib/jenkins/gcp

gcloud auth activate-service-account \
--key-file=/var/lib/jenkins/gcp/gke-demo-project.json

gcloud config set project gke-demo-project-497408

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
asia-south1-docker.pkg.dev/gke-demo-project-497408/demo-repo/frontend:v1

docker tag backend \
asia-south1-docker.pkg.dev/gke-demo-project-497408/demo-repo/backend:v1

docker tag worker \
asia-south1-docker.pkg.dev/gke-demo-project-497408/demo-repo/worker:v1

'''

}

}

stage('Push Images') {

steps {

sh '''

export HOME=/var/lib/jenkins

export PATH=$PATH:/opt/google-cloud-sdk/bin

docker push \
asia-south1-docker.pkg.dev/gke-demo-project-497408/demo-repo/frontend:v1

docker push \
asia-south1-docker.pkg.dev/gke-demo-project-497408/demo-repo/backend:v1

docker push \
asia-south1-docker.pkg.dev/gke-demo-project-497408/demo-repo/worker:v1

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

terraform apply -auto-approve

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

stage('Deploy') {

steps {

sh '''

kubectl apply -f k8s/

kubectl get pods

'''

}

}

}

post {

always {

sh '''

docker images

'''

}

}

}
