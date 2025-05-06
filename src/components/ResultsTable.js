// src/components/ResultsTable.js - Identical to previous versions
import React from 'react';
import Table from '@mui/material/Table'; /* ... imports */
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function ResultsTable({ columns, data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <Typography sx={{ mt: 2, fontStyle: 'italic', textAlign: 'center' }}>No results to display.</Typography>;
  }
  const displayColumns = columns && columns.length > 0 ? columns : (data.length > 0 ? Object.keys(data[0]) : []);

  return (
    <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 440, border: 'none', boxShadow: 'none' }}>
      <Table stickyHeader aria-label="query results table" size="small">
        <TableHead><TableRow>{displayColumns.map((colName) => (<TableCell key={colName}>{colName}</TableCell>))}</TableRow></TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {displayColumns.map((colName) => (
                <TableCell key={`${rowIndex}-${colName}`}>
                  {row[colName] === null ? <Box component="em" sx={{color: 'text.disabled'}}>NULL</Box> : typeof row[colName] === 'boolean' ? (row[colName] ? 'True' : 'False') : String(row[colName])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default ResultsTable;