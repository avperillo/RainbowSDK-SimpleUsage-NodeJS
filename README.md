# Simple integration Rainbow SDK for Node.JS

A simple integration with Rainbow SDK for NodeJS


## Preamble

You need a Node.JS LTS release installed on your computer.

You need a Rainbow account. Connect to the [Rainbow HUB](https://hub.openrainbow.com) to get your developer account.


## Installation

Clone this repository in the directory you want and then open a shell and executes the following command

```bash

$ npm install

```

## Content

This Starter-Kit is a Node.JS application that:

- Starts the SDK for Node.JS, connects it to Rainbow and answers to incoming chat messages

- Starts a web server for monitoring your application

- Make call between two contacts

- Make call to a specific phone number


## Setup

In order to setup your application, you have to configure 2 JSON files:

- `app/config/bot.json`: This file contains your SDK for Node.JS parameter. Modify it with your Rainbow account.

- `app/config/router.json`: This file contains the default parameter for the embedded web server. Modify it according to your need.

Once you have configured these two files, you can start the application by launching the following command:

```bash

$ node index.js

```


## Server API

Your Node.JS contains an embedded server with 5 default routes:

- `GET .../massbot/ping`: API for having an health check of your application

- `POST .../massbot/sdk/restart`: API for restarting the SDK for Node.JS (stop and start).

- `GET .../massbot/sdk/status`: API for having a status of the SDK for Node.JS

- `POST .../massbot/call/makeCallPhoneNumber`: API for call to phone number

- `POST .../massbot/call/makeCall`: API for call to a Rainbow contact.

You can test these routes using CURL. Here is an example of testing the `massbot/ping` route when the Web Server is launched using `HTTP` and port `3002`:

```bash

$ curl -X GET http://localhost:3002/massbot/ping
> {"code":0}

```

Note: When testing in HTTPS, default self-signed certificates are proposed. For testing with CURL, you have to add the parameter `-k` to avoid the CURL's verification like as follows (launched with `HTTPS` and port `3003`):

```bash
$ curl -X GET https://localhost:3003/massbot/ping -k
> {"code":0}

```

For make a call you can use this commands for test.

```bash
$ curl -d "{\"phone\": \"2150\"}" -H "Content-Type: application/json" -X POST http://localhost:3002/massbot/call/makeCallPhoneNumber
> {"code":0}

```

```bash
$ curl -d "{\"email\": \"email@email.es\", \"phone\": \"2150\"}" -H "Content-Type: application/json" -X POST http://localhost:3002/massbot/call/makeCall
> {"code":0}

```

## Environment

### ESLint

Basic rules for Node.JS JavaScript development have been added.

### Unit Tests

Tests have to be added in directory `test`.

to launch the test, open a sheel and execute the following command:

```bash

$ npm test

```

Each time a file is modified, the tests are executed.

If you want to check the code coverage, launch the following command:

```bash

$ npm run coverage

```