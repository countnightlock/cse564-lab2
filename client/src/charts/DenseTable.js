import { Component } from "react";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

class DenseTable extends Component {
    render() {
        const data = this.props.columndata;
        const di = this.props.di;
        return (
            <TableContainer>
                <Table sx={{ minWidth: 650 }} size='medium'>
                    <TableHead>
                        <TableRow>
                            <TableCell>column name</TableCell>
                            {
                                [...Array(di).keys()].map(i => (
                                    <TableCell align='right'>{`PC${i+1}`}</TableCell>
                                ))
                            }
                            <TableCell>Sum of Squared Loadings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(data).map(d => (
                            <TableRow key={d[0]}>
                                <TableCell component='th' scope='row'>{d[0]}</TableCell>
                                {
                                    [...Array(di).keys()].map(i => (
                                        <TableCell align='right'>{Number.parseFloat(d[1][`PC${i+1}`]).toFixed(4)}</TableCell>
                                    ))
                                }
                                <TableCell>{Number.parseFloat(d[1]['ssl_di']).toFixed(4)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default DenseTable;