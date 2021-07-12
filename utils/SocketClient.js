const socket = require('socket.io-client')(`http://192.168.0.102:8230`);

const emit = (event, obj) => socket.emit(event, obj);

module.exports = {
  emit,
};