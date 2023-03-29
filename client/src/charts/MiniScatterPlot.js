// MiniScatterPlot.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';
import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

import { dimensionsConfig } from '../utils/dimensions';

class MiniScatterPlot extends Component {

    plotMiniScatterPlot(chart, width, height, margins) {
        const dimensionX = this.props.dimensionX;
        const dimensionY = this.props.dimensionY;
        const data = this.props.data;
        const labels = this.props.labels;

        let xScale, yScale;

        const xIsCategorical = false;
        const yIsCategorical = false;

        if (xIsCategorical) {
            xScale = d3.scaleBand()
                .domain(data
                    .sort((a, b) => +a[dimensionX] - +b[dimensionX])
                    .map(d => d[dimensionX])
                )
                .range([0, width]);
        } else {
            xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d[dimensionX])).nice()
                .range([0, width]);
        }

        if (yIsCategorical) {
            yScale = d3.scaleBand()
                .domain(data
                    .sort((a, b) => +a[dimensionY] - +b[dimensionY])
                    .map(d => d[dimensionY]))
                .range([height, 0]);
        } else {
            yScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d[dimensionY])).nice()
                .range([height, 0]);
        }

        chart.append('g')
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr('cx', d => xScale(d[dimensionX]) + (xIsCategorical ? xScale.bandwidth()/2 : 0))
            .attr('cy', d => yScale(d[dimensionY]) + (yIsCategorical ? yScale.bandwidth()/2 : 0))
            .attr('r', 5)
            .attr('opacity', xIsCategorical || yIsCategorical ? 0.2 : 0.6)
            .style('fill', (d, i) => labels[i] === 0 ? '#ff734a' : '#5294ac');

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
            .classed('svg-container', true)
            .append('svg')
            .classed("svg-content-responsive", true)
            .attr('id', 'chart')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr('viewBox', [0, 0, width, height]);

        const margins = SVG_MARGINS;

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margins.left}, ${margins.top})`);

        const chartWidth = width - (margins.left + margins.right);
        const chartHeight = height - (margins.top + margins.bottom);

        this.plotMiniScatterPlot(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default MiniScatterPlot;
