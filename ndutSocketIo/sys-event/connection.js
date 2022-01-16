const login = require('../../lib/auth/login')

module.exports = async function (socket) {
  this.log.info(`[sio] Socket '${socket.id}' connected`)
  const { emit } = this.ndutSocketIo.helper
  const token = _.get(socket, 'handshake.auth.token')
  // if (token && this.ndutAuth) return await login.call(this, socket, token)
}
