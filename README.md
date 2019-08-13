# CBT Screenshot App

The repo is an Electron app that using CrossBrowserTesting API to do batch screenshots and display the results.

## App dependencies
This app needs 4 services
1. A CrossBrowserTesting Unlimited Account
2. A Mongo DB
3. AWS SQS 
4. AWS Lambda

## Development
There are 4 projects includes
1. common: shared code for electron and react
2. react: the UI APP
3. electron: the wrapper of the UI APP 
4. lambda: the screenshot task executor

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
