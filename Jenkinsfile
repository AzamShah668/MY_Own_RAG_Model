pipeline {
    agent any

    environment {
        DOCKER_USER     = "azamshah"
        VM_USER         = "verjenkins"
        STAGING_IP      = "192.168.56.104"
        PROD_IP         = "192.168.56.105"
        SSH_CREDS_ID    = "vm-deploy-key"
        GIT_CREDS_ID    = "ai-repo-deploy-key"
        DOCKER_CREDS_ID = "docker-hub-creds"
        TAG             = "${env.BUILD_NUMBER}"
        STAGING_URL     = "http://${env.STAGING_IP}:3000"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: "${env.GIT_CREDS_ID}",
                    url: 'git@github.com:AzamShah668/MY_Own_RAG_Model.git'
            }
        }

        stage('Build & Push') {
            steps {
                script {
                    withCredentials([
                        usernamePassword(
                            credentialsId: DOCKER_CREDS_ID,
                            passwordVariable: 'PASS',
                            usernameVariable: 'USER'
                        )
                    ]) {
                        sh 'echo $PASS | docker login -u $USER --password-stdin'
                        sh "docker build -t ${DOCKER_USER}/rag-frontend:v${TAG} ./rag-frontend"
                        sh "docker push ${DOCKER_USER}/rag-frontend:v${TAG}"
                        sh "docker build -t ${DOCKER_USER}/rag-backend:v${TAG} ./rag-backend"
                        sh "docker push ${DOCKER_USER}/rag-backend:v${TAG}"
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sshagent([SSH_CREDS_ID]) {
                    script {
                        sh "scp -o StrictHostKeyChecking=no docker-compose.yml ${VM_USER}@${STAGING_IP}:~/docker-compose.yml"
                        sh "ssh -o StrictHostKeyChecking=no ${VM_USER}@${STAGING_IP} 'mkdir -p ~/rag-backend/data'"
                        sh """
                            ssh -o StrictHostKeyChecking=no ${VM_USER}@${STAGING_IP} '
                                export TAG=${TAG}
                                export DOCKER_USER=${DOCKER_USER}
                                export GROK_API_KEY=\${GROK_API_KEY}
                                docker compose down -v
                                docker compose pull
                                docker compose up -d
                            '
                        """
                    }
                }
            }
        }

        stage('Testing Stage') {
            steps {
                echo "Running smoke tests on ${env.STAGING_URL}"
                sh '''
                    docker run --rm \
                      -e STAGING_URL=${STAGING_URL} \
                      -e BACKEND_URL=http://${STAGING_IP}:8001 \
                      -v $PWD:/app \
                      -w /app \
                      python:3.11 \
                      sh -c "
                        pip install pytest requests &&
                        pytest -v tests/
                      "
                '''
            }
        }

        stage('Approval Gate') {
            steps {
                input message: 'Staging looks good. Deploy to Production?', ok: 'Promote!'
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent([SSH_CREDS_ID]) {
                    script {
                        sh "scp -o StrictHostKeyChecking=no docker-compose.yml ${VM_USER}@${PROD_IP}:~/docker-compose.yml"
                        sh "ssh -o StrictHostKeyChecking=no ${VM_USER}@${PROD_IP} 'mkdir -p ~/rag-backend/data'"
                        sh """
                            ssh -o StrictHostKeyChecking=no ${VM_USER}@${PROD_IP} '
                                export TAG=${TAG}
                                export DOCKER_USER=${DOCKER_USER}
                                export GROK_API_KEY=\${GROK_API_KEY}
                                docker compose down
                                docker compose pull
                                docker compose up -d
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        failure {
            echo "Build failed - check DNS or SSH keys"
        }
        success {
            echo "Successfully deployed to Production!"
        }
    }
}
