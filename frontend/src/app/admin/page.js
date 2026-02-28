'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { getJobs, createJob, deleteJob, getApplications, CATEGORIES, getCompanyColor, TAG_COLORS } from '../../lib/api';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];
const EMPTY_FORM = {
  title: '', company: '', companyLogo: '', location: '',
  category: '', type: 'Full Time', description: '', requirements: '',
  salary: '', tags: [], featured: false,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        getJobs({ limit: 50 }),
        getApplications(),
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const validateForm = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.company.trim()) errs.company = 'Required';
    if (!form.companyLogo.trim()) errs.companyLogo = 'Required';
    if (!form.location.trim()) errs.location = 'Required';
    if (!form.category) errs.category = 'Required';
    if (!form.description.trim()) errs.description = 'Required';
    return errs;
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    setSubmitting(true);
    setError('');
    try {
      const res = await createJob(form);
      setJobs(prev => [res.data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSuccess('Job posted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      setSuccess('Job deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm(f => ({ ...f, tags: [...f.tags, trimmed] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const setField = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-dark">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your job listings and applications</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            {showForm ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {/* Alerts */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-green-800 text-sm font-medium">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">{error}</div>
        )}

        {/* ── POST JOB FORM ── */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 mb-8 shadow-card">
            <h2 className="text-lg font-bold text-dark mb-6">Post a New Job</h2>
            <form onSubmit={handleCreateJob}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setField('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className={`input-field ${formErrors.title ? 'border-red-400' : ''}`}
                  />
                  {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => setField('company', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={`input-field ${formErrors.company ? 'border-red-400' : ''}`}
                  />
                  {formErrors.company && <p className="text-red-500 text-xs mt-1">{formErrors.company}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Company Logo URL *</label>
                  <input
                    type="url"
                    value={form.companyLogo}
                    onChange={e => setField('companyLogo', e.target.value)}
                    placeholder="e.g. https://example.com/logo.png"
                    className={`input-field ${formErrors.companyLogo ? 'border-red-400' : ''}`}
                  />
                  {formErrors.companyLogo && <p className="text-red-500 text-xs mt-1">{formErrors.companyLogo}</p>}
                  {form.companyLogo && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={form.companyLogo} alt="Company logo preview" className="h-8 w-8 object-cover rounded" onError={(e) => e.target.style.display = 'none'} />
                      <span className="text-xs text-gray-500">Logo preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Location *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setField('location', e.target.value)}
                    placeholder="e.g. Paris, France"
                    className={`input-field ${formErrors.location ? 'border-red-400' : ''}`}
                  />
                  {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Salary Range</label>
                  <input
                    type="text"
                    value={form.salary}
                    onChange={e => setField('salary', e.target.value)}
                    placeholder="e.g. $60,000 - $80,000"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setField('category', e.target.value)}
                    className={`input-field ${formErrors.category ? 'border-red-400' : ''}`}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Job Type</label>
                  <select
                    value={form.type}
                    onChange={e => setField('type', e.target.value)}
                    className="input-field"
                  >
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-dark mb-2">Job Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4}
                  className={`input-field resize-none ${formErrors.description ? 'border-red-400' : ''}`}
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-dark mb-2">Requirements</label>
                <textarea
                  value={form.requirements}
                  onChange={e => setField('requirements', e.target.value)}
                  placeholder="List the required skills, qualifications, and experience..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Tags */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-dark mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="e.g. Marketing (press Enter)"
                    className="input-field flex-1 text-sm"
                  />
                  <button type="button" onClick={addTag} className="btn-outline text-sm px-4 py-3">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map(tag => (
                      <span key={tag} className={`tag ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-600'} flex items-center gap-1.5`}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-current opacity-60 hover:opacity-100">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setField('featured', e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-dark">Mark as Featured Job</label>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? 'Publishing...' : 'Publish Job'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setFormErrors({}); setForm(EMPTY_FORM); }}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-lg hover:border-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 w-fit mb-6">
          {['jobs', 'applications'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                activeTab === tab ? 'bg-primary text-white' : 'text-gray-500 hover:text-dark'
              }`}
            >
              {tab} {tab === 'jobs' ? `(${jobs.length})` : `(${applications.length})`}
            </button>
          ))}
        </div>

        {/* ── JOBS TABLE ── */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400">No jobs yet. Post your first job!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50">
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Job</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4 hidden sm:table-cell">Category</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Type</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">Location</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4">Status</th>
                      <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {jobs.map(job => {
                      const bg = getCompanyColor(job.company);
                      return (
                        <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden`}>
                                {job.companyLogo ? (
                                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                  job.company[0]
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-dark text-sm">{job.title}</p>
                                <p className="text-gray-400 text-xs">{job.company}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className="text-sm text-gray-600">{job.category}</span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-xs font-semibold text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full">{job.type}</span>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="text-sm text-gray-500">{job.location}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              job.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {job.featured ? '⭐ Featured' : 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/jobs/${job._id}`} className="text-xs text-primary font-medium hover:underline">
                                View
                              </Link>
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                disabled={deletingId === job._id}
                                className="text-xs text-red-500 font-medium hover:underline disabled:opacity-50"
                              >
                                {deletingId === job._id ? '...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── APPLICATIONS TABLE ── */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400">No applications yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50">
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Applicant</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4 hidden sm:table-cell">Job Applied</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Resume</th>
                      <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">Applied Date</th>
                      <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-dark text-sm">{app.name}</p>
                            <p className="text-gray-400 text-xs break-all">{app.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          {app.job ? (
                            <div>
                              <p className="text-sm font-semibold text-dark">{app.job.title}</p>
                              <p className="text-xs text-gray-400">{app.job.company}</p>
                            </div>
                          ) : <span className="text-gray-300 text-xs">Job deleted</span>}
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <a href={app.resumeLink} target="_blank" rel="noopener noreferrer"
                            className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8a9 9 0 018.354-8.646" />
                            </svg>
                            View Resume
                          </a>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-gray-500 text-xs">
                            {new Date(app.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a href={app.resumeLink} target="_blank" rel="noopener noreferrer"
                            className="text-primary text-xs font-semibold hover:underline flex justify-end gap-1 items-center">
                            View
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
