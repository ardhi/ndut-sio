module.exports = async function (socket) {
  const { _, fastGlob, getNdutConfig } = this.ndut.helper
  for (let n of config.nduts) {
    n = getNdutConfig(n)
    const files = await fastGlob(`${n.dir}/ndutSocketIo/middleware/*.js`)
    for (const f of files) {
      const fn = require(f)
      socket.use(fn)
    }
  }
}
