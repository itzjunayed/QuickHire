'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import ApplicationModal from '../../components/ApplicationModal';
import { getJobs, createJob, deleteJob, getApplications, CATEGORIES, getCompanyColor, TAG_COLORS, JOB_TYPE_COLORS } from '../../lib/api';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];
const EMPTY_FORM = {
  title: '', company: '', companyLogo: '', location: '',
  category: '', type: 'Full Time', description: '', requirements: '',
  salary: '', tags: [], featured: false,
};

export default function AdminPage() {
  const router = useRouter();
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
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is an employer
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.userType === 'employer') {
          setAuthorized(true);
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    if (authorized) {
      fetchData();
    }
  }, [authorized]);

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
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget);
    try {
      await deleteJob(deleteTarget);
      setJobs(prev => prev.filter(j => j._id !== deleteTarget));
      setSuccess('Job deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      setShowDeleteModal(false);
      setDeleteTarget(null);
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

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-dark">Access Denied</h2>
            <p className="mb-6 text-gray-500">You must be an employer to access the admin panel</p>
            <Link href="/" className="inline-block btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-dark">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your job listings and applications</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            {showForm ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-3 p-4 mb-6 text-sm font-medium text-green-800 border border-green-200 bg-green-50 rounded-xl">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">{error}</div>
        )}

        {/* ── POST JOB FORM ── */}
        {showForm && (
          <div className="p-6 mb-8 bg-white border border-gray-100 rounded-2xl lg:p-8 shadow-card">
            <h2 className="mb-6 text-lg font-bold text-dark">Post a New Job</h2>
            <form onSubmit={handleCreateJob}>
              <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-dark">Job Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setField('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className={`input-field ${formErrors.title ? 'border-red-400' : ''}`}
                  />
                  {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-dark">Company Name *</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => setField('company', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className={`input-field ${formErrors.company ? 'border-red-400' : ''}`}
                  />
                  {formErrors.company && <p className="mt-1 text-xs text-red-500">{formErrors.company}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-dark">Company Logo URL *</label>
                  <input
                    type="url"
                    value={form.companyLogo}
                    onChange={e => setField('companyLogo', e.target.value)}
                    placeholder="e.g. https://example.com/logo.png"
                    className={`input-field ${formErrors.companyLogo ? 'border-red-400' : ''}`}
                  />
                  {formErrors.companyLogo && <p className="mt-1 text-xs text-red-500">{formErrors.companyLogo}</p>}
                  {form.companyLogo && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={form.companyLogo} alt="Company logo preview" className="object-cover w-8 h-8 rounded" onError={(e) => e.target.style.display = 'none'} />
                      <span className="text-xs text-gray-500">Logo preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-dark">Location *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setField('location', e.target.value)}
                    placeholder="e.g. Paris, France"
                    className={`input-field ${formErrors.location ? 'border-red-400' : ''}`}
                  />
                  {formErrors.location && <p className="mt-1 text-xs text-red-500">{formErrors.location}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-dark">Salary Range</label>
                  <input
                    type="text"
                    value={form.salary}
                    onChange={e => setField('salary', e.target.value)}
                    placeholder="e.g. $60,000 - $80,000"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-dark">Category *</label>
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
                  {formErrors.category && <p className="mt-1 text-xs text-red-500">{formErrors.category}</p>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-dark">Job Type</label>
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
                <label className="block mb-2 text-sm font-semibold text-dark">Job Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4}
                  className={`input-field resize-none ${formErrors.description ? 'border-red-400' : ''}`}
                />
                {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-semibold text-dark">Requirements</label>
                <textarea
                  value={form.requirements}
                  onChange={e => setField('requirements', e.target.value)}
                  placeholder="List the required skills, qualifications, and experience..."
                  rows={3}
                  className="resize-none input-field"
                />
              </div>

              {/* Tags */}
              <div className="mb-5">
                <label className="block mb-2 text-sm font-semibold text-dark">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="e.g. Marketing (press Enter)"
                    className="flex-1 text-sm input-field"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-3 text-sm btn-outline">Add</button>
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
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium text-dark">Mark as Featured Job</label>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? 'Publishing...' : 'Publish Job'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setFormErrors({}); setForm(EMPTY_FORM); }}
                  className="px-6 py-3 font-semibold text-gray-600 transition-colors border-2 border-gray-200 rounded-lg hover:border-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex gap-1 p-1 mb-6 bg-white border border-gray-100 rounded-xl w-fit">
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
          <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-card">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-400">No jobs yet. Post your first job!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50">
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Job</th>
                      <th className="hidden px-4 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase sm:table-cell">Category</th>
                      <th className="hidden px-4 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase md:table-cell">Type</th>
                      <th className="hidden px-4 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase lg:table-cell">Location</th>
                      <th className="px-4 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {jobs.map(job => {
                      const bg = getCompanyColor(job.company);
                      return (
                        <tr key={job._id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden`}>
                                {job.companyLogo ? (
                                  <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                  job.company[0]
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-dark">{job.title}</p>
                                <p className="text-xs text-gray-400">{job.company}</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-4 py-4 sm:table-cell">
                            <span className="text-sm text-gray-600">{job.category}</span>
                          </td>
                          <td className="hidden px-4 py-4 md:table-cell">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${JOB_TYPE_COLORS[job.type] || 'bg-gray-100 text-gray-600'}`}>{job.type}</span>
                          </td>
                          <td className="hidden px-4 py-4 lg:table-cell">
                            <span className="text-sm text-gray-500">{job.location}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              job.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {job.featured ? 'Featured' : 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/jobs/${job._id}`} className="text-xs font-medium text-primary hover:underline">
                                View
                              </Link>
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                disabled={deletingId === job._id}
                                className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
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
          <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-card">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-400">No applications yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50">
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Applicant</th>
                      <th className="hidden px-4 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase sm:table-cell">Job Applied</th>
                      <th className="hidden px-4 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase md:table-cell">Resume</th>
                      <th className="hidden px-4 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase lg:table-cell">Applied Date</th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(app => (
                      <tr key={app._id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-dark">{app.name}</p>
                            <p className="text-xs text-gray-400 break-all">{app.email}</p>
                          </div>
                        </td>
                        <td className="hidden px-4 py-4 sm:table-cell">
                          {app.job ? (
                            <div>
                              <p className="text-sm font-semibold text-dark">{app.job.title}</p>
                              <p className="text-xs text-gray-400">{app.job.company}</p>
                            </div>
                          ) : <span className="text-xs text-gray-300">Job deleted</span>}
                        </td>
                        <td className="hidden px-4 py-4 md:table-cell">
                          <a href={app.resumeLink} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8a9 9 0 018.354-8.646" />
                            </svg>
                            View Resume
                          </a>
                        </td>
                        <td className="hidden px-4 py-4 lg:table-cell">
                          <span className="text-xs text-gray-500">
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
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowApplicationModal(true);
                            }}
                            className="flex items-center justify-end gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            View
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Job?"
        message="Are you sure you want to delete this job? This action cannot be undone."
        onConfirm={confirmDeleteJob}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        isLoading={deletingId === deleteTarget}
        confirmText="Delete Job"
        cancelText="Cancel"
      />

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        application={selectedApplication}
        onClose={() => {
          setShowApplicationModal(false);
          setSelectedApplication(null);
        }}
      />
    </div>
  );
}
