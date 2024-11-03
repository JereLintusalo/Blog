pipeline {
    agent { docker { image 'node:22.11.0-alpine3.20' } }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Deliver') { 
            steps {
                sh 'npm start' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)' 
                sh 'npm stop' 
            }
        }
    }
}