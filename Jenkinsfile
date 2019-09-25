stage('Sonarqube analysis') {
    steps {
      script {
             scannerHome = tool 'SonarScanner';
      }
      withSonarQubeEnv('SonarQube') {
         bat "${scannerHome}/bin/sonar-scanner.bat" 
      }

    }
}