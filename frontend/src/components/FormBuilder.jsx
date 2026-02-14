import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
} from '@mui/material';
import { Delete, ContentCopy, Add } from '@mui/icons-material';
import { createForm, getReusableFields } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Simple UUID generator - no package needed
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const FIELD_TYPES = [
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'long_answer', label: 'Long Answer' },
  { value: 'number', label: 'Number' },
  { value: 'yes/no', label: 'Yes/No' },
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'date', label: 'Date' },
];

const FormBuilder = () => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [reusableFields, setReusableFields] = useState([]);
  const [openReusableDialog, setOpenReusableDialog] = useState(false);

  useEffect(() => {
    fetchReusableFields();
  }, []);

  const fetchReusableFields = async () => {
    try {
      const response = await getReusableFields();
      setReusableFields(response.data);
    } catch (error) {
      console.error('Error fetching reusable fields:', error);
    }
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        id: uuidv4(),
        question: '',
        type: 'short_answer',
        required: false,
        options: [],
      },
    ]);
  };

  const addReusableField = (reusableField) => {
    setFields([...fields, { ...reusableField, id: uuidv4() }]);
    setOpenReusableDialog(false);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    
    // If changing to choice type, initialize options
    if (key === 'type' && (value === 'single_choice' || value === 'multiple_choice')) {
      if (!newFields[index].options || newFields[index].options.length === 0) {
        newFields[index].options = ['Option 1'];
      }
    }
    
    setFields(newFields);
  };

  const deleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const duplicateField = (index) => {
    const newField = { ...fields[index], id: uuidv4() };
    setFields([...fields.slice(0, index + 1), newField, ...fields.slice(index + 1)]);
  };

  const addOption = (fieldIndex) => {
    const newFields = [...fields];
    if (!newFields[fieldIndex].options) {
      newFields[fieldIndex].options = [];
    }
    newFields[fieldIndex].options.push(`Option ${newFields[fieldIndex].options.length + 1}`);
    setFields(newFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    setFields(newFields);
  };

  const deleteOption = (fieldIndex, optionIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setFields(newFields);
  };

  const handleSubmit = async () => {
    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    try {
      const formData = {
        title: formTitle,
        description: formDescription,
        fields: fields,
      };

      const response = await createForm(formData);
      alert('Form created successfully!');
      navigate('/admin/forms');
    } catch (error) {
      console.error('Error creating form:', error);
      alert('Error creating form');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Form Title"
          sx={{ mb: 2 }}
          InputProps={{
            style: { fontSize: '2rem', fontWeight: 400 },
          }}
        />
        <TextField
          fullWidth
          variant="outlined"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Form Description"
          multiline
          rows={2}
        />
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Questions
        </Typography>

        {fields.map((field, index) => (
          <Paper key={field.id} elevation={1} sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Question"
                value={field.question}
                onChange={(e) => updateField(index, 'question', e.target.value)}
                placeholder="Enter your question here"
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={field.type}
                  label="Type"
                  onChange={(e) => updateField(index, 'type', e.target.value)}
                >
                  {FIELD_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {(field.type === 'single_choice' || field.type === 'multiple_choice') && (
              <Box sx={{ ml: 2, mb: 2 }}>
                {field.options?.map((option, optionIndex) => (
                  <Box key={optionIndex} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => deleteOption(index, optionIndex)}
                      disabled={field.options.length <= 1}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => addOption(index)}
                  sx={{ mt: 1 }}
                >
                  Add Option
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.required}
                    onChange={(e) => updateField(index, 'required', e.target.checked)}
                  />
                }
                label="Required"
              />
              <Box>
                <IconButton onClick={() => duplicateField(index)} size="small">
                  <ContentCopy fontSize="small" />
                </IconButton>
                <IconButton onClick={() => deleteField(index)} size="small" color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addField}
            fullWidth
          >
            Add Question
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenReusableDialog(true)}
            fullWidth
          >
            Choose from existing
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/admin/forms')}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Form
        </Button>
      </Box>

      {/* Reusable Fields Dialog */}
      <Dialog open={openReusableDialog} onClose={() => setOpenReusableDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Choose from existing questions</DialogTitle>
        <DialogContent>
          <List>
            {reusableFields.map((field) => (
              <ListItem key={field.id} disablePadding>
                <ListItemButton onClick={() => addReusableField(field)}>
                  <ListItemText
                    primary={field.question}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip label={FIELD_TYPES.find(t => t.value === field.type)?.label || field.type} size="small" />
                        {field.required && <Chip label="Required" size="small" color="primary" />}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReusableDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FormBuilder;