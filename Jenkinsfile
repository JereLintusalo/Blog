pipeline {
    agent any
    stages {
        stage('Checkout') {
            Checkout scm
        }
        stage('Build') {
            steps {
                sh 'docker build . -t Blog'
            }
        }
        stage('Run') {
            steps {
                sh 'docker run -d -p 3000:3000 --name Blog Blog'
            }
        }
    }
}