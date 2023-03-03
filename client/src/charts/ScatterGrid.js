import { Grid } from "@mui/material";
import { Component } from "react";
import BigTitle from "./BigTitle";
import MiniScatterPlot from "./MiniScatterPlot";

const gridStyles = {
    paddingBottom: 2,
    paddingRight: 2,
    marginTop: 2,
    marginLeft: "auto",
    marginRight: "auto",
};

class ScatterGrid extends Component {

    render() {
        const data = this.props.actualdata;
        const c = this.props.cols;

        if (data.length == 0 || c.length == 0) return (<div/>);

        return(
            <Grid container spacing={1} justifyContent='space-around' sx={gridStyles}>
                <Grid item xs={3}>
                    <BigTitle columnName={c[0]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[1]} dimensionY={c[0]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[2]} dimensionY={c[0]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[3]} dimensionY={c[0]} />
                </Grid>

                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[0]} dimensionY={c[1]} />
                </Grid>
                <Grid item xs={3}>
                    <BigTitle columnName={c[1]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[2]} dimensionY={c[1]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[3]} dimensionY={c[1]} />
                </Grid>

                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[0]} dimensionY={c[2]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[1]} dimensionY={c[2]} />
                </Grid>
                <Grid item xs={3}>
                    <BigTitle columnName={c[2]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[3]} dimensionY={c[2]} />
                </Grid>

                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[0]} dimensionY={c[3]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[1]} dimensionY={c[3]} />
                </Grid>
                <Grid item xs={3}>
                    <MiniScatterPlot data={data} dimensionX={c[2]} dimensionY={c[3]} />
                </Grid>
                <Grid item xs={3}>
                    <BigTitle columnName={c[3]} />
                </Grid>
            </Grid>
        );
    }
}

export default ScatterGrid;