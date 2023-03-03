// BigTitle.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

class BigTitle extends Component {

    plotBigTitle(chart, width, height, margins) {
        const columnName = this.props.columnName;

        chart.append('text')
            .attr('x', width/2)
            .attr('y', height/2)
            .attr('fill', 'currentColor')
            .style('font-size', '50px')
            .style('text-anchor', 'middle')
            .text(columnName);

        chart.append("circle").attr("cx", 380).attr("cy", 20).attr("r", 6).style("fill", "#ff734a");
        chart.append("circle").attr("cx", 380).attr("cy", 40).attr("r", 6).style("fill", "#5294ac");
        chart.append("text").attr("x", 400).attr("y", 20).text("Cluster 0").style("font-size", "15px").attr("alignment-baseline","middle");
        chart.append("text").attr("x", 400).attr("y", 40).text("Cluster 1").style("font-size", "15px").attr("alignment-baseline","middle");
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

        this.plotBigTitle(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default BigTitle;
