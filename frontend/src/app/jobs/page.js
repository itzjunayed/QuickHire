'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { JobCard } from '../../components/JobCard';
import { getJobs, CATEGORIES } from '../../lib/api';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    company: searchParams.get('company') || '',
    page: 1,
  });
  const [searchInput, setSearchInput] = useState(filters.search);
  const [companyInput, setCompanyInput] = useState(filters.company);

  const fetchJobs = useCallback(async (params) => {
    setLoading(true);
    try {
      const cleanParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
      const res = await getJobs(cleanParams);
      setJobs(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters);
  }, [filters, fetchJobs]);

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter('search', searchInput);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', location: '', type: '', company: '', page: 1 });
    setSearchInput('');
    setCompanyInput('');
  };

  const hasFilters = filters.search || filters.category || filters.location || filters.type || filters.company;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-extrabold text-dark mb-1">
            Browse <span className="text-primary">{pagination.total.toLocaleString()}</span> Jobs
          </h1>
          <p className="text-gray-500 text-sm">Find your next opportunity</p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary transition-all">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary text-sm px-6 py-3 justify-center">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── SIDEBAR FILTERS ── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-dark">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline font-medium">
                    Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!filters.category}
                      onChange={() => setFilter('category', '')}
                      className="accent-primary"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-dark transition-colors">All Categories</span>
                  </label>
                  {CATEGORIES.map(cat => (
                    <label key={cat.name} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat.name}
                        checked={filters.category === cat.name}
                        onChange={() => setFilter('category', cat.name)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-dark transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Job Type</h4>
                <div className="space-y-2">
                  {JOB_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.type === type}
                        onChange={() => setFilter('type', filters.type === type ? '' : type)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-dark transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Company</h4>
                <input
                  type="text"
                  placeholder="e.g. Google, Microsoft"
                  value={companyInput}
                  onChange={e => setCompanyInput(e.target.value)}
                  onBlur={e => setFilter('company', e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setFilter('company', companyInput);
                    }
                  }}
                  className="input-field text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Location</h4>
                <input
                  type="text"
                  placeholder="e.g. Paris, France"
                  value={filters.location}
                  onChange={e => setFilter('location', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>
          </aside>

          {/* ── JOB GRID ── */}
          <main className="flex-1">
            {/* Active filters display */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.category && (
                  <span className="flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                    {filters.category}
                    <button onClick={() => setFilter('category', '')} className="hover:opacity-60">×</button>
                  </span>
                )}
                {filters.type && (
                  <span className="flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                    {filters.type}
                    <button onClick={() => setFilter('type', '')} className="hover:opacity-60">×</button>
                  </span>
                )}
                {filters.company && (
                  <span className="flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                    🏢 {filters.company}
                    <button onClick={() => { setFilter('company', ''); setCompanyInput(''); }} className="hover:opacity-60">×</button>
                  </span>
                )}
                {filters.location && (
                  <span className="flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                    📍 {filters.location}
                    <button onClick={() => setFilter('location', '')} className="hover:opacity-60">×</button>
                  </span>
                )}
                {filters.search && (
                  <span className="flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                    🔍 {filters.search}
                    <button onClick={() => { setFilter('search', ''); setSearchInput(''); }} className="hover:opacity-60">×</button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">No jobs found</h3>
                <p className="text-gray-400 text-sm mb-5">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-primary text-sm">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {jobs.map(job => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setFilters(f => ({ ...f, page: p }))}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          p === pagination.page
                            ? 'bg-primary text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
