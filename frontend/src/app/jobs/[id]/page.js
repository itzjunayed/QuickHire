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
      setError(err.message || 'Failed to submit application');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-5">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Job not found</h2>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
            <span>/</span>
            <span className="text-dark font-medium truncate">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── MAIN CONTENT ── */}
          <main className="flex-1">
            {/* Job header card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 mb-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}>
                  {job.companyLogo || job.company[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-extrabold text-dark mb-1">{job.title}</h1>
                      <p className="text-gray-500 font-medium">{job.company} • {job.location}</p>
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 mb-6 shadow-card">
              <h2 className="text-lg font-bold text-dark mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>

              {job.requirements && (
                <>
                  <h2 className="text-lg font-bold text-dark mt-8 mb-4">Requirements</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                </>
              )}
            </div>

            {/* Success message */}
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-green-800 mb-1">Application Submitted! 🎉</h3>
                  <p className="text-green-700 text-sm">We've received your application and will get back to you soon. Good luck!</p>
                </div>
              </div>
            )}

            {/* Apply form */}
            {showForm && !submitted && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-card">
                <h2 className="text-lg font-bold text-dark mb-6">Apply Now</h2>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-sm text-red-700">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleInput('name', e.target.value)}
                      placeholder="John Doe"
                      className={`input-field ${formErrors.name ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => handleInput('email', e.target.value)}
                      placeholder="john@example.com"
                      className={`input-field ${formErrors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Resume Link *</label>
                    <input
                      type="url"
                      value={form.resumeLink}
                      onChange={e => handleInput('resumeLink', e.target.value)}
                      placeholder="https://drive.google.com/your-resume"
                      className={`input-field ${formErrors.resumeLink ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    {formErrors.resumeLink && <p className="text-red-500 text-xs mt-1">{formErrors.resumeLink}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Cover Note *</label>
                    <textarea
                      value={form.coverNote}
                      onChange={e => handleInput('coverNote', e.target.value)}
                      placeholder="Tell us why you're a great fit for this role..."
                      rows={5}
                      className={`input-field resize-none ${formErrors.coverNote ? 'border-red-400 focus:ring-red-200' : ''}`}
                    />
                    <div className="flex justify-between mt-1">
                      {formErrors.coverNote && <p className="text-red-500 text-xs">{formErrors.coverNote}</p>}
                      <p className="text-xs text-gray-400 ml-auto">{form.coverNote.length}/2000</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={applying}
                      className="btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {applying ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
                      className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-lg hover:border-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>

          {/* ── SIDEBAR ── */}
          <aside className="lg:w-80 flex-shrink-0 space-y-5">
            {/* Apply CTA */}
            {!submitted && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <h3 className="font-bold text-dark text-lg mb-1">Interested?</h3>
                <p className="text-gray-400 text-sm mb-5">Apply now and take the next step in your career</p>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="btn-primary w-full justify-center"
                >
                  {showForm ? 'Hide Form' : 'Apply Now'}
                </button>
              </div>
            )}

            {/* Job overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
              <h3 className="font-bold text-dark mb-5">Job Overview</h3>
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
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm text-dark font-semibold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <h3 className="font-bold text-dark mb-4">Related Jobs</h3>
                <div className="space-y-3">
                  {relatedJobs.map(rj => {
                    const rBgColor = getCompanyColor(rj.company);
                    return (
                      <Link key={rj._id} href={`/jobs/${rj._id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors -mx-3">
                          <div className={`w-9 h-9 ${rBgColor} rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {rj.company[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-dark truncate">{rj.title}</p>
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
