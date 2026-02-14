import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, ContentCopy, Visibility, Delete } from '@mui/icons-material';
import { getAllForms, deleteForm } from '../services/api';
import { useNavigate } from 'react-router-dom';

const FormList = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await getAllForms();
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(formId);
        fetchForms();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  const copyFormLink = (formId) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    alert('Form link copied to clipboard!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/create')}
        >
          Create Form
        </Button>
      </Box>

      {forms.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No forms yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first form to get started
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/admin/create')}>
            Create Form
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {forms.map((form) => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {form.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {form.description || 'No description'}
                  </Typography>
                  <Chip label={`${form.fields?.length || 0} questions`} size="small" />
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/responses/${form.id}`)}
                      title="View Responses"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => copyFormLink(form.id)}
                      title="Copy Link"
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(form.id)}
                      title="Delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => window.open(`/form/${form.id}`, '_blank')}
                  >
                    Preview
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FormList;