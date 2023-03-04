
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import ScreePlot from './charts/ScreePlot';
import BiPlot from './charts/BiPlot';
import DenseTable from './charts/DenseTable';
import ScatterGrid from './charts/ScatterGrid';
import ElbowPlot from './charts/ElbowPlot';
import { Divider, Stack } from '@mui/material';


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
        <Stack spacing={2} divider={<Divider orientation='horizontal' flexItem/>} >
          <div>
            <h1>Scree Plot</h1>
            <p>This graph shows each principal component's individual contributions to explained variance.</p>
            <p>The line shows cumulative explained variance.</p>
            <p>You can click on the bars to set the dimensionality index (di). This will influence the number of PCs over which sum of squared loadings is calculated.</p>
            <ScreePlot screedata={this.state.screedata} diHandler={this.diHandler} di={this.state.di}/>
          </div>
          <div>
            <h1>Table of Loadings</h1>
            <p>This table shows as many PCs as selected on the scree plot.</p>
            <p>Rows are sorted based on the sum of squared loadings.</p>
            <p>The top four are chosen for our scatterplot matrix. For completion's sake I've showed all rows.</p>
            <DenseTable columndata={this.state.columndata} di={this.state.di}/>
          </div>
          <div>
            <h1>Scatterplot Matrix</h1>
            <p>Negative diagonal displays a basic "chart" with just the column name and legend.</p>
            <ScatterGrid actualdata={this.state.actualdata} labels={this.state.labels} cols={this.state.columns}/>
          </div>
          <div>
            <h1>BiPlot</h1>
            <p>This graph shows a scatterplot but on the top two PCs.</p>
            <p>This graph also shows a representation of the eigenvalues and eigenvectors for the original columns of our dataset.</p>
            <BiPlot biplotdata={this.state.biplotdata} labels={this.state.labels} columndata={this.state.columndata} di={this.state.di}/>
          </div>
          <div>
            <h1>Elbow Method</h1>
            <p>The elbow is seen at k = 2, therefore 2 clusters.</p>
            <p>The elbow method is a graphical representation of finding the optimal 'K' in a K-means clustering.</p>
            <p>It works by finding WCSS (Within-Cluster Sum of Square) i.e. the sum of the square distance between points in a cluster and the cluster centroid.</p>
            <ElbowPlot elbowdata={this.state.elbowdata}/>
          </div>
        </Stack>
      )
  }
}

export default App;
