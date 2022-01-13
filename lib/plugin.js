const { Server } = require('socket.io')
const path = require('path')

module.exports = async function (scope, options) {
  const { _, fs, fastGlob } = scope.ndut.helper
  const { config } = scope

  const io = new Server(scope.server, options)
  scope.addHook('onClose', async (instance, done) => {
    scope.log.debug('Closing socket.io server')
    io.close()
    done()
  })
  io.on('connection', async socket => {
    for (const n of config.nduts) {
      const files = await fastGlob(`${n.dir}/ndutSocketIo/event/*.js`)
      for (const f of files) {
        let topic = path.basename(f, '.js')
        let module = require(f)
        if (_.isFunction(module)) module = { handler: module }
        if (module.io || topic === 'connection') {
          await module.handler.call(scope, socket)
          continue
        }
        topic = module.topic || topic
        const method = module.method || 'on'
        const instance = module.conn ? socket.conn : socket
        instance[method](topic, async (...args) => {
          await module.handler.call(scope, socket, ...args)
        })
      }
    }
  })
  scope.ndutSocketIo.io = io
}
