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
    this.listeners[to].forEach(fn => fn(message, from));
  }
}


class Client extends React.Component {
  constructor(props) {
    super(props);
    this.logs = [];
    this.connections = [];
    this.medium = props.medium;
    props.medium.subscribe(props.id, this.onMessage);
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

  connectTo = (c) => {
    this.log('Connecting');
    this.medium.send(this.props.id, c, 'I want to connect');
  }

  onMessage = (message, from) => {
    this.log(`From [${from}]: ${message}`);
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
            ref={c => this.client1 = c}
            clients={this.clients}
            medium={this.medium} />
        ))}
      </div>
    );
  }
}

export default App;