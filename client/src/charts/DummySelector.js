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
        const allColumns = this.props.allColumns;

        const dimensions = [];

        for (let col of allColumns) {
            if (dimensionsConfig.get(col).get('type') !== 'numerical') continue;
            dimensions.push({
                name: col,
                x: d3.randomInt(0, width)(),
                y: d3.randomInt(0, height)(),
                selected: corrColumns.includes(col)
            });
        }

        chart.append('g')
            .selectAll('.dot')
            .data(dimensions)
            .enter()
            .append('circle')
            .classed('dot', true)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 5)
            .attr('opacity', d => d.selected ? 0.1 : 0.6)
            .style('fill', d => d.selected ? '#ff734a' : '#5294ac')
            .append('text')
            .attr('x', d => d.x + 5)
            .attr('y', d => d.y + 5)
            .attr('fill', 'currentColor')
            .text(d => d.name);

        chart.selectAll('.dot')
            .on('click', (event, d) => {
                this.props.pcpHandler(d.name);
            })

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
