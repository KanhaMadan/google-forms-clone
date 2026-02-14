import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Form APIs
export const createForm = (formData) => api.post('/forms', formData);
export const getAllForms = () => api.get('/forms');
export const getForm = (formId) => api.get(`/forms/${formId}`);
export const updateForm = (formId, formData) => api.put(`/forms/${formId}`, formData);
export const deleteForm = (formId) => api.delete(`/forms/${formId}`);

// Response APIs
export const submitResponse = (responseData) => api.post('/responses', responseData);
export const getFormResponses = (formId) => api.get(`/forms/${formId}/responses`);

// Reusable Fields APIs
export const getReusableFields = () => api.get('/reusable-fields');
export const createReusableField = (fieldData) => api.post('/reusable-fields', fieldData);

export default api;