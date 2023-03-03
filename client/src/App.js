
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import ScreePlot from './charts/ScreePlot';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { screedata: [], di : 5};

      this.diHandler = this.diHandler.bind(this);
  }

  diHandler(value) {
      console.log('diHandler called with ' + value);
      this.setState( {di : value} )
  }

  componentDidMount() {
      axios.get('http://localhost:8000/screedata')
        .then(response => this.setState({ screedata: response.data }));
  }

  render() {
      return (
        <div>
          <ScreePlot screedata={this.state.screedata} diHandler={this.diHandler} di={this.state.di}/>
        </div>
        
      )
  }
}

export default App;
