import * as eks from "@pulumi/eks";

// Create an EKS cluster with the default configuration.
let name = "k8s-templates-integration-tests";
const cluster = new eks.Cluster(name, {
    name,
    minSize: 1,
    desiredCapacity: 1,
    maxSize: 1,
    instanceType: "t4g.nano",
    clusterTags: {
        owner: "RND",
        DO_NOT_DELETE: "DO_NOT_DELETE",
    }});

export const clusterName = cluster.eksCluster.name;
export const kubeconfig = cluster.kubeconfig;
