
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import ScreePlot from './charts/ScreePlot';
import BiPlot from './charts/BiPlot';
import DenseTable from './charts/DenseTable';
import ScatterGrid from './charts/ScatterGrid';
import ElbowPlot from './charts/ElbowPlot';


class App extends Component {
  constructor(props) {
      super(props);
      this.state = { screedata: [], labels: [], biplotdata: [], columndata: [], actualdata: [], columns: [], elbowdata: [], di : 5};

      this.diHandler = this.diHandler.bind(this);
  }

  getTopFourColumns(response) {
    const cols = Object.keys(response.data).slice(0, 4);
    this.setState({ columns: cols});
    return cols;
  }

  diHandler(value) {
    axios.get(`http://localhost:8000/columndata?di=${value}`)
        .then(response => {
          this.setState({ di : value });
          this.setState({ columndata: response.data });
          return axios.get(`http://localhost:8000/actualdata?cols=${this.getTopFourColumns(response).join(',')}`);
        })
        .then(response => this.setState({ actualdata: response.data }));
  }

  componentDidMount() {
      axios.get('http://localhost:8000/screedata')
        .then(response => this.setState({ screedata: response.data }));
      axios.get('http://localhost:8000/labels')
        .then(response => this.setState({ labels: response.data }));
      axios.get('http://localhost:8000/biplotdata')
        .then(response => this.setState({ biplotdata: response.data }));
      axios.get(`http://localhost:8000/columndata?di=${this.state.di}`)
        .then(response => {
          this.setState({ columndata: response.data });
          return axios.get(`http://localhost:8000/actualdata?cols=${this.getTopFourColumns(response).join(',')}`);
        })
        .then(response => this.setState({ actualdata: response.data }));
      axios.get('http://localhost:8000/elbowplot')
        .then(response => this.setState( {elbowdata: response.data} ));
  }

  render() {
      return (
        <div>
          <ScreePlot screedata={this.state.screedata} diHandler={this.diHandler} di={this.state.di}/>
          <BiPlot biplotdata={this.state.biplotdata} labels={this.state.labels} columndata={this.state.columndata} di={this.state.di}/>
          <DenseTable columndata={this.state.columndata} di={this.state.di}/>
          <ScatterGrid actualdata={this.state.actualdata} labels={this.state.labels} cols={this.state.columns}/>
          <ElbowPlot elbowdata={this.state.elbowdata}/>
        </div>
      )
  }
}

export default App;
