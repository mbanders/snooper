# snooper
This web app provides data summaries about reddit users

## Setup

Tested for Linux (Ubuntu/Debian). If you're using Windows, good luck.

This project requires a mongo database to store data.

1. Install mongodb.
1. Install node and npm:
    ```sh
    sudo apt-get update
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install nodejs
    ```
1. Verify install:
    ```sh
    npm -v
    nodejs -v
    ```
1. Give node the privilege (capability) to run on a low port (such as port 80):
    ```sh
    sudo setcap 'cap_net_bind_service=+ep' $(readlink -f $(which nodejs))
    ```
1. Get this project and install required packages:
    ```sh
    git clone git@github.com:mbanders/snooper.git
    cd spot
    npm install
    ```

Now you may try to run it with `node index.js` and then visit http://localhost/u/someUserName
