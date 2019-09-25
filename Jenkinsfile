// Sonarcube for holdem test
pipeline {
    agent any
    stages {
        stage('Sonarqube analysis') {
          steps {
            script {
             scannerHome = tool 'sonarqube';
            }
           withSonarQubeEnv('sonarqube') {
            bat "${scannerHome}/bin/sonar-scanner.bat" 
           }
           timeout(time: 10, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
         }
      }
    }
}