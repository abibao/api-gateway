import feathers from 'feathers-client'
import io from 'socket.io-client'

class FeathersClient {

  constructor () {
    const host = 'http://localhost:8383'
    let socket = io(host, { transports: ['websocket'] })
    this.feathers = feathers()
      .configure(feathers.hooks())
      .configure(feathers.socketio(socket))
      .configure(feathers.authentication({ storage: window.localStorage }))
  }

}

export default new FeathersClient().feathers
