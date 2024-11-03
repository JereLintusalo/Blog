pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                input message: 'Hit Return to exit'
            }
        }
    }
}