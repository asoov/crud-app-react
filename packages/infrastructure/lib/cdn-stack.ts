import * as cdk from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_route53_targets as route53Targets,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { BlockPublicAccess, BucketAccessControl } from "aws-cdk-lib/aws-s3";

export class CdnStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "asoov-crud-app", {
      bucketName: "asoov-crud-app",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "/error/index.html",
    });

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      "arn:aws:acm:us-east-1:714722585977:certificate/ca866223-b0f4-4958-a7aa-bf1ba40ad4f9",
    );

    const cf = new cloudfront.Distribution(this, "cdnDistribution", {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(websiteBucket),
      },
      domainNames: ["crud-app.adriansoovary.de"],
      certificate,
    });

    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "crud-app-zone",
      {
        zoneName: "adriansoovary.de",
        hostedZoneId: "Z01103682EZH91OK9PWX4",
      },
    );

    new route53.ARecord(this, "CDNARecord", {
      recordName: "crud-app",
      zone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(cf),
      ),
    });

    new route53.AaaaRecord(this, "AliasRecord", {
      recordName: "crud-app",
      zone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(cf),
      ),
    });
  }
}
