
require('module-alias/register');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');
const userService = require("@services/UserChat");

http.listen(process.env.SOCKET_PORT, function () {
  console.log(`Socket listening on port ${process.env.SOCKET_PORT}`);
});

let sockets = [];

const getSocketByUser = id => _.filter(sockets, socket => socket.user && socket.user.chats && _.countBy(socket.user.chats, { id: parseInt(id) }).true);

const emitSocketMessage = (message, event, params) => {
  const socketsChat = getSocketByUser(message.chat_id);
  if (!socketsChat.length) return false;
  sockets.map(socket => {
    if (socket) socket.emit(event, params)
  })
}

const emitSocketDelete = (data, event, params) => {
  const socketsChat = getSocketByUser(data.id);
  if (!socketsChat.length) return false;
  sockets.map(socket => {
    if (socket) socket.emit(event, params)
  })
}

const emitSocketTyping = (data, event, params) => {
  const socketsChat = getSocketByUser(data.chatId);
  if (!socketsChat.length) return false;
  sockets.map(socket => {
    if (socket) socket.emit(event, params)
  });
}

io.on('connection', socket => {

  socket.on("initUser", async (user) => {
    socket.user = user;
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("disconnect", () => {
    sockets = _.reject(sockets, socket);
  });

  socket.on('message', message => {
    emitSocketMessage(message, 'message', message);
  });

  socket.on('typing', data => {
    emitSocketTyping(data, 'userTyping', data);
  });

  socket.on('deleteChat', data => {
    emitSocketDelete(data, 'deleteChat', data);
  });

  sockets.push(socket);
});