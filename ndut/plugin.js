const { Server } = require('socket.io')
const handleEvent = require('../lib/handle-event')
const handleConnect = require('../lib/handle-connect')
const handleMiddleware = require('../lib/handle-middleware')

const plugin = async function (scope, options) {
  const { _, defNdutKeys } = scope.ndut.helper
  const io = new Server(scope.server, _.omit(options, defNdutKeys))
  scope.ndutSocketIo.io = io
  scope.addHook('onClose', async (instance, done) => {
    scope.log.debug('Closing socket.io server')
    io.close()
    done()
  })
  io.on('connection', async socket => {
    socket.join('lobby')
    await handleConnect.call(scope, socket)
    await handleEvent.call(scope, socket)
    await handleMiddleware.call(scope, socket)
  })
}

module.exports = async function () {
  const { fp } = this.ndut.helper
  return fp(plugin)
}
