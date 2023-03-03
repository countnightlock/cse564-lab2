
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import ScreePlot from './charts/ScreePlot';
import BiPlot from './charts/BiPlot';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { screedata: [], biplotdata: [], columndata: [], di : 5};

      this.diHandler = this.diHandler.bind(this);
  }

  diHandler(value) {
      console.log('diHandler called with ' + value);
      this.setState( {di : value} )
  }

  componentDidMount() {
      axios.get('http://localhost:8000/screedata')
        .then(response => this.setState({ screedata: response.data }));
      axios.get('http://localhost:8000/biplotdata')
        .then(response => this.setState({ biplotdata: response.data }));
      axios.get('http://localhost:8000/columndata')
        .then(response => this.setState({ columndata: response.data }));
  }

  render() {
      return (
        <div>
          <ScreePlot screedata={this.state.screedata} diHandler={this.diHandler} di={this.state.di}/>
          <BiPlot biplotdata={this.state.biplotdata} columndata={this.state.columndata} di={this.state.di}/>
        </div>
      )
  }
}

export default App;
