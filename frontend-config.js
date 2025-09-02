// Configuration for Frontend to use PHP API
// Replace the API base URL in your React frontend

// For development (Replit)
const API_BASE_DEV = '/api';

// For production (HostGator cPanel)
const API_BASE_PROD = 'https://seudominio.com.br/api';

// Auto-detect environment
const API_BASE = window.location.hostname.includes('replit') 
  ? API_BASE_DEV 
  : API_BASE_PROD;

// Export for use in your React components
window.API_CONFIG = {
  BASE_URL: API_BASE,
  ENDPOINTS: {
    suppliers: `${API_BASE}/suppliers`,
    rentals: `${API_BASE}/rentals`,
    products: `${API_BASE}/products`,
    categories: `${API_BASE}/categories`,
    dashboard: `${API_BASE}/dashboard/stats`,
    // Backward compatibility
    customers: `${API_BASE}/suppliers`
  }
};

console.log('API Configuration loaded:', window.API_CONFIG);