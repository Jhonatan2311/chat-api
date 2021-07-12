var env_local = {
    "PORT": 8200,
    "SOCKET_PORT": 8230,
    "DB_PORT": 3306,
    "DB_USER": "root",
    "DB_PASS": "",
    "DB_HOST": "localhost",
    "DB_NAME": "chat_api",
    "NODE_ENV": "local",
    "TZ": "America/Sao_Paulo",
};

const socket = {
    name: "chat-socket",
    script: "./socket.js",
    watch: false,
    env_local: env_local
};

const api = {
    name: "chat-api",
    script: "./index.js",
    watch: false,
    env_local: env_local
};

module.exports = {
    apps: [api, socket],
    deploy: {
    }
};