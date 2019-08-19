# CBT Screenshot App

The repo is an Electron app that using CrossBrowserTesting API to do batch screenshots and display the results.

## App dependencies
This app needs 3 services
1. A CrossBrowserTesting Unlimited Account
2. A Mongo DB: for save configs. The db can a be remote host from [mLab](https://mlab.com) or [mongodb cloud](https://cloud.mongodb.com) or a local host.
3. AWS Lambda: a serverless function for calling CrossBrowserTesting API to take screenshots

## Development
This repository includes 4 projects:
1. common: shared code for electron and react
2. react: the UI APP
3. electron: the wrapper of the UI APP 
4. lambda: the screenshot task executor

Number 1 to 3 projects are written in Javascript and these projects are for the client App.
To launch the app in development mode, you have to open 3 terminals and run:

``` bash
# window 1 for common
$ cd common
$ npm run start

# window 2 for react
$ cd react 
$ npm run start

# window 3 for electron
$ cd electron
$ npm run start
```

Number 4 project is written in C# with .Net Core 2.1 and it is for AWS Lambda. It can be only executed by AWS Lambda.

## Deploy
The client app is deploy to GitHub Release. Our CI server will be triggered by git Tag Push and automatically push files to Github.

To manually build the client app. you have to open 3 terminals and run:
``` bash
# window 1 for common
$ cd common
$ npm run build

# window 2 for react
$ cd react 
$ npm run build

# window 3 for electron
$ cd electron
$ npm run build
```

For lambda project, run these command to deploy to AWS Lambda
``` bash
$ dotnet tool install -g Amazon.Lambda.Tools # for first time
$ dotnet lambda deploy-function cbt-screenshot-task # to upload the zip file
```
> your machine must have a "swarm" profile in your ~/.aws/credentials and ~/.aws/configs for deployment or use **--profile** to give a specific profile.

## App Demo Images
### Home Screen
![home screen](./images/home-screen.png)

### Setting Screen
![setting screen](./images/setting-screen.png)

## Setup Database
The mongo database doesn't need to be set up, you just need to pass the connection string to the client app and lambda.

You can use docker to start a local mongodb
``` bash
$ docker run -p 27017:27017 mongo
```
so the connection string is **mongodb://localhost:27017/csa** and the db name is **csa**

## Setup AWS Lambda
To setup the AWS Lambda, you need
1. create a Aws lambda with name called **"cbt-screenshot-task"**
2. the execution role needs **Lambda Invoke** permissions and **CloudWatchLog Write** permissions, the policy is like
``` JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "lambda:InvokeFunction",
                "lambda:InvokeAsync",
                "logs:CreateLogGroup",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
```
3. put Environment variables for "DB_CONNECTION_STRING" and "DB_NAME"
4. create a AWS User on IAM for the APP, the permission needs
``` JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction",
                "lambda:InvokeAsync"
            ],
            "Resource": "*"
        }
    ]
}
```
5. then put the AWS Access Key Id and AWS Access Key Secret via the client App on Setting Screen.

## Development Nodes
1. Because CrossBrowserTesting doesn't have batch executing screenshots, so we create this app to do that.
2. The app has a better list of pages to view the screenshot results than the original UI of CrossBrowserTesting
3. The app supports quickly switching projects(websites)
4. The database structure is
- project: store configs and pages
- pages: store the information of pages
- tasks: store the information of tasks
5. The workflow is
- when you select pages to take screenshots, the app store the information into tasks collection.
- invoke AWS Lambda and the function will call CrossBrowserTesting API to take screenshots based on tasks collection.
- the app save the results in pages collection, so you can view the result via the app.
