# ST0507 ADES AY21/22 Sem 1 CA1 Backend

## Setup

1. Install [Node Js](https://nodejs.org/en/download/) if you have not done so.
    1. Alternative Installation via [Chocolatey](https://chocolatey.org/packages/nodejs-lts)
    2. Check if you have installed node previously by running `node --version`
        1. You should see the version number (e.g. `v14.15.0`)
2. Install [Docker](https://docs.docker.com/get-docker/) if you have not done so.
    1. Check if you have installed Docker previously by running `docker -v`
        1. You should see the version number (e.g. `Docker version 20.10.2, build 2291f61`)
3. Install [VS Code](https://code.visualstudio.com/download) if you have not done so previously.
4. Install the following VS Code Plugins
    1. [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
    2. [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
    3. [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)
    4. [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
5. Clone the repository ([How to clone a repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository))
6. Open a terminal at the folder path
7. Run `npm install`
8. Create a new file in the root directory `.env` (Note the dot at the front) and paste the following values into the file:

    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=user
    DB_PASSWORD=password
    DB_DATABASE=virtual_queue
    DB_TEST_PORT=6543
    ```

## Run

1. Start the database by executing the following:

    ```
    npm run start-db
    ```

    You should observe the following (Intentionally truncated to be concise):

    ```
    $ npm run start-db

    > 2122s1-backend@1.0.0 start-db
    > docker-compose up

    Creating network "2122s1-backend-solution_default" with the default driver
    Creating db      ... done
    Creating db-test ... done
    Attaching to db-test, db
    ...
    ...
    db         | 2021-03-03 10:08:04.290 UTC [1] LOG:  database system is ready to accept connections
    db-test    | 2021-03-03 10:08:04.310 UTC [1] LOG:  database system is ready to accept connections
    ```

    The process will keep running, ❗ **DO NOT kill it with `CTRL + C`** ❗

2. Start the server by running:

    ```
    npm start
    ```

    you should observe the following:

    ```
    $ npm start

    > 2122s1-backend@1.0.0 start
    > node ./www.js

    Backend Listening on port 3000
    ```

3. Open the file `./tests/http/enqueue_dequeue.test.http`

    Make use of the 3 request inside to test the correctness of the system.

    > ⚠️ You will need the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VSCode plugin

    1. enqueue: The returned `customer_id` should increment each time you make a request
    2. dequeue: The returned `customer_id` should increment each time you make a request, when there's no customer in the queue, the `customer_id` should be 0.
    3. not found: You should get a status 404 with the following response:

        ```json
        {
            "code": "URL_NOT_FOUND",
            "error": "GET /afjsdlfjsdl Not Found"
        }
        ```

## Test

1. Unit/Integration test

    ```
    $ npm run test
    ```

2. ESLint

    ```
    $ npm run eslint
    ```

3. Stress Test

    ```
    $ npm run stress-enqueue

    $ npm run stress-dequeue
    ```
