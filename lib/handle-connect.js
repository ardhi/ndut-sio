const login = require('./auth/login')

module.exports = async function (socket) {
  const { _ } = this.ndut.helper
  this.log.info(`[sio] Socket '${socket.id}' connected`)
  const { emit } = this.ndutSocketIo.helper
  const token = _.get(socket, 'handshake.auth.token')
  if (token && this.ndutAuth) {
    await login.call(this, socket, token)
  }
}
