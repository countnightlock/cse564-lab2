
import './App.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Divider, List, ListItem, ListItemText, Stack } from '@mui/material';
import ParallelCoords from './charts/ParallelCoords';
import { dimensionsConfig } from './utils/dimensions';
import { arrayMoveImmutable } from 'array-move';
import { Container, Draggable } from '@edorivai/react-smooth-dnd';


class App extends Component {
  constructor(props) {
      super(props);
      this.state = { alldata: [], labels: [], biplotdata: [], columndata: [], actualdata: [], columns: [], elbowdata: [], di : 5};

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
      axios.get('http://localhost:8000/labels')
        .then(response => this.setState({ labels: response.data }));
      axios.get('http://localhost:8000/actualdata?cols=all')
        .then(response => this.setState({ alldata: response.data }));

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
        <Stack spacing={2} divider={<Divider orientation='horizontal' flexItem/>} >
          <div>
            <h1>Scree Plot</h1>
            <p>This graph shows each principal component's individual contributions to explained variance.</p>
            <p>The line shows cumulative explained variance.</p>
            <p>You can click on the bars to set the dimensionality index (di). This will influence the number of PCs over which sum of squared loadings is calculated.</p>
            <List>
              <Container dragHandleSelector='.drag-handle' lockAxis='y' onDrop={this.onDrop}>
                {
                this.state.columns.map((column, index) => {
                  return <Draggable key={index}>
                    <ListItem>
                      <ListItemText className='drag-handle' primary={column} />
                    </ListItem>
                  </Draggable>
                })}
              </Container>
            </List>
            <ParallelCoords alldata={this.state.alldata} columns={this.state.columns} labels={this.state.labels} />
          </div>
        </Stack>
      )
  }
}

export default App;
