// src/components/QueryInterface.js
import React, { useState, useMemo } from 'react';
import { usePGlite } from '@electric-sql/pglite-react'; 
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ResultsTable from './ResultsTable';

function QueryInterface() {
  const db = usePGlite(); 

  const [sqlInput, setSqlInput] = useState(
    'SELECT * FROM patients;'
  );
  const [inputError, setInputError] = useState('');
  const [results, setResults] = useState([]);         
  const [isLoading, setLoading] = useState(false);    
  const [error, setError] = useState(null);           

  const columns = useMemo(
    () => (results.length > 0 ? Object.keys(results.fields) : []),
    [results]
  );

  const handleSqlInputChange = (e) => {
    setSqlInput(e.target.value);
    setInputError('');
    setError(null); 
  };

  const handleExecute = async () => {
    if (!sqlInput.trim().toLowerCase().startsWith('select')) {
      setInputError('Only non-empty SELECT queries are allowed.');
      return;
    }
    setLoading(true);      
    setError(null);
    try {
      const rows = await db.query(sqlInput);
      setResults(rows);
      console.log(results)
    } catch (err) {
      setError(err.message);                
    } finally {
      setLoading(false);                    
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <Card>
      <CardHeader title="Query Patient Records (SQL)" />
      <CardContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Enter a SQL SELECT query. Example:{' '}
          <code>SELECT * FROM patients;</code> (Press Enter or click button)
        </Typography>

        <TextField
          fullWidth
          label="SQL Query (SELECT only)"
          multiline
          minRows={3}
          maxRows={10}
          value={sqlInput}
          onChange={handleSqlInputChange}
          onKeyDown={handleKeyDown}
          variant="outlined"
          disabled={isLoading}
          error={!!inputError}
          helperText={inputError}
          sx={{
            mb: 2,
            fontFamily: 'monospace',
            '& textarea': { lineHeight: 1.4 },
          }}
          placeholder="SELECT * FROM patients..."
        />

        <Button
          variant="contained"
          onClick={handleExecute}
          disabled={isLoading || !sqlInput.trim()}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading ? 'Running...' : 'Execute Query'}
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Query Results:
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (                           
            <Typography color="error">{error}</Typography> 
            ) : (
            <ResultsTable columns={columns} data={results.rows} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default QueryInterface;
