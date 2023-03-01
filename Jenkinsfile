pipeline {
    agent { label 'jenkins-host' }
    environment {
        CONTAINER_NAME = 'paper-application-status'
        BRANCH_PROD_REGEX = /(master|^.*prod*)/
        BRANCH_BUILD_REGEX = /(master|staging|development|project.*)/
        BRANCH_PROJECT_REGEX = /project.*/
        BITBUCKET_CRED = "https-github-damastahandippr"
        COMPOSER_AUTH = credentials("https-github-damastahandippr")
        GIT_SLUG_BRANCH = getSlug(env.BRANCH_PROJECT_REGEX)
        GIT_URL = "https://github.com/paper-indonesia/paper-application-status.git"
        IMAGE_TAG =  "${env.GIT_SLUG_BRANCH}-${currentBuild.number}"
        IMAGE_URL = "gcr.io/paper-prod/${env.CONTAINER_NAME}"
        IMAGE_FULL_URL = "${env.IMAGE_URL}:${env.IMAGE_TAG}"
        BUILD_ARG = "--build-arg APP_ENV=${getArgs(env.BRANCH_PROJECT_REGEX)}"
        ENV_FILE_SUFFIX = "${getArgs(env.BRANCH_PROJECT_REGEX)}"
        DOCKER_GOOGLE_SERVICE_ACCOUNT = "jenkins-cicd-jkt-docker-auth"
        GOOGLE_SERVICE_ACCOUNT = getGoogleServiceAccount(env.BRANCH_PROD_REGEX)
        RELEASE= "${env.CONTAINER_NAME}"
        NAMESPACE = getNamespace(env.BRANCH_PROJECT_REGEX)
        GCP_PROJECT = getGCPProject(env.BRANCH_PROD_REGEX)
        CLUSTER = getCluster(env.BRANCH_PROD_REGEX)
        ZONE= getZone()
    }
    options {
        skipDefaultCheckout()
    }
    stages {
        stage('Init') {
            steps {
                slackSend( message: "${env.CONTAINER_NAME} >> ${env.BRANCH_NAME} ver. ${currentBuild.number} is building now! :pray:",color: '#4199d5')
            }
        }        
        stage('Pull Source Code') {
            steps {
                git branch : "${env.BRANCH_NAME}", url : "${env.GIT_URL}", credentialsId : "${env.BITBUCKET_CRED}"
            }
        }
        stage('Test'){
            steps {
                echo "Skip this test :("
            }
        }
        stage('Set ENV Production'){
            when {
                expression { env.BRANCH_NAME ==~ env.BRANCH_PROD_REGEX }
            }
            steps {
                withCredentials([file(credentialsId: "${env.DOCKER_GOOGLE_SERVICE_ACCOUNT}", variable: 'GC_DOCKER_KEY')]) {
                    sh("gcloud auth activate-service-account --key-file=${GC_DOCKER_KEY}")
                    sh "gsutil -m cp -r gs://paper-production-env/${env.CONTAINER_NAME}/gcp/.env.${env.ENV_FILE_SUFFIX} ./${env.JOB_NAME}/app"
                }
            }
        }

        stage('Build Image') {
            when {
                expression { env.BRANCH_NAME ==~ env.BRANCH_BUILD_REGEX }
            }
            steps {
                sh "DOCKER_BUILDKIT=1 docker build -t ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.BUILD_ARG} ."
                sh "docker tag ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.IMAGE_FULL_URL}"
                withCredentials([file(credentialsId: "${env.DOCKER_GOOGLE_SERVICE_ACCOUNT}", variable: 'GC_DOCKER_KEY')]) {
                    sh("gcloud auth activate-service-account --key-file=${GC_DOCKER_KEY}")
                    sh "gcloud auth configure-docker"
                    sh "docker push ${env.IMAGE_FULL_URL}"
                }
            }
        }
        stage('Deploy') {
            when {
                expression { env.BRANCH_NAME ==~ env.BRANCH_BUILD_REGEX }
            }
            steps {
                withCredentials([file(credentialsId: "${env.GOOGLE_SERVICE_ACCOUNT}", variable: 'GC_KEY')]) {
                    // Get kube config
                    sh("gcloud auth activate-service-account --key-file=${GC_KEY} --project=${env.GCP_PROJECT}")
                    sh("gcloud container clusters get-credentials ${env.CLUSTER} --zone ${env.ZONE} --project=${env.GCP_PROJECT}")
                    // Create namespace if it doesn't exist
                    createNamespace(env.NAMESPACE)
                    // Deploy using helm
                    helmInstall(env.NAMESPACE,env.RELEASE,env.IMAGE_URL,env.IMAGE_TAG)
                }
            }
        }
        stage("Post Build"){
            steps {
                slackSend( message: "${env.CONTAINER_NAME} >> ${env.BRANCH_NAME} ver. ${currentBuild.number}, Build Finished! Congratulation! :dab_unicorn:", color:"#aae481")
            }
        }
    }
}
/*
    Create the kubernetes namespace
*/
def createNamespace (namespace) {
    echo "Creating namespace ${namespace} if needed"
    sh "[ ! -z \"\$(kubectl get ns ${namespace} -o name 2>/dev/null)\" ] || kubectl create ns ${namespace}"
}
/*
    Helm install
*/
def helmInstall (namespace,release,image_url,image_tag) {
    echo "Installing ${release} in ${namespace} with image ${image_url}:${image_tag}"
    echo "env ${release}"
    script {
        // sh("cd /var/jenkins_home/workspace/${env.JOB_NAME}")
        sh """
            helm upgrade --install --namespace ${namespace} ${release} ./deployment/chart \
                --set image.repository=${image_url},image.tag=${image_tag}
        """
    }
}
/*
    Helm delete (if exists)
*/
def helmDelete (namespace,release) {
    echo "Deleting ${release} in ${namespace} if deployed"
    script {
        sh "[ -z \"\$(helm ls --namespace ${namespace} --short ${release} 2>/dev/null)\" ] || helm uninstall ${release} --namespace ${namespace} "
    }
}
/*
    Get slug
*/
def getSlug(branchProjectRegex) {
    if (env.BRANCH_NAME == 'master') {
        slug = "prd"
    } else if (env.BRANCH_NAME == 'staging') {
        slug = "stg"
    } else if (env.BRANCH_NAME ==~ branchProjectRegex){
        slug = env.BRANCH_NAME.replace("/", "-").replace("project-","")
    } else {
        slug = "dev"
    }
    echo "slug ${slug} from regex ${branchProjectRegex} if deployed"
    return slug
}
/*
    Get Args for set environment app
*/
def getArgs(branchProjectRegex) {
    if (env.BRANCH_NAME == 'master') {
        args = "production"
    } else if (env.BRANCH_NAME == 'staging') {
        args = "staging"
    } else if (env.BRANCH_NAME ==~ branchProjectRegex){
        args = env.BRANCH_NAME.replace("/", "-").replace("project-","")
    } else {
        args = "development"
    }
    echo "args ${args} from regex ${branchProjectRegex} if deployed"
    return args
}
/*
    Get Namespace
*/
def getNamespace(branchProjectRegex) {
    if (env.BRANCH_NAME == 'master') {
        namespace = "production"
    } else if (env.BRANCH_NAME == 'staging') {
        namespace = "staging"
    } else if (env.BRANCH_NAME ==~ branchProjectRegex){
        namespace = env.BRANCH_NAME.replace("/", "-").replace("project-","")
    } else {
        namespace = "development"
    }
    echo "namespace ${namespace} from regex ${branchProjectRegex} if deployed"
    return "paper-${namespace}"
}
/*
    Get Project
*/
def getGCPProject(branchProdRegex) {
    if (env.BRANCH_NAME == 'master') {
        project = "production"
    } else if (env.BRANCH_NAME == 'staging') {
        project = "development"
    } else if (env.BRANCH_NAME ==~ branchProdRegex){
        project = "development"
    } else {
        project = "development"
    }
    return "paper-${project}"
}
/*
    Get Cluster
*/
def getCluster(branchProdRegex) {
    if (env.BRANCH_NAME ==~ branchProdRegex) {
        args = "paper-dev-cluster-01"
    } else {
        args = "paper-dev-cluster-01"
    }
    return args
}
/*
    Get Zone
*/
def getZone() {
    return "asia-southeast2-a"
}
/*
    Get Google Service Account
*/
def getGoogleServiceAccount(branchProdRegex) {
    if (env.BRANCH_NAME ==~ branchProdRegex) {
        gsa = "paper-development-secret"
    } else {
        gsa = "paper-development-secret"
    }
    return gsa
}