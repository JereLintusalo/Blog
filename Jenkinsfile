pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'find . -maxdepth 3 -name Dockerfile'
                dir('Blog') {
                    sh 'docker build --pull --rm -f Dockerfile -t blog:latest "."'
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    rm -f "$WORKSPACE/trivy-report.txt"

                    trivy image \
                    trivy timeout 15m \
                    --format table \
                    --output "$WORKSPACE/trivy-report.txt" \
                    blog:latest
                '''
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck(
                    odcInstallation: 'OWASP-DC',
                    additionalArguments: '--scan .'
                )

                dependencyCheckPublisher(
                    pattern: '**/dependency-check-report.xml'
                )
            }
        }

        stage('Run') {
            steps {
                sh 'docker stop blog || true'
                sh 'docker rm blog || true'
                sh 'docker run -d -p 3000:3000 --name blog blog:latest'
                sh '''
                    for i in ${seq 1 15}; do
                        if curl -sf http://127.0.0.1:3000 > /dev/null; then
                            echo "App is uo and running."
                            break
                        fi
                        echo "Waiting for the app to start..."
                        sleep 1
                    done
                '''
            }
        }

        stage('Nikto Scan') {
            steps {
                sh '''
                    docker run --rm --network host \
                        hackllc/nikto \
                        -h http://127.0.0.1:3000
                '''
            }
        }

    }
}



