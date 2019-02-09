class WebRTCConnection {
  constructor({ self, remote }) {
    this.self = self;
    this.remote = remote;
    this.statusChangeListeners = new Set();
  }

  setSendFn(fn) {
    this.send = fn;
  }

  setLogFn(fn) {
    this.log = fn
  }

  receive(m) {

  }

  connect() {
    this.send('Hello there, I\'m trying to connect')
  }

  onStatusChange(fn) {
    this.statusChangeListeners.add(fn);
  }
}

export default WebRTCConnection;