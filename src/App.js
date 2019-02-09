import React from 'react';
import './App.css';
import WebRTCConnection from './WebRTCConnection';

class Medium {
  constructor() {
    this.listeners = {};
  }

  subscribe(address, fn) {
    if (!this.listeners[address])
      this.listeners[address] = new Set();
    this.listeners[address].add(fn);
  }

  unsubscribe(address, fn) {
    if (!this.listeners[address])
      return;
    this.listeners[address].delete(fn);
  }
  
  send(from, to, message) {
    if (!this.listeners[to])
      return;
    this.listeners[to].forEach(fn => fn(from, message));
  }
}


class Client extends React.Component {
  constructor(props) {
    super(props);
    this.logs = [];
    this.connections = {};
    this.medium = props.medium;

    this.messageReceiveListeners = new Set();
    props.medium.subscribe(props.id, this.receive);
  }

  render() {
    return (
      <div className="client">
        <div className="id">{this.props.id}</div>

        <div>
          { this.props.clients.map(c => (c !== this.props.id) && (
            <button onClick={_ => this.connectTo(c) } key={c}>
              Connect To [{c}]
            </button>
          ))}
        </div>

        <div className="logs">
          { this.logs.map((l, i) => <div key={i}>{l}</div>) }
        </div>
      </div>
    );
  }

  log = (l) => {
    this.logs.push(l);
    this.forceUpdate();
  }

  connectTo = (remoteId) => {
    if (this.connections[remoteId]) {
      this.log('Connection already exists');
      return;
    }    
    this.log('Connecting to ' + remoteId);

    var connection = this.createNewConnectionTo(remoteId);
    connection.connect();
  }

  receive = (remoteId, message) => {
    console.log(this.connections, remoteId)
    if (!this.connections[remoteId]) {
      this.log('📞  Incoming connection request from ' + remoteId)
      this.createNewConnectionTo(remoteId);
    }

    this.messageReceiveListeners.forEach(fn => fn(remoteId, message));
  }

  onMessageReceive = (fn) => {
    this.messageReceiveListeners.add(fn);
  }


  createNewConnectionTo = (remoteId) => {
    var myId = this.props.id;
    var connection = this.connections[remoteId] = new WebRTCConnection({
      self: myId,
      remote: remoteId,
    });
    connection.setSendFn(m => this.medium.send(myId, remoteId, m));
    connection.setLogFn(m => this.log(`<connection ${remoteId}> ${m}`));
    this.onMessageReceive((from, m) => {
      if (from === remoteId) connection.receive(m);
    });
    connection.onStatusChange(s => { this.log(`<connection ${remoteId}> ${s}`) });

    this.log(`<connection ${remoteId}> created.`)
    return connection;
  }
}


class App extends React.Component {
  constructor() {
    super();
    this.medium = new Medium();
    this.clients = ['client1', 'client2', 'client3'];
  }

  render() {
    return (
      <div className="app">
        {this.clients.map(c => (
          <Client
            id={c}
            key={c}
            clients={this.clients}
            medium={this.medium} />
        ))}
      </div>
    );
  }
}

export default App;