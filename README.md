# snooper
This web app provides data summaries about reddit users

## Setup

Tested for Linux (Ubuntu/Debian). If you're using Windows, good luck.

This project requires a mongo database to store data.

1. Install mongodb on your Ubuntu 16 machine. ([if you need more details](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04))
   ```sh
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
   echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
   sudo apt-get update
   sudo apt-get install mongodb-org
   ```
1. Start the mongo server on your machine:
   ```sh
   sudo systemctl start mongod
   ```
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
    cd snooper/
    npm install
    ```
1. Edit these lines in `reddit_helper.js` to contain your [reddit app credentials](https://github.com/reddit-archive/reddit/wiki/OAuth2):
   ```js
   const r = new snoowrap({
       userAgent: 'Linux:XXXXXXXXXX:1.0 (by /u/XXXXX)',
       clientId: 'XXXXXXXXXX',
       clientSecret: 'XXXXX'
   })
   ```

Now you may try to run it with `node index.js` and then visit http://localhost/u/someUserName
