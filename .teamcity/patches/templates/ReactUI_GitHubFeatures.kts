package patches.templates

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.Template
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, create a template with id = 'ReactUI_GitHubFeatures'
in the project with id = 'ReactUI', and delete the patch script.
*/
create(RelativeId("ReactUI"), Template({
    id("ReactUI_GitHubFeatures")
    name = "GitHub Features"

    triggers {
        vcs {
            id = "TRIGGER_1"
            branchFilter = "+:pull/*"
        }
    }

    features {
        swabra {
            id = "BUILD_EXT_1"
            forceCleanCheckout = true
        }
        pullRequests {
            id = "BUILD_EXT_2"
            provider = github {
                authType = token {
                    token = "credentialsJSON:37119025-2749-4abf-8ed8-ff4221b59d50"
                }
                filterAuthorRole = PullRequests.GitHubRoleFilter.MEMBER
            }
        }
        commitStatusPublisher {
            id = "BUILD_EXT_3"
            publisher = github {
                githubUrl = "https://api.github.com"
                authType = personalToken {
                    token = "credentialsJSON:2e60a13b-65b3-4f80-b342-2cb770ad7a7d"
                }
            }
            param("github_oauth_user", "")
        }
    }
}))

