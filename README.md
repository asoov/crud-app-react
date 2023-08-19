# CRUD-App
This is a typical React CRUD app. A task oftentimes given to new developers to test their skills in coding challenges.

## Structure

The app is a monorepo divided in two parts:

- The frontend, which is a React app, displaying a list of users that can be edited, deleted or added.
- An AWS-CDK Template creating the needed infrastructure to run the app on AWS.

Apart from that there is a Github Action workflow that tests and builds the app and subsequently deploys it to AWS.

## How to run

- Install dependencies with `yarn install`

To run the React application:
- Run the app in dev mode `yarn frontend:dev`
- Run the tests with `yarn frontend:test`
- Build the app with `yarn frontend:build`

To create resources on AWS:
- Synthesize a CloudFormation template `yarn cdk:synth`
- Deploy the stack `yarn cdk:deploy`

Note that for this you'll have to have AWS-CLI installed and correctly configured with your AWS user credentials and your user needs to have the correct IAM permissions.
