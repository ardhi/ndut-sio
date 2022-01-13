module.exports = async function (socket, reason) {
  this.log.info(`[sio] Socket '${socket.id}' disconnected, reason: '${reason}'`)
}
