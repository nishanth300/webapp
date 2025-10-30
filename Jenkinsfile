pipeline {
    agent any
    tools {
        maven 'maven'
    }
    environment {
        DOCKERHUB_CREDENTIALS_ID = 'tests'
        DOCKERHUB_USERNAME = 'nishanth09'
        IMAGE_NAME = "nishanth09/my-app"
        CONTAINER_NAME = "my-app-container"
    }
    stages {
        stage('Github src') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main', url: 'https://github.com/nishanth300/webapp.git'
            }
        }

        stage('Debug workspace') {
            steps {
                sh 'pwd'
                sh 'ls -R'
            }
        }

        stage('Build stage') {
            steps {
                echo 'Building with Maven...'
                dir('.') { // change '.' to your subfolder if pom.xml isn’t in root
                    sh 'mvn clean package'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${BUILD_NUMBER}"
                sh "sudo docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | sudo docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh "sudo docker push ${IMAGE_NAME}:${BUILD_NUMBER}"
                    sh "sudo docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest"
                    sh "sudo docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Run Container') {
            steps {
                sh "sudo docker stop ${CONTAINER_NAME} || true"
                sh "sudo docker rm ${CONTAINER_NAME} || true"
                sh "sudo docker run -d -p 8084:8080 --name ${CONTAINER_NAME} ${IMAGE_NAME}:latest"
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo '✅ Build succeeded!'
        }
        failure {
            echo '❌ Build failed. Check for pom.xml location.'
        }
    }
}
