pipeline {
    agent { docker { image 'node:22.11.0-alpine3.20' } }
    stages {
        stage('build') {
            steps {
                cd /var/lib/jenkins/projects/Blog
                sh 'git pull'
                sh 'npm start'
            }
        }
    }
}