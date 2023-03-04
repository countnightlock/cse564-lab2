// ElbowPlot.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

class ElbowPlot extends Component {

    componentDidMount() {
    }

    plotElbowPlot(chart, width, height, margins) {
        const data = this.props.elbowdata;

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d['i'])).nice()
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d['wcss'])).nice()
            .range([height, 0]);

        const yGridLines = d3.axisLeft()
            .scale(yScale)
            .ticks(20)
            .tickSize(-width, 0, 0)
            .tickFormat('');

        chart.append('g')
            .call(yGridLines)
            .classed('gridline', true)
            .attr('stroke-opacity', 0.1);

        chart.append('path')
            .classed('cumulative', true)
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#191414')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                        .x(d => xScale(d['i']))
                        .y(d => yScale(d['wcss'])));

        chart.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d['i']))
            .attr('cy', d => yScale(d['wcss']))
            .attr('r', 4)
            .attr('stroke', '#191414')
            .attr('fill', '#1DB954');

        const xAxis = d3.axisBottom()
            .scale(xScale);

        const yAxis = d3.axisLeft()
            .ticks(15)
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
            .text('# Clusters →');

        chart.append('g')
            .classed('y-axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);

        chart.select('.y-axis')
            .append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .text('↑ WCSS');

        if (data.length !== 0) {
            chart.append('text')
            .attr('x', xScale(data[1]['i']))
            .attr('y', yScale(data[1]['wcss']))
            .attr('dx', -5)
            .attr('dy', 5)
            .attr('fill', 'currentColor')
            .style('font-size', '12px')
            .style('text-anchor', 'end')
            .text('elbow!');
        }
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

        this.plotElbowPlot(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default ElbowPlot;
