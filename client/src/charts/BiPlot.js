// BiPlot.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

class BiPlot extends Component {

    componentDidMount() {
    }

    getTextRotation(d, xScale, yScale) {
        const xLoad = xScale(d[1]['loading_on_first_two_PC'][0]) - xScale(0);
        const yLoad = yScale(d[1]['loading_on_first_two_PC'][1]) - yScale(0);

        const angle = (Math.atan2(yLoad, xLoad)) * 180 / Math.PI;
        const x = xScale(d[1]['loading_on_first_two_PC'][0] * 2.1);
        const y = yScale(d[1]['loading_on_first_two_PC'][1] * 2.1);

        return `rotate(${angle}, ${x}, ${y})`;
    }

    plotBiPlot(chart, width, height, margins) {
        const data = this.props.biplotdata;

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[0])).nice()
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[1])).nice()
            .range([height, 0]);

        const xGridLines = d3.axisBottom()
            .scale(xScale)
            .ticks(20)
            .tickSize(height, 0, 0)
            .tickFormat('');

        const yGridLines = d3.axisLeft()
            .scale(yScale)
            .ticks(20)
            .tickSize(-width, 0, 0)
            .tickFormat('');

        chart.append('g')
            .call(xGridLines)
            .classed('x-gridline', true)
            .attr('stroke-opacity', 0.1);

        chart.append('g')
            .call(yGridLines)
            .classed('y-gridline', true)
            .attr('stroke-opacity', 0.1);

        chart.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', 4)
            .attr('fill', '#1DB954');

        const xAxis = d3.axisBottom()
            .scale(xScale);

        const yAxis = d3.axisLeft()
            .scale(yScale);

        chart.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll('text');

        chart.select('.x-axis')
            .append('text')
            .attr('x', width)
            .attr('y', 27)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'end')
            .text('PC1 →');

        chart.append('g')
            .classed('y-axis', true)
            .attr('transform', `translate(0,0)`)
            .call(yAxis);

        chart.select('.y-axis')
            .append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .text('↑ PC2');

        chart.append('g')
            .classed('axis-lines', true)
            .selectAll('.axis-line')
            .data(Object.entries(this.props.columndata))
            .enter()
            .append('line')
            .classed('axis-line', true)
            .attr('x1', xScale(0))
            .attr('y1', yScale(0))
            .attr('x2', d => xScale(d[1]['loading_on_first_two_PC'][0] * 2))
            .attr('y2', d => yScale(d[1]['loading_on_first_two_PC'][1] * 2))
            .attr('stroke', 'red')
            .style('stroke-opacity', 0.8);

        chart.append('g')
            .classed('axis-names', true)
            .selectAll('.axis-name')
            .data(Object.entries(this.props.columndata))
            .enter()
            .append('text')
            .classed('axis-line', true)
            .attr('x', d => xScale(d[1]['loading_on_first_two_PC'][0] * 2.1))
            .attr('y', d => yScale(d[1]['loading_on_first_two_PC'][1] * 2.1))
            .attr('transform', d => this.getTextRotation(d, xScale, yScale))
            .style('font-size', '7')
            .style('text-anchor', 'beginning')
            .style('alignment-baseline', 'middle')
            .style('fill', 'black')
            .text(d => d[0]);
    }

    drawChart() {
        const width = SVG_WIDTH;
        const height = SVG_HEIGHT;

        const div = new Element('div');
        const svg = d3.select(div)
            .append('svg')
            .attr('id', 'chart')
            .attr('viewBox', [0, 0, width, height])
            .style('max-width', '100%')
            .style('height', 'auto')
            .style('height', 'intrinsic');

        const margins = SVG_MARGINS;

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margins.left}, ${margins.top})`);

        const chartWidth = width - (margins.left + margins.right);
        const chartHeight = height - (margins.top + margins.bottom);

        this.plotBiPlot(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default BiPlot;
