'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { getJob, submitApplication, getJobs, getCompanyColor, TAG_COLORS } from '../../../lib/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', resumeLink: '', coverNote: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      try {
        const res = await getJob(id);
        setJob(res.data);
        const related = await getJobs({ category: res.data.category, limit: 4 });
        setRelatedJobs(related.data.filter(j => j._id !== id).slice(0, 3));
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.resumeLink.trim()) errs.resumeLink = 'Resume link is required';
    else if (!/^https?:\/\/.+/.test(form.resumeLink)) errs.resumeLink = 'Must be a valid URL (http:// or https://)';
    if (!form.coverNote.trim()) errs.coverNote = 'Cover note is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    setApplying(true);
    setError('');
    try {
      await submitApplication({ jobId: id, ...form });
      setSubmitted(true);
      setShowForm(false);
    } catch (err) {
      // Handle field-level validation errors from API
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFormErrors(err.fieldErrors);
        setError('Please fix the errors below');
      } else {
        setError(err.message || 'Failed to submit application');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleInput = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: '' }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-5 animate-pulse">
            <div className="w-1/3 h-8 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="bg-gray-200 h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-dark">Job not found</h2>
          <Link href="/jobs" className="text-primary hover:underline">Browse all jobs</Link>
        </div>
      </div>
    );
  }

  const bgColor = getCompanyColor(job.company);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/jobs" className="transition-colors hover:text-primary">Jobs</Link>
            <span>/</span>
            <span className="font-medium truncate text-dark">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── MAIN CONTENT ── */}
          <main className="flex-1">
            {/* Job header card */}
            <div className="p-6 mb-6 bg-white border border-gray-100 rounded-2xl lg:p-8 shadow-card">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}>
                  <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="mb-1 text-2xl font-extrabold lg:text-3xl text-dark">{job.title}</h1>
                      <p className="font-medium text-gray-500">{job.company} • {job.location}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 border border-gray-200 px-4 py-1.5 rounded-full">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      {job.category}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                        💰 {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {job.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.tags.map(tag => (
                        <span key={tag} className={`tag ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 mb-6 bg-white border border-gray-100 rounded-2xl lg:p-8 shadow-card">
              <h2 className="mb-4 text-lg font-bold text-dark">Job Description</h2>
              <p className="leading-relaxed text-gray-600 whitespace-pre-line">{job.description}</p>

              {job.requirements && (
                <>
                  <h2 className="mt-8 mb-4 text-lg font-bold text-dark">Requirements</h2>
                  <p className="leading-relaxed text-gray-600 whitespace-pre-line">{job.requirements}</p>
                </>
              )}
            </div>

            {/* Success message */}
            {submitted && (
              <div className="flex items-start gap-4 p-6 mb-6 border border-green-200 bg-green-50 rounded-2xl">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-full">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-green-800">Application Submitted! 🎉</h3>
                  <p className="text-sm text-green-700">We've received your application and will get back to you soon. Good luck!</p>
                </div>
              </div>
            )}

            {/* Apply form */}
            {showForm && !submitted && (
              <div className="p-6 bg-white border border-gray-100 rounded-2xl lg:p-8 shadow-card">
                <h2 className="mb-6 text-lg font-bold text-dark">Apply Now</h2>
                {error && (
                  <div className="p-4 mb-5 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-dark">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleInput('name', e.target.value)}
                      placeholder="John Doe"
                      className={`input-field ${formErrors.name ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-dark">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => handleInput('email', e.target.value)}
                      placeholder="john@example.com"
                      className={`input-field ${formErrors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-dark">Resume Link *</label>
                    <input
                      type="url"
                      value={form.resumeLink}
                      onChange={e => handleInput('resumeLink', e.target.value)}
                      placeholder="https://drive.google.com/your-resume"
                      className={`input-field ${formErrors.resumeLink ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    {formErrors.resumeLink && <p className="mt-1 text-xs text-red-500">{formErrors.resumeLink}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-dark">Cover Note *</label>
                    <textarea
                      value={form.coverNote}
                      onChange={e => handleInput('coverNote', e.target.value)}
                      placeholder="Tell us why you're a great fit for this role..."
                      rows={5}
                      className={`input-field resize-none ${formErrors.coverNote ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    <div className="flex justify-between mt-1">
                      {formErrors.coverNote && <p className="text-xs text-red-500">{formErrors.coverNote}</p>}
                      <p className="ml-auto text-xs text-gray-400">{form.coverNote.length}/2000</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={applying}
                      className="justify-center flex-1 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {applying ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Submitting...
                        </>
                      ) : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 font-semibold text-gray-600 transition-colors border-2 border-gray-200 rounded-lg hover:border-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>

          {/* ── SIDEBAR ── */}
          <aside className="flex-shrink-0 space-y-5 lg:w-80">
            {/* Apply CTA */}
            {!submitted && (
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-card">
                <h3 className="mb-1 text-lg font-bold text-dark">Interested?</h3>
                <p className="mb-5 text-sm text-gray-400">Apply now and take the next step in your career</p>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="justify-center w-full btn-primary"
                >
                  {showForm ? 'Hide Form' : 'Apply Now'}
                </button>
              </div>
            )}

            {/* Job overview */}
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-card">
              <h3 className="mb-5 font-bold text-dark">Job Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Job Title', value: job.title, icon: '💼' },
                  { label: 'Company', value: job.company, icon: '🏢' },
                  { label: 'Location', value: job.location, icon: '📍' },
                  { label: 'Category', value: job.category, icon: '🏷️' },
                  { label: 'Job Type', value: job.type, icon: '⏰' },
                  ...(job.salary ? [{ label: 'Salary', value: job.salary, icon: '💰' }] : []),
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-xs font-medium text-gray-400">{label}</p>
                      <p className="text-sm font-semibold text-dark">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related jobs */}
            {relatedJobs.length > 0 && (
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-card">
                <h3 className="mb-4 font-bold text-dark">Related Jobs</h3>
                <div className="space-y-3">
                  {relatedJobs.map(rj => {
                    const rBgColor = getCompanyColor(rj.company);
                    return (
                      <Link key={rj._id} href={`/jobs/${rj._id}`}>
                        <div className="flex items-center gap-3 p-3 -mx-3 transition-colors rounded-xl hover:bg-gray-50">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            <img src={rj.companyLogo} alt={rj.company} className="object-cover w-full h-full" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate text-dark">{rj.title}</p>
                            <p className="text-xs text-gray-400 truncate">{rj.company}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
