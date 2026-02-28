'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import { JobCard, JobListItem } from '../components/JobCard';
import { getJobs, CATEGORIES } from '../lib/api';

const COMPANIES = [
  { name: 'vodafone'},
  { name: 'intel'},
  { name: 'TESLA'},
  { name: 'AMD'},
  { name: 'Talkit'},
];

const POPULAR_SEARCHES = ['UI Designer', 'UX Researcher', 'Android', 'Admin'];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, latestRes] = await Promise.all([
          getJobs({ featured: 'true', limit: 8 }),
          getJobs({ limit: 8 }),
        ]);
        setFeaturedJobs(featuredRes.data);
        setLatestJobs(latestRes.data);

        // Count by category
        const counts = {};
        latestRes.data.forEach(job => {
          counts[job.category] = (counts[job.category] || 0) + 1;
        });
        // Fetch all for accurate counts
        const allRes = await getJobs({ limit: 50 });
        const allCounts = {};
        allRes.data.forEach(job => {
          allCounts[job.category] = (allCounts[job.category] || 0) + 1;
        });
        setCategoryCounts(allCounts);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── HERO SECTION ── */}
      <Navbar />
      <section className="relative overflow-hidden bg-navy">

        {/* Decorative circles */}
        <div className="hero-decoration w-96 h-96 -top-24 -right-24 opacity-20" style={{background:'radial-gradient(circle,#7C6FF7,transparent)'}} />
        <div className="bottom-0 w-64 h-64 hero-decoration left-1/3 opacity-10" style={{background:'radial-gradient(circle,#4F3FF0,transparent)'}} />
        <div className="absolute right-0 w-1/2 h-full top-32 opacity-5">
          <div className="w-full h-full bg-gradient-to-l from-primary to-transparent" />
        </div>

        <div className="relative px-4 pt-24 pb-20 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:pt-32 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left content */}
            <div>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Discover<br />
                more than<br />
                <span className="text-primary-300 underline-animated">5000+ Jobs</span>
              </h1>
              <p className="max-w-md mb-8 text-base leading-relaxed text-white/60 lg:text-lg">
                Great platform for the job seeker that searching for new career heights and passionate about startups.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex flex-col gap-3 p-3 mb-5 bg-white shadow-2xl rounded-2xl sm:flex-row">
                <div className="flex items-center flex-1 gap-3 px-2">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <div className="hidden w-px bg-gray-100 sm:block" />
                <div className="flex items-center flex-1 gap-3 px-2">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Florence, Italy"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center flex-1 gap-3 px-2">
                  <button
                    type="submit"
                    className="py-3 text-sm font-semibold text-white transition-colors bg-primary px-7 rounded-xl hover:bg-primary-600 "
                  >
                    Search my job
                  </button>
                </div>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-white/50">Popular:</span>
                {POPULAR_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => router.push(`/jobs?search=${term}`)}
                    className="text-sm transition-colors text-white/70 hover:text-white hover:underline"
                  >
                    {term}
                    {term !== POPULAR_SEARCHES[POPULAR_SEARCHES.length - 1] && ','}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Hero image placeholder with floating cards */}
            <div className="relative hidden lg:block">
                <img src="./Landing Page/CTA/3.1 Dashboard Company.png" alt="Hero" className="object-contain rounded opacity-90 w-100 h-100" />
              {/* Floating stat cards */}
              <div className="absolute flex items-center gap-3 p-4 bg-white shadow-xl -bottom-4 -left-6 rounded-2xl">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Applicants</p>
                  <p className="font-bold text-dark">21,457</p>
                </div>
              </div>
              <div className="absolute flex items-center gap-3 p-4 bg-white shadow-xl -top-4 -right-6 rounded-2xl">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Jobs available</p>
                  <p className="font-bold text-dark">5,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY LOGOS ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="mb-6 text-sm text-center text-gray-400">Companies we helped grow</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {COMPANIES.map(c => (
              <span key={c.name} className="text-lg font-bold tracking-widest text-gray-300 transition-colors cursor-default lg:text-xl hover:text-gray-500">
                <img src={`./Landing Page/Company/${c.name}.png`} alt={c.name} className="object-contain w-40 h-8" onError={(e) => e.target.style.display = 'none'} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE BY CATEGORY ── */}
      <section className="py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">
              Explore by <span>category</span>
            </h2>
            <Link href="/jobs" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Show all jobs →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.name}
                category={cat.name}
                count={categoryCounts[cat.name] || (125 + i * 37)}
                active={cat.name === 'Marketing'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── START POSTING JOBS CTA ── */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden bg-primary rounded-3xl">
            <div className="grid items-center gap-8 p-10 lg:grid-cols-2 lg:p-14">
              <div>
                <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                  Start posting<br />jobs today
                </h2>
                <p className="mb-6 text-base text-white/70">
                  Start posting jobs for only $10.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Sign Up For Free
                </Link>
              </div>
              {/* Dashboard preview */}
              <div className="relative hidden lg:block">
                <div className="p-5 text-white border bg-white/10 backdrop-blur rounded-2xl border-white/20">
                  <div className="flex gap-3 mb-4">
                    <div className="px-4 py-2 text-xs font-bold bg-white/20 rounded-xl">76 <span className="font-normal opacity-60">Applicants</span></div>
                    <div className="px-4 py-2 text-xs font-bold bg-white/20 rounded-xl">24 <span className="font-normal opacity-60">Jobs</span></div>
                  </div>
                  <div className="space-y-2">
                    {[80, 55, 70, 40, 90].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-full h-2 rounded-full bg-white/10">
                          <div className="h-2 rounded-full bg-white/50" style={{ width: `${w}%` }} />
                        </div>
                        <span className="w-8 text-xs text-white/50">{w}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">
              Featured <span>jobs</span>
            </h2>
            <Link href="/jobs?featured=true" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Show all jobs →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-56 bg-gray-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LATEST JOBS OPEN ── */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">
              Latest jobs <span>open</span>
            </h2>
            <Link href="/jobs" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Show all jobs →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {latestJobs.map(job => (
                <JobListItem key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
