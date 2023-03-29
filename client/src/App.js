
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Divider, ListItem, ListItemText, Stack } from '@mui/material';
import ParallelCoords from './charts/ParallelCoords';
import { dimensionsConfig } from './utils/dimensions';
import { arrayMoveImmutable } from 'array-move';
import { Container, Draggable } from '@edorivai/react-smooth-dnd';
import VarsMdsChart from './charts/VarsMdsChart';
import MiniScatterPlot from './charts/MiniScatterPlot';


class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        alldata: [],
        labels: [],
        mdsdata: [],
        mdsvars: [],
        biplotdata: [],
        columndata: [],
        actualdata: [],
        columns: [],
        corrColumns: [],
      };

      this.diHandler = this.diHandler.bind(this);
      this.pcpHandler = this.pcpHandler.bind(this);
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

  pcpHandler(dimension) {
    let cols = this.state.corrColumns.slice(0);
    if (this.state.corrColumns.includes(dimension)) {
      cols = cols.filter(item => item !== dimension);
    } else {
      cols.push(dimension);
    }
    this.setState({corrColumns : cols});
  }

  componentDidMount() {
      axios.get('http://localhost:8000/labels')
        .then(response => this.setState({ labels: response.data }));
      axios.get('http://localhost:8000/actualdata?cols=all')
        .then(response => this.setState({ alldata: response.data }));

      axios.get('http://localhost:8000/mdsdata')
        .then(response => this.setState({ mdsdata: response.data }));
      axios.get('http://localhost:8000/mdsvars')
        .then(response => this.setState({ mdsvars: response.data }));

      if (this.state.columns.length === 0) {
        this.setState({ columns: Array.from(dimensionsConfig.keys()) });
      }
  }

  // https://codesandbox.io/s/74wxnz38m6?file=/src/index.js
  onDrop = ({ removedIndex, addedIndex }) => {
      let tempColumnsArray = this.state.columns.slice(0);
      const newColumns = arrayMoveImmutable(tempColumnsArray, removedIndex, addedIndex);
      this.setState({ columns: newColumns });
  }

  render() {
      return (
        <Stack spacing={1} divider={<Divider orientation='horizontal' flexItem/>} >
          <div id='mds-container'>
            <h1>MDS Chart - Data</h1>
            <p>
              This chart shows the result of applying Multidimensional Scaling on our data. The distance between any
              two points on the chart is representative of the distance between those points in the original data space.
            </p>
            <p>
              The x and y axes have no significance other than to provide a frame of reference for the closeness of points.
            </p>
            <p>
              Points are colored based on k-means clustering performed in lab 2a. 
            </p>
            <p>
              <span id='class-1'>⬤</span> = cluster 1, <span id='class-2'>⬤</span> = cluster 2
            </p>
            <MiniScatterPlot dimensionX={'x'} dimensionY={'y'} labels={this.state.labels} data={this.state.mdsdata} />
          </div>

          <div id='pcp-info-container'>
            <h1>Parallel Coordinates Plot - All Dimensions</h1>
            <p>
              This chart shows data in the form of one polyline per datapoint. A polyline is made up of line segments
              between the values on their corresponding dimension.
            </p>
            <p>
              You can drag and drop the cells below to rearrange axes.
            </p>
            <p>
              Polylines are colored based on k-means clustering performed in lab 2a. 
            </p>
            <p>
              <span id='class-1'>⬤</span> = cluster 1, <span id='class-2'>⬤</span> = cluster 2
            </p>
          </div>

          <div id='pcp-table-container'>
            <Stack direction='row'>
              <Container orientation='horizontal' dragHandleSelector='.drag-handle' lockAxis='x' onDrop={this.onDrop}>
                {
                this.state.columns.map((column, index) => {
                  return <Draggable key={index}>
                    <ListItem className='drag-handle' sx={{ border: 1 }}>
                      <ListItemText primary={column} />
                    </ListItem>
                  </Draggable>
                })}
              </Container>
            </Stack>
          </div>

          <div id='pcp-chart-container'>
            <ParallelCoords alldata={this.state.alldata} columns={this.state.columns} labels={this.state.labels} />
          </div>

          <div id='mds-vars-container'>
            <h1>MDS Chart - Variables</h1>
            <p>
              This chart shows the result of applying Multidimensional Scaling on our variables' correlation matrix. In particular, we
              use the <code>1 - |correlation|</code> metric to keep highly correlated variables closer on the chart.
            </p>
            <p>
              Click on points to toggle their presence in the PCP below. Note that only numerical variables are plotted here.
            </p>
            <p>
              <span id='var-selected'>⬤</span> = selected, <span id='var-unselected'>⬤</span> = not selected
            </p>
          </div>

          <div id='charts-container'>
            <VarsMdsChart corrColumns={this.state.corrColumns} mdsvars={this.state.mdsvars} pcpHandler={this.pcpHandler} />
          </div>

          {
            this.state.corrColumns.length === 0 ?
              <div id='charts-container'>
                <h1>Please select at least one dimension to view PCP.</h1>
              </div> :
              <div id='pcp-chart-container'>

                  <h1>Variables MDS driven PCP</h1>
                  <p>
                    Polylines are colored based on k-means clustering performed in lab 2a. 
                  </p>
                  <p>
                    <span id='class-1'>⬤</span> = cluster 1, <span id='class-2'>⬤</span> = cluster 2
                  </p>


                  <ParallelCoords alldata={this.state.alldata} columns={this.state.corrColumns} labels={this.state.labels} />

              </div>
          }
        </Stack>
      )
  }
}

export default App;
