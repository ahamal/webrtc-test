import React from 'react';
import './App.css';

class Communicator {
  
}

class Client extends React.Component {
  render() {
    return (<div>{this.props.role}</div>)
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Client
          role="serving"
          ref={c => this.client1 = c} />
        <Client
          role="connector"
          ref={c => this.client1 = c} />
      </div>
    );
  }
}

export default App;
