
import * as cdk from 'aws-cdk-lib';
import {
  aws_elasticloadbalancingv2 as elb,
  aws_elasticloadbalancingv2_targets as elbTargets,
  aws_iam as iam,
  aws_ec2 as ec2,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_route53_targets as route53Targets
} from 'aws-cdk-lib';
import { AllowedMethods, OriginProtocolPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';


export class CdnStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, 'website-stb-bucket', {
      bucketName: 'website-stb-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '/error/index.html',
    })

    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    const ec2InstanceRole = new iam.Role(
      this,
      'ec2InstanceRole', // this is a unique id that will represent this resource in a Cloudformation template
      { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') }
    )

    const ec2SecurityGroup = new ec2.SecurityGroup(
      this,
      'ec2InstanceSG',
      {
        vpc: defaultVpc,
        allowAllOutbound: true, // will let your instance send outboud traffic
        securityGroupName: 'ec2-instance-sg',
      }
    )

    const elbSecurityGroup = new ec2.SecurityGroup(
      this,
      'elbSG',
      {
        vpc: defaultVpc,
        allowAllOutbound: true, // will let your instance send outboud traffic
        securityGroupName: 'elb-sg',
      }
    )

    const certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', 'arn:aws:acm:us-east-1:714722585977:certificate/ca866223-b0f4-4958-a7aa-bf1ba40ad4f9')
    const certificateEu = acm.Certificate.fromCertificateArn(this, 'CertificateEU', 'arn:aws:acm:eu-central-1:714722585977:certificate/eeacfec6-77c1-4ac3-9bca-84c627e7a2c8')

    ec2SecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allows SSH access from Internet'
    )

    ec2SecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(elbSecurityGroup.securityGroupId),
      ec2.Port.tcp(80),
      'Allows HTTP access EC2 security group'
    )

    elbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allows HTTPS traffic to ELB'
    )

    elbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allows HTTP traffic to ELB'
    )

    const cfnKeyPair = new ec2.CfnKeyPair(this, 'ec2-key-pair', {
      keyName: 'ec2-key-pair',
      publicKeyMaterial: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC+bBmxXFZR9X0cBcN6enN3Yh4C+rW22HqV2mOHvXPOpzGx0HW7SYLnVKMS31Q2rP48E1QQqEScBEATDGRrmOgTsPA6aTiy3Je+SXuCuyijJG9+VqVf0FgfFRduT+RTQjVsPB+cMQrak9JBOdOGBp8rfjN6/wmijk/V11ZJPKVdqH+PcXUZwFBILLMBpY3s4ikEORXMyyPt2MhdMcD+xjiH6ZhdmsdRrZzkMea68WUQ1No6hJTYXHj9QXnLGUJUsPxhIc/QA399sgnwVU6YEQ98IVslotU+jeGOwvr6v3hdocPIXEnWtezy2AZGHPeM3ciB3SkWmGTJUeVf14jl+WnlKQvkKrlapb6La6939xlo3LYuGC49B3BL6FgUCvFsRv7Kl+r4IY60TrzEulPqEHc9JAG273J5vsfPaLIQkCAN+7QiXQl0nDr4bgdYdpvwf3L31ziS0BwItdAxtlFz9udN8P4Lps9nb5vIdtTRBE+708kdHlh9KzF+ZtVqmSswnoc= adriansoovary@Adrians-MacBook-Pro-2.fritz.box'
    })

    const loadBalancer = new elb.ApplicationLoadBalancer(this, 'load-balancer', {
      vpc: defaultVpc,
      securityGroup: elbSecurityGroup,
      internetFacing: true
    })

    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo su',
      'sudo yum install -y amazon-linux-extras',
      'sudo amazon-linux-extras install -y php8.1',
      'sudo yum install -y php-mbstring',
      'yum install -y httpd',
      'systemctl start httpd',
      'systemctl enable httpd',
      'echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/cms/index.php',
      'sudo shutdown -r now'
    );

    const ec2Instance = new ec2.Instance(this, 'api', {
      vpc: defaultVpc,
      role: ec2InstanceRole,
      securityGroup: ec2SecurityGroup,
      instanceName: 'stb-api-v3',
      keyName: 'mb-pro native',
      instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData,
    })

    const targetGroup = new elbTargets.InstanceTarget(ec2Instance, 80)

    const listenerHttps = loadBalancer.addListener('elbListenerHttps', {
      port: 443,
      open: true,
      certificates: [certificateEu]
    })

    listenerHttps.addTargets('https', {
      port: 80,
      targets: [targetGroup],
      healthCheck: {
        path: '/',
      },
    })



    const apiOrigin = new cloudfrontOrigins.LoadBalancerV2Origin(loadBalancer, {
      protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
    })



    const cf = new cloudfront.Distribution(this, "cdnDistribution", {
      defaultBehavior: { origin: new cloudfrontOrigins.S3Origin(websiteBucket) },
      domainNames: ["stb-prod.adriansoovary.de"],
      certificate,
    });

    cf.addBehavior('/cms/*', apiOrigin, {
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: AllowedMethods.ALLOW_ALL,
      originRequestPolicy: {
        // forward all headers to origin
        originRequestPolicyId: '216adef6-5c7f-47e4-b989-5492eafa07d3'
      },
      cachePolicy: {
        // no caching
        cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad'
      },
    })



    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "stb-zone",
      {
        zoneName: "adriansoovary.de",
        hostedZoneId: "Z01103682EZH91OK9PWX4",
      }
    );

    new route53.ARecord(this, "CDNARecord", {
      recordName: 'stb-prod',
      zone,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(cf)),
    });

    new route53.AaaaRecord(this, "AliasRecord", {
      recordName: 'stb-prod',
      zone,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(cf)),
    });

    new cdk.CfnOutput(this, 'public IP', {
      value: ec2Instance.instancePublicIp,
    })
    new cdk.CfnOutput(this, 'public DNS', {
      value: ec2Instance.instancePublicDnsName,
    })
  }
}