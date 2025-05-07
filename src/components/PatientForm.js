import React, { useState } from 'react';
import { usePGlite } from '@electric-sql/pglite-react';
import {
  Box, TextField, Button, Card, CardContent, CardHeader,
  Grid, CircularProgress, Alert, Typography, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

// Utility for safe DB calls
const safeExecute = async (db, sql, params = []) => {
  try {
    if (!db || typeof db.query !== 'function') throw new Error('Database connection is not valid.');
    const results = await db.query(sql, params);
    return { data: results, error: null };
  } catch (err) {
    console.error("SQL Execution Error:", err.message);
    return { data: null, error: err.message || 'Unknown SQL error' };
  }
};

function PatientForm() {
  const [formData, setFormData] = useState({ name: '', dob: '', gender: '', contact: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const db = usePGlite();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!db) return setError('Database is not ready yet.');
    if (!formData.name || !formData.dob || !formData.gender || !formData.contact) {
        setError('All fields are required.');
        return;
      }
    if (!/^\d{10}$/.test(formData.contact)) return setError('Contact must be a 10-digit number.');

    setIsSubmitting(true);
    const sql = `
      INSERT INTO patients (name, dob, gender, contact)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const params = [
      formData.name, formData.dob || null, formData.gender || null, formData.contact || null,
    ];

    const result = await safeExecute(db, sql, params);
    setIsSubmitting(false);
    if (result.error) {
      setError(`Failed to register patient: ${result.error}`);
    } else {
      const registeredPatient = result.data.rows[0];
      setSuccess(`Patient "${registeredPatient.name}" registered (ID: ${registeredPatient.id})!`);
      setFormData({ name: '', dob: '', gender: '', contact: '' }); // reset form
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
            <Grid item xs={12}>
              <TextField required fullWidth id="name" label="Patient Name" name="name"
                value={formData.name} onChange={handleChange}
                disabled={!db || isSubmitting} autoComplete='off' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="dob" label="Date of Birth" name="dob" type="date"
                value={formData.dob} onChange={handleChange}
                InputLabelProps={{ shrink: true }} disabled={!db || isSubmitting} />
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    {/* <InputLabel id="gender-label">Gender</InputLabel> */}
                    <Select
                    fullWidth
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleChange}
                    disabled={!db || isSubmitting}
                    displayEmpty
                    >
                    <MenuItem value=""><em>Select Gender</em></MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField required fullWidth id="contact" label="Contact Information" name="contact"
                value={formData.contact} onChange={handleChange}
                disabled={!db || isSubmitting} autoComplete='off'
                inputProps={{ maxLength: 10 }}
                helperText="Enter a 10-digit phone number" />
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}
            disabled={!db || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Registering...' : 'Register Patient'}
          </Button>

          {!db && <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
            Waiting for database...
          </Typography>}
        </Box>
      </CardContent>
    </Card>
  );
}

export default PatientForm;
