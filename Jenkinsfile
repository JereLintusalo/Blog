pipeline {
    agent any
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