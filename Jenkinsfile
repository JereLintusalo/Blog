pipeline {
    agent { docker { image 'node:22.11.0-alpine3.20' } }
    stages {
        stage('build') {
            steps {
                sh 'git pull'
                sh 'npm start'
            }
        }
    }
}