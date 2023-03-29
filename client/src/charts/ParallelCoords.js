// ParallelCoords.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';
import { dimensionsConfig } from '../utils/dimensions';

class ParallelCoords extends Component {

    componentDidMount() {
    }

    plotParallelCoords(chart, width, height, margins) {
        const data = this.props.alldata;
        const dimensions = this.props.columns;
        const labels = this.props.labels;

        // Set up y scales
        const yScales = {};

        for (let dim of dimensions) {
            if (dimensionsConfig.get(dim).get('type') === 'numerical') {
                yScales[dim] = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[dim])).nice()
                    .range([height, 0]);
            } else {
                yScales[dim] = d3.scaleBand()
                    .domain(data
                        .sort((a, b) => +a[dim] - +b[dim])
                        .map(d => d[dim]))
                    .range([height, 0]);
            }
        }

        const xScale = d3.scalePoint()
            .domain(dimensions)
            .range([0, width]);

        const path = (d) => d3.line()(
            dimensions.map((dim) => [
                xScale(dim),
                yScales[dim](d[dim]) + (dimensionsConfig.get(dim).get('type') === 'numerical' ? 0 : yScales[dim].bandwidth()/2)
            ])
        );

        chart.selectAll('paths')
            .data(data)
            .join('path')
            .attr('d', path)
            .style('fill', 'none')
            .attr('stroke-width', '0.5')
            .style('stroke', (d, i) => labels[i] === 0 ? '#ff734a' : '#5294ac')
            .style('opacity', 0.5);


        for (let dim of dimensions) {
            const vertAxis = d3.axisLeft()
                .ticks(5)
                .scale(yScales[dim])
                .tickFormat((dv, i) => dimensionsConfig.get(dim).get('formatter') ? dimensionsConfig.get(dim).get('formatter')(dv) : dv);
            chart.append('g')
                .attr('class', `axes-${dim}`)
                .attr('transform', `translate(${xScale(dim)})`)
                .call(vertAxis)
                .append('text')
                .text(dim)
                .attr('transform', 'translate(0, -1) rotate(-45)')
                .style('font-size', '6px')
                .style('text-anchor', 'start')
                .style('fill', 'black');

            chart.selectAll(`.tick text`)
                .style('font-size', '6px');

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

        this.plotParallelCoords(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default ParallelCoords;
