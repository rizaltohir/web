// Utility functions untuk aplikasi
import { VALIDATION, ERROR_MESSAGES } from './constants.js';

// Format tanggal ke format Indonesia
export function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Validasi input
export function validateInput(value, type) {
    switch(type) {
        case 'email':
            const emailRegex = new RegExp(VALIDATION.email.pattern);
            return {
                isValid: emailRegex.test(value) && value.length <= VALIDATION.email.maxLength,
                message: !value ? 'Email wajib diisi' : 
                         !emailRegex.test(value) ? 'Format email tidak valid' :
                         value.length > VALIDATION.email.maxLength ? 'Email terlalu panjang' : ''
            };
        
        case 'password':
            return {
                isValid: value.length >= VALIDATION.password.minLength && 
                        value.length <= VALIDATION.password.maxLength,
                message: !value ? 'Password wajib diisi' :
                         value.length < VALIDATION.password.minLength ? 'Password terlalu pendek' :
                         value.length > VALIDATION.password.maxLength ? 'Password terlalu panjang' : ''
            };
        
        default:
            return { isValid: true, message: '' };
    }
}

// Handle API errors
export function handleApiError(error) {
    if (!error.response) {
        return ERROR_MESSAGES.network;
    }

    switch(error.response.status) {
        case 401:
            return ERROR_MESSAGES.unauthorized;
        case 403:
            return ERROR_MESSAGES.forbidden;
        case 500:
            return ERROR_MESSAGES.server;
        default:
            return error.response.data.message || ERROR_MESSAGES.server;
    }
}

// Format angka ke format Indonesia
export function formatNumber(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

// Fungsi untuk membuat headers dengan token
export function createAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}
