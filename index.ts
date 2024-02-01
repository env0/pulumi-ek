import * as eks from "@pulumi/eks";

// Create an EKS cluster with the default configuration.
const cluster = new eks.Cluster("k8s-templates-integration-tests", {
    clusterTags: {
        owner: "RND",
        DO_NOT_DELETE: "DO_NOT_DELETE",
    }});

export const clusterName = cluster.eksCluster.name;