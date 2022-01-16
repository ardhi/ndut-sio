module.exports = async function (socket, ...args) {
  const [evt, data, ...opts ] = args
  if (data instanceof Error) {
    socket.emit(evt, {
      success: false,
      message: data.message,
      details: data.details
    })
  } else {
    socket.emit(evt, data, ...opts)
  }
}
