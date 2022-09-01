module.exports = async function (socket, token) {
  const { _ } = this.ndut.helper
  const { getUserByApiKeyAuth } = this.ndutAuth.helper
  if (_.isEmpty(token)) throw this.Boom.internal('tokenRequired', { token: required, ndut: 'sio' })
  let current
  try {
    current = await this.ndutApi.helper.findOne({ model: 'SioStore', params: { where: { id: socket.id } }, options: { noThrow: true } })
    if (current && current.token === token) return current
  } catch (err) {}
  const request = {
    headers: { authorization: ' ' + token }
  }
  const user = await getUserByApiKeyAuth(request)
  const data = {
    id: socket.id,
    userId: user.id,
    siteId: user.siteId
    // token
  }
  if (this.ndutRole) {
    const team = await this.ndutRole.helper.getAccessByUser(user.id)
    data.teamId = team.id
  }
  if (current) {
    // const resp = await this.ndutDb.
  }
  return await this.ndutApi.helper.create({ model: 'SioStore', body: data })
}
