// Sonarcube for holdem test
pipeline {
    agent any
    stages {
        stage('Sonarqube analysis') {
         step {
            script {
             scannerHome = tool 'sonarqube';
            }
         withSonarQubeEnv('sonarqube') {
            bat "${scannerHome}/bin/sonar-scanner.bat" 
         }
      }
}