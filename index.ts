import * as eks from "@pulumi/eks";

// Create an EKS cluster with the default configuration.
const cluster = new eks.Cluster("k8s-template-integration-tests");

export const clusterName = cluster.eksCluster.name;