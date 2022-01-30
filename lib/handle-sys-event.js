const sysEvents = require('./sys-events.json')

module.exports = async function (socket) {
  const { _, fastGlob, getConfig, getNdutConfig } = scope.ndut.helper
  const { emit } = scope.ndutSocketIo.helper
  const config = getConfig()
  for (const n of config.nduts) {
    const cfg = getNdutConfig(n)
    const files = await fastGlob(`${cfg.dir}/ndutSocketIo/sys-event/*.js`)
    for (const f of files) {
      let topic = path.basename(f, '.js').toLowerCase()
      if (!sysEvents.includes(topic)) continue
      let module = require(f)
      if (_.isFunction(module)) module = { handler: module }
      topic = module.topic || topic
      if (module.io || topic === 'connection') {
        const resp = await module.handler.call(this, socket)
        if (resp && cfg.name === 'ndut-socket-io') emit(socket, topic, resp)
        continue
      }
      const method = module.method || 'on'
      const instance = module.conn ? socket.conn : socket
      instance[method](topic, async (...args) => {
        const resp = await module.handler.call(this, socket, ...args)
        if (resp) emit(instance, topic, resp)
      })
    }
  }
}
