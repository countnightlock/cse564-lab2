
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Divider, ListItem, ListItemText, Stack } from '@mui/material';
import ParallelCoords from './charts/ParallelCoords';
import { dimensionsConfig } from './utils/dimensions';
import { arrayMoveImmutable } from 'array-move';
import { Container, Draggable } from '@edorivai/react-smooth-dnd';
import DummySelector from './charts/DummySelector';
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
        elbowdata: [],
        di : 5,
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

      // axios.get(`http://localhost:8000/columndata?di=${this.state.di}`)
      //   .then(response => {
      //     this.setState({ columndata: response.data });
      //     return axios.get(`http://localhost:8000/actualdata?cols=${this.getTopFourColumns(response).join(',')}`);
      //   })
      //   .then(response => this.setState({ actualdata: response.data }));
  }

  // https://codesandbox.io/s/74wxnz38m6?file=/src/index.js
  onDrop = ({ removedIndex, addedIndex }) => {
      let tempColumnsArray = this.state.columns.slice(0);
      const newColumns = arrayMoveImmutable(tempColumnsArray, removedIndex, addedIndex);
      this.setState({ columns: newColumns });
  }

  render() {
      return (
        <Stack spacing={2} divider={<Divider orientation='horizontal' sx={{width: 1/2}} flexItem/>} >
          <div>
            <h1>Scree Plot</h1>
            <p>This graph shows each principal component's individual contributions to explained variance.</p>
            <p>The line shows cumulative explained variance.</p>
            <p>You can click on the bars to set the dimensionality index (di). This will influence the number of PCs over which sum of squared loadings is calculated.</p>
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
          <DummySelector corrColumns={this.state.corrColumns} mdsvars={this.state.mdsvars} pcpHandler={this.pcpHandler} />
          <ParallelCoords alldata={this.state.alldata} columns={this.state.corrColumns} labels={this.state.labels} />
          <MiniScatterPlot dimensionX={'x'} dimensionY={'y'} labels={this.state.labels} data={this.state.mdsdata} />
        </Stack>
      )
  }
}

export default App;
