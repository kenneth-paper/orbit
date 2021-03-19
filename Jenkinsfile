pipeline {
	environment {
		CONTAINER_NAME = 'paper-gateway-nest'
		URL_BITBUCKET = "https://papertechnical@bitbucket.org/yosiadrywebsite/paper-gateway-nest.git"
		

		BRANCH_PROD_REGEX = /(master|^.*prod*)/
		BRANCH_BUILD_REGEX = /(master|staging|development|project.*)/
		BRANCH_PROJECT_REGEX = /project.*/
		BITBUCKET_CRED = "3f1c89d3-4479-470f-b167-d3b238fb58a9"
		GITHUB_TOKEN ="4acfd1c74a8dda1a14771ccd10c7396a5e51b0d4"
		GIT_SLUG_BRANCH = getSlug(env.BRANCH_PROJECT_REGEX)	
		IMAGE_TAG =  "${env.GIT_SLUG_BRANCH}-${currentBuild.number}"
		IMAGE_URL = "gcr.io/paper-prod/${env.CONTAINER_NAME}"
		IMAGE_FULL_URL = "${env.IMAGE_URL}:${env.IMAGE_TAG}"
		BUILD_ARG = "--build-arg APP_ENV=${getArgs(env.BRANCH_PROJECT_REGEX)} --build-arg GITHUB_TOKEN=${env.GITHUB_TOKEN}"	
		ENV_FILE_SUFFIX = "${getArgs(env.BRANCH_PROJECT_REGEX)}"
    	
    	GOOGLE_SERVICE_ACCOUNT = getGoogleServiceAccount(env.BRANCH_PROD_REGEX)
		RELEASE= "${env.CONTAINER_NAME}"
		NAMESPACE = getNamespace(env.BRANCH_PROJECT_REGEX)
		GCP_PROJECT = getGCPProject(env.BRANCH_PROD_REGEX)
		CLUSTER = getCluster(env.BRANCH_PROD_REGEX)
		ZONE= getZone()
	}

	agent {
		docker{
			image "gcr.io/paper-prod/paper-k8s-deployment"
		}
	}
	options {
		skipDefaultCheckout()
	}
	stages {
		stage('Pull Source Code') {
			steps {
				sh "mkdir -p /var/jenkins_home/workspace/${env.JOB_NAME}"
				sh "cd /var/jenkins_home/workspace/${env.JOB_NAME}"
				git branch : "${env.BRANCH_NAME}", url : "${env.URL_BITBUCKET}", credentialsId : "${env.BITBUCKET_CRED}"
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
               sh "gsutil -m cp -r gs://paper-production-env/${env.CONTAINER_NAME}/gcp/.env.${env.ENV_FILE_SUFFIX} /var/jenkins_home/workspace/${env.JOB_NAME}/app"
            }
        }
		
		stage('Build Image') {
			when {
				expression { env.BRANCH_NAME ==~ env.BRANCH_BUILD_REGEX }
			}
			steps {
				sh "cd /var/jenkins_home/workspace/${env.JOB_NAME}"
				sh "docker build -t ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.BUILD_ARG} ."
				sh "docker tag ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH} ${env.IMAGE_FULL_URL}"
				withCredentials([file(credentialsId: "${env.GOOGLE_SERVICE_ACCOUNT}", variable: 'GC_KEY')]) {
					sh("gcloud auth activate-service-account --key-file=${GC_KEY}")
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
					sh("cd /var/jenkins_home/workspace/${env.JOB_NAME}")
					helmInstall(env.NAMESPACE,env.RELEASE,env.IMAGE_URL,env.IMAGE_TAG)
				}
			}
		}

		// stage('Remove Unused Image') {
		// 	steps {
		// 		withCredentials([file(credentialsId: "${env.GOOGLE_SERVICE_ACCOUNT}", variable: 'GC_KEY')]) {
		// 			sh("gcloud auth activate-service-account --key-file=${GC_KEY} --project=${env.GCP_PROJECT}")
		// 			sh "docker rmi -f ${env.CONTAINER_NAME}-${env.GIT_SLUG_BRANCH}:latest"
		// 			sh "docker rmi -f ${env.IMAGE_FULL_URL}"
		// 			sh "gcloud container images delete ${env.IMAGE_FULL_URL} --force-delete-tags --quiet"
		// 		}
		// 	}
		// }
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
		sh("cd /var/jenkins_home/workspace/${env.JOB_NAME}")
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
