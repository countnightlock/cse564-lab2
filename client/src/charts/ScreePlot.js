// ScreePlot.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

class ScreePlot extends Component {

    componentDidMount() {
    }

    plotScreePlot(chart, width, height, margins) {
        const data = this.props.screedata;

        const xScale = d3.scaleBand()
            .domain(data.map(d => d['name']))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0.0, 100.0]).nice()
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

        const bars = chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d['name']))
            .attr('y', d => yScale(d['var_explained']))
            .attr('height', d => (height - yScale(d['var_explained'])))
            .attr('width', xScale.bandwidth())
            .style('stroke', '#191414')
            .style('fill', '#1DB954');

        // TODO: add flair - https://gramener.github.io/d3js-playbook/tooltips.html
        bars.on('click', (event, d) => {
                this.props.diHandler(parseInt(d['name'].slice(2)))
            });

        chart.append('path')
            .classed('cumulative', true)
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#191414')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                        .x(d => xScale(d['name']) + xScale.bandwidth()/2)
                        .y(d => yScale(d['cumulative_var_explained'])));

        chart.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d['name']) + xScale.bandwidth()/2)
            .attr('cy', d => yScale(d['cumulative_var_explained']))
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
            .text('PCs →');

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
            .text('↑ Explained Variance');
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

        this.plotScreePlot(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default ScreePlot;
