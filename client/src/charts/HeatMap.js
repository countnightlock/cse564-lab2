// HeatMap.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';

class HeatMap extends Component {

    componentDidMount() {
    }

    plotHeatMap(chart, width, height, margins) {
        const data = this.props.alldata;

        const heat = Array(100).fill(0);

        for (let d of data) {
            const rp = +d['artist_popularity'];
            const lp = +d['album_popularity'];
            const i = 10 * Math.floor(rp / 10) + Math.floor(lp / 10);
            heat[i] = heat[i] + Math.floor(Math.random()*10);
        }

        // Labels of row and columns
        const myGroups = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const myVars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        // Build X scales and axis:
        const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(myGroups)
            .padding(0.01);
        chart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(
                (dv, i) => dv.toString()
            ))

        // Build X scales and axis:
        var y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(myVars)
            .padding(0.01);
        chart.append("g")
            .call(d3.axisLeft(y).tickFormat(
                (dv, i) => dv.toString()
            ));

        // Build color scale
        var myColor = d3.scalePow()
            .exponent(0.5)
            .range(["white", "#5294ac"])
            .domain([0, d3.max(heat)]);

        var defs = chart.append("defs");

        var gradient = defs.append("linearGradient")
            .attr("id", "svgGradient")
            .attr("x1", "100%")
            .attr("x2", "100%")
            .attr("y1", "100%")
            .attr("y2", "0%");
        
        gradient.append("stop")
            .attr("class", "start")
            .attr("offset", "0%")
            .attr("stop-color", "red")
            .attr("stop-opacity", 1);
            
        gradient.append("stop")
            .attr("class", "end")
            .attr("offset", "100%")
            .attr("stop-color", "blue")
            .attr("stop-opacity", 1);

        //Read the data
        chart.selectAll()
            .data(heat)
            .enter()
            .append("rect")
            .attr("x", (d, i) => x(Math.floor(i / 10)))
            .attr("y", (d, i) => y(Math.floor(i % 10)))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", "url(#svgGradient)")
            // .style("fill", function(d) { return myColor(d)} )
        
        chart.selectAll()
            .data(heat)
            .enter()
            .append('text')
            .attr('x', (d, i) => x(Math.floor(i / 10)))
            .attr('dx', x.bandwidth()/2)
            .attr('y', (d, i) => y(Math.floor(i % 10)))
            .attr('dy', y.bandwidth()/2)
            .attr('fill', 'currentColor')
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .text((d, i) => heat[i]);

        // const bars = chart.selectAll('.bar')
        //     .data(data)
        //     .enter()
        //     .append('rect')
        //     .classed('bar', true)
        //     .attr('x', d => xScale(d['name']))
        //     .attr('y', d => yScale(d['var_explained']))
        //     .attr('height', d => (height - yScale(d['var_explained'])))
        //     .attr('width', xScale.bandwidth())
        //     .style('stroke', '#191414')
        //     .style('fill', (d, i) => i >= this.props.di ? '#1DB954' : '#528491');

        // // TODO: add flair - https://gramener.github.io/d3js-playbook/tooltips.html
        // bars.on('click', (event, d) => {
        //         this.props.diHandler(parseInt(d['name'].slice(2)))
        //     });

        // chart.append('path')
        //     .classed('cumulative', true)
        //     .datum(data)
        //     .attr('fill', 'none')
        //     .attr('stroke', '#191414')
        //     .attr('stroke-width', 1.5)
        //     .attr('d', d3.line()
        //                 .x(d => xScale(d['name']) + xScale.bandwidth()/2)
        //                 .y(d => yScale(d['cumulative_var_explained'])));

        // chart.append('g')
        //     .selectAll('dot')
        //     .data(data)
        //     .enter()
        //     .append('circle')
        //     .attr('cx', d => xScale(d['name']) + xScale.bandwidth()/2)
        //     .attr('cy', d => yScale(d['cumulative_var_explained']))
        //     .attr('r', 4)
        //     .attr('stroke', '#191414')
        //     .attr('fill', '#1DB954');

        // const xAxis = d3.axisBottom()
        //     .scale(xScale);

        // const yAxis = d3.axisLeft()
        //     .ticks(15)
        //     .scale(yScale);

        // chart.append('g')
        //     .classed('x-axis', true)
        //     .attr('transform', `translate(0, ${height})`)
        //     .call(xAxis)
        //     .selectAll('text');

        // chart.select('.x-axis')
        //     .append('text')
        //     .attr('x', width)
        //     .attr('y', 27)
        //     .attr('fill', 'currentColor')
        //     .style('font-size', '10px')
        //     .style('text-anchor', 'end')
        //     .text('PCs →');

        // chart.append('g')
        //     .classed('y-axis', true)
        //     .attr('transform', 'translate(0,0)')
        //     .call(yAxis);

        // chart.select('.y-axis')
        //     .append('text')
        //     .attr('x', 0)
        //     .attr('y', -10)
        //     .attr('fill', 'currentColor')
        //     .style('font-size', '10px')
        //     .style('text-anchor', 'middle')
        //     .text('↑ %age Explained Variance');
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

        this.plotHeatMap(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default HeatMap;
