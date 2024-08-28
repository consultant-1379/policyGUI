def bobVersion = '0.0.5'

pipeline {
    agent {
        node {
            label params.SLAVE
        }
    }
    parameters {
        string(name: 'SETTINGS_CONFIG_FILE_NAME', defaultValue: 'maven.settings.eso')
    }

    environment {
        bob = "docker run --rm " +
        '--env APP_PATH="`pwd`" ' +
        '--env RELEASE=${RELEASE} ' +
        "-v \"`pwd`:`pwd`\" " +
        "-v /var/run/docker.sock:/var/run/docker.sock " +
        "armdocker.rnd.ericsson.se/proj-orchestration-so/bob:${bobVersion}"
    }

    stages {
        stage('Inject Settings.xml File') {
            steps {
                configFileProvider([configFile(fileId: "${env.SETTINGS_CONFIG_FILE_NAME}", targetLocation: "${env.WORKSPACE}")]) {
                }
            }
        }
        stage('Clean') {
            steps {
                sh "${bob} clean"
                sh 'git clean -xdff --exclude=.m2 --exclude=.sonar --exclude=settings.xml'
            }
        }
        stage('Lint') {
            steps {
                sh "${bob} lint"
            }
        }
        stage('Build package and execute tests') {
            steps {
                sh "${bob} build"
            }
        }

        stage('Run docker image') {
            steps {
                sh "${bob} run"
            }
        }

        stage('Build image and chart') {
            steps {
                sh "${bob} image"
            }
        }

        stage('SonarQube analysis') {
            when {
                expression { params.RELEASE == "false" }
            }
            steps {
                sh "echo work space: ${env.WORKSPACE}"
                sh "ls"
                sh "cat sonar-project.properties"
                sh "sudo chmod -R 755 /root"

                script {
                   scannerHome = tool 'SonarQubeScanner2'
                }
                withSonarQubeEnv('SonarQube') {
                    sh "${scannerHome}/bin/sonar-scanner -X"
                }
            }
        }

        stage('Push image and chart') {
            when {
                expression { params.RELEASE == "true" }
            }
            steps {
                sh "${bob} push"
            }
        }

        stage('Generate input for ESO staging') {
            when {
                expression { params.RELEASE == "true" }
            }
            steps {
                sh "${bob} generate-output-parameters"
                archiveArtifacts 'artifact.properties'
            }
        }
    }
}
