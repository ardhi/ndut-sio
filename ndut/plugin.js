const { Server } = require('socket.io')
const handleEvent = require('../lib/handle-event')
const handleSysEvent = require('../lib/handle-sys-event')
const handleMiddleware = require('../lib/handle-middleware')

const plugin = async function (scope, options) {
  const io = new Server(scope.server, options)
  scope.ndutSocketIo.io = io
  scope.addHook('onClose', async (instance, done) => {
    scope.log.debug('Closing socket.io server')
    io.close()
    done()
  })
  io.on('connection', async socket => {
    await handleSysEvent.call(this, socket)
    await handleEvent.call(this, socket)
    await handleMiddleware.call(this, socket)
  })
}

module.exports = async function () {
  const { fp } = this.ndut.helper
  return fp(plugin)
}
