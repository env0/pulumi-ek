import * as eks from "@pulumi/eks";
import * as aws from "@pulumi/aws";

const name = "k8s-templates-integration-tests";
const version = "1.29";

const cluster = new eks.Cluster(name, {
    name,
    version,
    skipDefaultNodeGroup: true,
    roleMappings: [{
        roleArn: "arn:aws:iam::326535729404:role/AWSReservedSSO_AdministratorAccess_6e013e7aceaa4447",
        username: "env0-dev-admin-{{SessionName}}",
        groups: ["system:masters"],
    }],
    clusterTags: {
        owner: "RND",
        DO_NOT_DELETE: "DO_NOT_DELETE",
    }
});

const zones = aws.getAvailabilityZones({
    state: "available",
});

const subnets = zones.then(zones =>
    zones.names.map(zone =>
        new aws.ec2.DefaultSubnet(`default-subnet-${zone}`, {
                availabilityZone: zone
            }
        )
    ));

const nodeGroup = new aws.eks.NodeGroup(name, {
    clusterName: cluster.eksCluster.name,
    nodeGroupName: name,
    nodeRoleArn: cluster.instanceRoles[0].arn,
    amiType: "BOTTLEROCKET_x86_64",
    capacityType: "SPOT",
    instanceTypes: ["t3a.small"],
    subnetIds: subnets.then(subnets => subnets.map(subnet => subnet.id)),
    scalingConfig: {
        desiredSize: 1,
        minSize: 1,
        maxSize: 1
    },
    version
});


export const clusterName = cluster.eksCluster.name;
export const kubeconfig = cluster.kubeconfig;
