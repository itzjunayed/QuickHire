const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...options,
  });
  const data = await res.json();
  if (!data.success && !res.ok) {
    const error = new Error(data.message || 'API error');
    error.data = data;
    error.fieldErrors = {};
    
    // Parse field-level validation errors
    if (data.errors && Array.isArray(data.errors)) {
      data.errors.forEach(err => {
        if (err.path) {
          error.fieldErrors[err.path] = err.msg;
        }
      });
    }
    throw error;
  }
  return data;
}

// Auth functions
export async function signup(userData) {
  return fetchAPI('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function login(credentials) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Job functions
export async function getJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/jobs${query ? `?${query}` : ''}`);
}

export async function getJob(id) {
  return fetchAPI(`/jobs/${id}`);
}

export async function createJob(jobData) {
  return fetchAPI('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
}

export async function deleteJob(id) {
  return fetchAPI(`/jobs/${id}`, { method: 'DELETE' });
}

export async function getCompanies() {
  return fetchAPI('/jobs/companies/list');
}

// Application functions
export async function submitApplication(applicationData) {
  return fetchAPI('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
}

export async function getApplications() {
  return fetchAPI('/applications');
}

export const CATEGORIES = [
  { name: 'Design', icon: '🎨', color: 'bg-blue-50 text-blue-600' },
  { name: 'Sales', icon: '📊', color: 'bg-orange-50 text-orange-600' },
  { name: 'Marketing', icon: '📣', color: 'bg-purple-50 text-purple-600' },
  { name: 'Finance', icon: '💰', color: 'bg-green-50 text-green-600' },
  { name: 'Technology', icon: '💻', color: 'bg-cyan-50 text-cyan-600' },
  { name: 'Engineering', icon: '⚙️', color: 'bg-red-50 text-red-600' },
  { name: 'Business', icon: '🏢', color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Human Resources', icon: '👥', color: 'bg-pink-50 text-pink-600' },
];

export const TAG_COLORS = {
  Marketing: 'tag-marketing',
  Design: 'tag-design',
  Technology: 'tag-technology',
  Business: 'tag-business',
  Sales: 'tag-sales',
  Finance: 'tag-finance',
  Engineering: 'tag-engineering',
  'Human Resources': 'tag-hr',
};

export const COMPANY_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-green-600',
  'bg-orange-600', 'bg-red-600', 'bg-cyan-600', 'bg-indigo-600',
];

export function getCompanyColor(company) {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length];
}

export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}
