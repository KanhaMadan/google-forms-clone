import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm, getFormResponses } from '../services/api';
import { ArrowBack } from '@mui/icons-material';

const ResponsesView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        getForm(formId),
        getFormResponses(formId),
      ]);
      setForm(formRes.data);
      setResponses(responsesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer || '-';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!form) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography variant="h6">Form not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/forms')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" gutterBottom>
            {form.title}
          </Typography>
          <Chip label={`${responses.length} responses`} color="primary" />
        </Box>
      </Box>

      {responses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No responses yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Share your form to start collecting responses
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                {form.fields.map((field) => (
                  <TableCell key={field.id} sx={{ fontWeight: 'bold' }}>
                    {field.question}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id} hover>
                  <TableCell>
                    {new Date(response.submitted_at).toLocaleString()}
                  </TableCell>
                  {form.fields.map((field) => (
                    <TableCell key={field.id}>
                      {formatAnswer(response.answers[field.id])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ResponsesView;