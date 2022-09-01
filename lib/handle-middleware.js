module.exports = async function (socket) {
  const { _, fastGlob, getConfig, getNdutConfig } = this.ndut.helper
  const config = getConfig()
  for (const n of config.nduts) {
    const cfg = getNdutConfig(n)
    const files = await fastGlob(`${cfg.dir}/ndutSocketIo/middleware/*.js`)
    for (const f of files) {
      const fn = require(f)
      socket.use(fn)
    }
  }
}
