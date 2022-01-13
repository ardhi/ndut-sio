const defCors = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

module.exports = async function () {
  const { fp, getNdutConfig } = this.ndut.helper
  const name = 'ndut-socket-io'
  const alias = 'sio'
  const plugin = fp(require('./lib/plugin'))
  const options = getNdutConfig('ndut-socket-io')
  options.cors = options.cors || defCors
  return { name, plugin, alias, options }
}
