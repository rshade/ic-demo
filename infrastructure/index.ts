import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const namePrefix = 'example'

const ebsVolume = new aws.ebs.Volume(`${namePrefix}-ebs-volume`, {
    availabilityZone: "us-west-2a",
    size: 60,
    tags: {
        Name: "HelloWorld",
    },
});

const ebsVolume1 = new aws.ebs.Volume(`${namePrefix}-ebs-volume-1`, {
    availabilityZone: "us-west-2a",
    size: 80,
    tags: {
        Name: "HelloWorld",
    },
});

const ubuntu = aws.ec2.getAmi({
    mostRecent: true,
    filters: [
        {
            name: "name",
            values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["099720109477"],
});

const eip = new aws.ec2.Eip(`${namePrefix}-elastic-ip`, {
    vpc: true,
});

const web = new aws.ec2.Instance(`${namePrefix}-ec2-instance`, {
    ami: ubuntu.then(ubuntu => ubuntu.id),
    instanceType: "t3.large",
    tags: {
        Name: "HelloWorld",
    },
    rootBlockDevice: {
        volumeSize: 40,
        volumeType: "gp3"
    },
    creditSpecification: {
        cpuCredits: "unlimited",
    },
    ebsBlockDevices: [
        { deviceName: '/dev/xvde', volumeId: ebsVolume.id},
        { deviceName: '/dev/xvdf', volumeId: ebsVolume1.id}
    ]
});
