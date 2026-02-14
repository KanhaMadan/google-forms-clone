import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getForm, submitResponse } from '../services/api';
import FieldInput from '../components/FieldInput';

const FormFill = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await getForm(formId);
      setForm(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form:', error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (fieldId, value) => {
    setAnswers({ ...answers, [fieldId]: value });
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: false });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    form.fields.forEach((field) => {
      if (field.required && !answers[field.id]) {
        newErrors[field.id] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await submitResponse({
        form_id: formId,
        answers: answers,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Error submitting form');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!form) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">Form not found</Alert>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom color="success.main">
            ✓ Response Submitted
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you for your response!
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, mb: 3, borderTop: '10px solid #673ab7' }}>
        <Typography variant="h4" gutterBottom>
          {form.title}
        </Typography>
        {form.description && (
          <Typography variant="body1" color="text.secondary">
            {form.description}
          </Typography>
        )}
      </Paper>

      {form.fields.map((field, index) => (
        <Paper key={field.id} elevation={1} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {field.question}
              {field.required && (
                <Typography component="span" color="error.main">
                  {' '}*
                </Typography>
              )}
            </Typography>
          </Box>
          <FieldInput
            field={field}
            value={answers[field.id]}
            onChange={handleAnswerChange}
            error={errors[field.id]}
          />
        </Paper>
      ))}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={handleSubmit} size="large">
          Submit
        </Button>
        <Button variant="outlined" onClick={() => setAnswers({})} size="large">
          Clear Form
        </Button>
      </Box>
    </Container>
  );
};

export default FormFill;