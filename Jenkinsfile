import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.TimeZone
import java.time.LocalTime
import java.util.regex.*

pipeline {
	agent { label 'jenkins-host' }
	environment {
		CONTAINER_NAME = 'paper-application-status'
		URL_GITHUB = "https://github.com/paper-indonesia/paper-application-status.git"
		BRANCH_PROD_REGEX = /(master|^.*prod*)/
		BRANCH_BUILD_REGEX = /(master|development|project.*)/
		BRANCH_PROJECT_REGEX = /project.*/
		BRANCH_GOLDEN_HOUR = /(staging)/
        USER_PERMITTED = /admin|kenneth|wahyu-kodar|jeremy|renald|setiawan/
		GITHUB_CRED = "https-github-damastahandippr"
		NEW_RELIC_LICENSE_KEY = credentials('NEW_RELIC_LICENSE_KEY')
        COMPOSER_AUTH = credentials("https-github-damastahandippr")
		GITHUB_SSH = credentials('ssh-github-damastahandippr')
		GIT_SLUG_BRANCH = getSlug(env.BRANCH_PROJECT_REGEX)	
		IMAGE_TAG =  "${env.GIT_SLUG_BRANCH}-${currentBuild.number}"
		IMAGE_URL = "gcr.io/paper-prod/${env.CONTAINER_NAME}"
		IMAGE_FULL_URL = "${env.IMAGE_URL}:${env.IMAGE_TAG}"
		BUILD_ARG = "--build-arg APP_ENV=${getArgs(env.BRANCH_PROJECT_REGEX)} --build-arg GITHUB_TOKEN=${env.COMPOSER_AUTH} --build-arg NEW_RELIC_LICENSE_KEY=${env.NEW_RELIC_LICENSE_KEY}"	
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
		/* stage('Check time window') {
            when {
                expression { env.BRANCH_NAME ==~ env.BRANCH_GOLDEN_HOUR }
            }
            steps {
                script {
                    def user = env.BUILD_USER_ID
                    def currentTime = LocalTime.now(ZoneId.systemDefault())
                    
                    def isInTimeWindow = true

                    def timeWindows = [
                        [startTime: LocalTime.parse("06:00"), endTime: LocalTime.parse("10:00")],
                        [startTime: LocalTime.parse("14:00"), endTime: LocalTime.parse("16:00")],
                        [startTime: LocalTime.parse("18:00"), endTime: LocalTime.parse("20:00")]
                    ] 

                    for (window in timeWindows) {
                        def startTime = window.startTime
                        def endTime = window.endTime

                        if (currentTime.isAfter(startTime) && currentTime.isBefore(endTime)) {
                            isInTimeWindow = false
                            break
                        }
                    }

                    if (isInTimeWindow) {
                            echo "Outside one of the time windows, proceeding with job build"
                        } else {
                        if (user ==~ env.USER_PERMITTED) {
                            echo "Allowed user: ${exemptedUsers.join(', ')}. Proceeding with job build."
                        } else {
                            error("Job can only be built outside the specified time windows.")
                        }
                    }
                }
            }
        } */
		stage('Init') {
			steps {
				slackSend( message: "${env.CONTAINER_NAME} >> ${env.BRANCH_NAME} ver. ${currentBuild.number} is building now! :pray:",color: '#4199d5')
				}
			}
		
		stage('Pull Source Code') {
			steps {
				git branch : "${env.BRANCH_NAME}", url : "${env.URL_GITHUB}", credentialsId : "${env.GITHUB_CRED}"
				sh 'cat $GITHUB_SSH > id_rsa'
                sh 'chmod 600 id_rsa'
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
					sh "gsutil -m cp -r gs://paper-production-env/${env.CONTAINER_NAME}/gcp/.env.${env.ENV_FILE_SUFFIX} ./app"
				}
			}
		}
		stage('Build and Dpeloy Staging') {
			when {
				expression { env.BRANCH_NAME ==~ /(staging)/ }
			}
			stages {
				stage('Build and Deploy to Cluster Development') {
					steps {
						sh "docker build -t ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.BUILD_ARG} --build-arg CLUSTER_K8S=development ."
						sh "docker tag ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.IMAGE_FULL_URL}"
						withCredentials([file(credentialsId: "${env.DOCKER_GOOGLE_SERVICE_ACCOUNT}", variable: 'GC_DOCKER_KEY')]) {
							sh("gcloud auth activate-service-account --key-file=${GC_DOCKER_KEY}")
							sh "gcloud auth configure-docker"
							sh "docker push ${env.IMAGE_FULL_URL}"
						}
						withCredentials([file(credentialsId: "paper-development-secret", variable: 'GC_KEY')]) {
							// Get kube config
							sh("gcloud auth activate-service-account --key-file=${GC_KEY} --project=paper-development")
							sh("gcloud container clusters get-credentials paper-dev-cluster-01 --zone ${env.ZONE} --project=paper-development")
							// Create namespace if it doesn't exist
							createNamespace(env.NAMESPACE)
							// Deploy using helm
							helmInstall(env.NAMESPACE,env.RELEASE,env.IMAGE_URL,env.IMAGE_TAG)
						}	
					}
				}
				stage('Build and Deploy to Cluster Staging') {
					steps {
						sh "docker build -t ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.BUILD_ARG} --build-arg CLUSTER_K8S=staging ."
						sh "docker tag ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.IMAGE_FULL_URL}"
						withCredentials([file(credentialsId: "${env.DOCKER_GOOGLE_SERVICE_ACCOUNT}", variable: 'GC_DOCKER_KEY')]) {
							sh("gcloud auth activate-service-account --key-file=${GC_DOCKER_KEY}")
							sh "gcloud auth configure-docker"
							sh "docker push ${env.IMAGE_FULL_URL}"
						}
						withCredentials([file(credentialsId: "paper-staging-cluster", variable: 'GC_KEY')]) {
							// Get kube config
							sh("gcloud auth activate-service-account --key-file=${GC_KEY} --project=paper-staging-288812")
							sh("gcloud container clusters get-credentials paper-staging-cluster-01 --zone ${env.ZONE} --project=paper-staging-288812")
							// Create namespace if it doesn't exist
							createNamespace(env.NAMESPACE)
							// Deploy using helm
							helmInstall(env.NAMESPACE,env.RELEASE,env.IMAGE_URL,env.IMAGE_TAG)
						}	
					}
				}
			}
		}

		stage('Build Image') {
			when {
				expression { env.BRANCH_NAME ==~ env.BRANCH_BUILD_REGEX }
			}
			steps {
				sh "docker build -t ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.BUILD_ARG} ."
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
				cleanWs()
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
	} else if (env.BRANCH_NAME == 'development') {
		slug = "dev"
    } else if (env.BRANCH_NAME ==~ branchProjectRegex){
		slug = env.BRANCH_NAME.replace("/", "-").replace("project-","")
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
	} else if (env.BRANCH_NAME == 'development') {
		args = "development"
	} else if (env.BRANCH_NAME ==~ branchProjectRegex) {
		args = env.BRANCH_NAME.replace("/", "-").replace("project-","")
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
	} else if (env.BRANCH_NAME == 'development'){
		namespace = "development"
	} else if (env.BRANCH_NAME ==~ branchProjectRegex){
		namespace = env.BRANCH_NAME.replace("/", "-").replace("project-","")
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
		project = "staging-288812"
	} else if (env.BRANCH_NAME == 'development'){
		project = "development"
	}  else if (env.BRANCH_NAME ==~ branchProdRegex){
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
	if (env.BRANCH_NAME == 'master') {
		args = "paper-prod-cluster"cd
	} else if (env.BRANCH_NAME == 'staging') {
		args = "paper-staging-cluster-01"
	} else if (env.BRANCH_NAME == 'development') {
		args = "paper-dev-cluster-01"
	} else if (env.BRANCH_NAME ==~ branchProdRegex){
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
	if (env.BRANCH_NAME == 'master') {
		gsa = "paper-prod-secret"
	} else if (env.BRANCH_NAME == 'staging') {
		gsa = "paper-staging-cluster"
	} else if (env.BRANCH_NAME == 'development') {
		gsa = "paper-development-secret"
	}  else if (env.BRANCH_NAME ==~ branchProdRegex){
        gsa = "paper-development-secret"
    } else {
        gsa = "paper-development-secret"
    }
  	return gsa
}