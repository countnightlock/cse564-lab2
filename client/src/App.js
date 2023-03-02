
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import ScreePlot from './charts/ScreePlot';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = { screedata: [] };
  }

  async componentDidMount() {
      axios.get('http://localhost:8000/screedata')
        .then(response => this.setState({ screedata: response.data }));
  }

  render() {
      return (
        <div>
          <ScreePlot screedata={this.state.screedata}/>
        </div>
        
      )
  }
}

export default App;
