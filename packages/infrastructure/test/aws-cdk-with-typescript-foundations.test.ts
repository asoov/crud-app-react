import * as cdk from "aws-cdk-lib";
import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
// import { AwsCdkWithTypescriptFoundationsStack } from '../lib/aws-cdk-with-typescript-foundations-stack';
// import { Template } from 'aws-cdk-lib/assertions';
import * as AwsCdkWithTypescriptFoundations from "../lib/cdn-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/aws-cdk-with-typescript-foundations-stack.ts
test("diese", () => {
  const app = new cdk.App();
  const stack = new AwsCdkWithTypescriptFoundations.CdnStack(
    app,
    "MyTestStack",
  );
  expectCDK(stack).to(matchTemplate({}));
});
