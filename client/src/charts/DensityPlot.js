// DensityPlot.js
import * as d3 from 'd3';
import { Component } from 'react';
import { Element } from 'react-faux-dom';

import { SVG_HEIGHT, SVG_MARGINS, SVG_WIDTH } from '../utils/config';
import { dimensionsConfig } from '../utils/dimensions';

class DensityPlot extends Component {

    componentDidMount() {

    }

    kernelDensityEstimator(kernel, X) {
        return function(V) {
            return X.map(function(x) {
                return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
        };
    }
    kernelEpanechnikov(k) {
        return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }

    plotDensityPlot(chart, width, height, margins) {
        const data = this.props.alldata;
        const dimensions = this.props.columns;
        const labels = this.props.labels;

        // Get the different categories and count them
        const categories = this.props.columns;
        const n = categories.length;

        // Compute the mean of each group
        const allMeans = [];
        for (let i in categories){
            let currentGroup = categories[i];
            let mean = d3.mean(data, d => d[currentGroup]);
            allMeans.push(mean);
        }

        // Create a color scale using these means.
        const myColor = d3.scaleSequential()
            .domain([0,100])
            .interpolator(d3.interpolateViridis);

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([ 0, width ]);
        
        chart.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(10).tickSize(-height) )
            .select(".domain")
            .remove();

        // Add X axis label:
        chart.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 40)
            .text("Probability (%)");

        // Create a Y scale for densities
        const y = d3.scaleLinear()
            .domain([0.09, 0.15])
            .range([ height, 0]);

        // Create the Y axis for names
        const yName = d3.scaleBand()
            .domain(categories)
            .range([0, height])
            .paddingInner(1);
        
        chart.append("g")
            .call(d3.axisLeft(yName).tickSize(0))
            .select(".domain")
            .remove();

        // Compute kernel density estimation for each column:
        const kde = this.kernelDensityEstimator(this.kernelEpanechnikov(7), x.ticks(40)); // increase this 40 for more accurate density.
        const allDensity = [];
        for (let i = 0; i < n; i++) {
            let key = categories[i];
            let density = kde(data.map(d => d[key]*100));
            console.log(density);
            allDensity.push({key: key, density: density});
        }

        // Add areas
        chart.selectAll("areas")
            .data(allDensity)
            .join("path")
            .attr("transform", d => `translate(0, ${(yName(d.key)-height)})`)
            .attr("fill", d => {
                let grp = d.key;
                let index = categories.indexOf(grp);
                let value = allMeans[index];
                return myColor(value);
            })
            .datum(d => d.density)
            .attr("opacity", 0.7)
            .attr("stroke", "#000")
            .attr("stroke-width", 0.1)
            .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(d => x(d[0]))
                .y(d => y(d[1]))
            );


        // // Set up y scales
        // const yScales = {};

        // for (let dim of dimensions) {
        //     if (dimensionsConfig.get(dim).get('type') === 'numerical') {
        //         yScales[dim] = d3.scaleLinear()
        //             .domain(d3.extent(data, d => d[dim])).nice()
        //             .range([height, 0]);
        //     } else {
        //         yScales[dim] = d3.scaleBand()
        //             .domain(data
        //                 .sort((a, b) => +a[dim] - +b[dim])
        //                 .map(d => d[dim]))
        //             .range([height, 0]);
        //     }
        // }

        // const xScale = d3.scalePoint()
        //     .domain(dimensions)
        //     .range([0, width]);

        // const path = (d) => d3.line()(
        //     dimensions.map((dim) => [
        //         xScale(dim),
        //         yScales[dim](d[dim]) + (dimensionsConfig.get(dim).get('type') === 'numerical' ? 0 : yScales[dim].bandwidth()/2)
        //     ])
        // );

        // chart.selectAll('paths')
        //     .data(data)
        //     .join('path')
        //     .attr('d', path)
        //     .style('fill', 'none')
        //     .attr('stroke-width', '0.5')
        //     .style('stroke', (d, i) => labels[i] === 0 ? '#ff734a' : '#5294ac')
        //     .style('opacity', 0.5);


        // for (let dim of dimensions) {
        //     const vertAxis = d3.axisLeft()
        //         .ticks(5)
        //         .scale(yScales[dim])
        //         .tickFormat((dv, i) => dimensionsConfig.get(dim).get('formatter') ? dimensionsConfig.get(dim).get('formatter')(dv) : dv);
        //     chart.append('g')
        //         .attr('class', `axes-${dim}`)
        //         .attr('transform', `translate(${xScale(dim)})`)
        //         .call(vertAxis)
        //         .append('text')
        //         .text(dim)
        //         .attr('transform', 'translate(0, -1) rotate(-45)')
        //         .style('font-size', '6px')
        //         .style('text-anchor', 'start')
        //         .style('fill', 'black');

        //     chart.selectAll(`.tick text`)
        //         .style('font-size', '6px');

        // }

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

        this.plotDensityPlot(chart, chartWidth, chartHeight, margins);

        return div.toReact();
    }

    render() {
        return this.drawChart();
    }
}

export default DensityPlot;



