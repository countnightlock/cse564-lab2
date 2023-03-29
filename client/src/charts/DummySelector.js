// DummySelector.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';
import { dimensionsConfig } from '../utils/dimensions';

class DummySelector extends Component {

    componentDidMount() {
    }

    plotDummySelector(chart, width, height, margins) {
        const corrColumns = this.props.corrColumns;
        const mdsvars = this.props.mdsvars;
        const dimensions = [];

        for (let col of mdsvars) {
            dimensions.push({
                name: col.name,
                x: col.x,
                y: col.y,
                selected: corrColumns.includes(col.name)
            });
        }

        const xScale = d3.scaleLinear()
            .domain(d3.extent(dimensions, d => d.x)).nice()
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(dimensions, d => d.y)).nice()
            .range([height, 0]);

        chart.append('g')
            .selectAll('.dotvars')
            .data(dimensions)
            .enter()
            .append('circle')
            .classed('dotvars', true)
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 5)
            .attr('opacity', 0.6)
            .style('fill', d => d.selected ? '#ff734a' : '#5294ac');

        chart.append('g')
            .selectAll('.varname')
            .data(dimensions)
            .enter()
            .append('text')
            .attr('x', d => xScale(d.x) + 5)
            .attr('y', d => yScale(d.y) + 5)
            .attr('fill', 'black')
            .style('font-size', '8px')
            .text(d => d.name)

        chart.selectAll('.dotvars')
            .on('click', (event, d) => {
                this.props.pcpHandler(d.name);
            });

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(4);

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(4);

        chart.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('font-size', '8px')
            .style('text-anchor', 'middle');

        chart.append('g')
            .classed('y-axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis)
            .selectAll('text')
            .style('font-size', '8px');

        chart.select('.x-axis')
            .append('text')
            .attr('x', width)
            .attr('y', 27)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'end')
            .text('x →');

        chart.select('.y-axis')
            .append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .text('↑ y');

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

        this.plotDummySelector(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default DummySelector;
