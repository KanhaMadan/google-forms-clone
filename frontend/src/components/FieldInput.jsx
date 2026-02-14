import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const FieldInput = ({ field, value, onChange, error }) => {
  const handleChange = (e) => {
    onChange(field.id, e.target.value);
  };

  const handleMultipleChoiceChange = (option) => {
    const currentValues = value || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter((v) => v !== option)
      : [...currentValues, option];
    onChange(field.id, newValues);
  };

  switch (field.type) {
    case 'short_answer':
      return (
        <TextField
          fullWidth
          label={field.question}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          error={error}
          helperText={error ? 'This field is required' : ''}
          variant="outlined"
        />
      );

    case 'long_answer':
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={field.question}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          error={error}
          helperText={error ? 'This field is required' : ''}
          variant="outlined"
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          type="number"
          label={field.question}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          error={error}
          helperText={error ? 'This field is required' : ''}
          variant="outlined"
        />
      );

    case 'yes/no':
      return (
        <FormControl component="fieldset" error={error} required={field.required}>
          <FormLabel component="legend">{field.question}</FormLabel>
          <RadioGroup value={value || ''} onChange={handleChange}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
          {error && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>This field is required</Box>}
        </FormControl>
      );

    case 'single_choice':
      return (
        <FormControl component="fieldset" error={error} required={field.required} fullWidth>
          <FormLabel component="legend">{field.question}</FormLabel>
          <RadioGroup value={value || ''} onChange={handleChange}>
            {field.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          {error && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>This field is required</Box>}
        </FormControl>
      );

    case 'multiple_choice':
      return (
        <FormControl component="fieldset" error={error} required={field.required} fullWidth>
          <FormLabel component="legend">{field.question}</FormLabel>
          <FormGroup>
            {field.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={(value || []).includes(option)}
                    onChange={() => handleMultipleChoiceChange(option)}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
          {error && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>This field is required</Box>}
        </FormControl>
      );

    case 'date':
      return (
        <TextField
          fullWidth
          type="date"
          label={field.question}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          error={error}
          helperText={error ? 'This field is required' : ''}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
      );

    default:
      return (
        <TextField
          fullWidth
          label={field.question}
          value={value || ''}
          onChange={handleChange}
          required={field.required}
          error={error}
          helperText={error ? 'This field is required' : ''}
          variant="outlined"
        />
      );
  }
};

export default FieldInput;