// Konstanta untuk pesan error
const ERROR_MESSAGES = {
    required: 'Bidang ini wajib diisi',
    email: 'Masukkan alamat email yang valid',
    password: 'Password harus memiliki minimal 8 karakter',
    network: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
    server: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    unauthorized: 'Email atau password salah',
    forbidden: 'Anda tidak memiliki akses ke halaman ini'
};

// Konstanta untuk validasi
const VALIDATION = {
    email: {
        pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
        maxLength: 100
    },
    password: {
        minLength: 8,
        maxLength: 100
    },
    projectTitle: {
        minLength: 5,
        maxLength: 100
    }
};

// Konstanta untuk responsive breakpoints
const BREAKPOINTS = {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    wide: '1200px'
};

export { ERROR_MESSAGES, VALIDATION, BREAKPOINTS };
