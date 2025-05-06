// src/components/PatientForm.js
import React, { useState, useEffect } from 'react';
import { usePGlite } from '@electric-sql/pglite-react'; // Import the hook
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';


// Helper for safe query execution (can be moved to a utils file)
const safeExecute = async (db, sql, params = []) => {
  try {
    if (!db || typeof db.query !== 'function') {
      throw new Error('Database connection is not valid.');
    }
    const results = await db.query(sql, params);
    return { data: results, error: null };
  } catch (err) {
    console.error("SQL Execution Error:", err.message);
    const errorMessage = err instanceof Error ? err.message : 'An unknown SQL error occurred.';
    return { data: null, error: errorMessage };
  }
};


function PatientForm() {
  // Local state for form data and UI feedback
  const [formData, setFormData] = useState({ name: '', dob: '', gender: '', contact: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get the initialized db instance from the hook
  const db = usePGlite();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    console.log(formData)
    event.preventDefault();
    if (!db) { // Check if db instance is ready
        setError('Database is not ready yet.');
        return;
    }
    if (!formData.name) {
      setError('Patient name is required.');
      return;
    }
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const sql = `
      INSERT INTO patients (name, dob, gender, contact)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const params = [
      formData.name, formData.dob || null, formData.gender || null, formData.contact || null,
    ];

    console.log("calling db insertion")

    // Use the db instance from the hook
    const result = await safeExecute(db, sql, params);
    console.log(result.data)
    setIsSubmitting(false);
    if (result.error) {
      setError(`Failed to register patient: ${result.error}`);
    } else {
      console.log(result.data[0]);
      const registeredPatient = result.data.rows[0];
      setSuccess(`Patient "${registeredPatient.name}" registered (ID: ${registeredPatient.id})!`);
      setFormData({ name: '', dob: '', gender: '', contact: '' }); // Clear form
    }
  };

  return (
    <Card>
      <CardHeader title="Register New Patient" />
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Disable form if db is not ready or submitting */}
            <Grid item xs={12}><TextField required fullWidth id="name" label="Patient Name" name="name" value={formData.name} onChange={handleChange} disabled={!db || isSubmitting} autoComplete='off'/></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth id="dob" label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} disabled={!db || isSubmitting}/></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth id="gender" label="Gender" name="gender" value={formData.gender} onChange={handleChange} disabled={!db || isSubmitting} autoComplete='off'/></Grid>
            <Grid item xs={12}><TextField fullWidth id="contact" label="Contact Information" name="contact" value={formData.contact} onChange={handleChange} multiline rows={2} disabled={!db || isSubmitting} autoComplete='off'/></Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!db || isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}>
            {isSubmitting ? 'Registering...' : 'Register Patient'}
          </Button>
           {!db && <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>Waiting for database...</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
}
export default PatientForm;