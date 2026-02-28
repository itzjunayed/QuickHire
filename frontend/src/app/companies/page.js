'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getCompanies } from '../../lib/api';

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await getCompanies();
        setCompanies(res.data);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanyClick = (companyName) => {
    router.push(`/jobs?company=${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-dark mb-2">
            Browse <span className="text-primary">{companies.length}</span> Companies
          </h1>
          <p className="text-gray-500 text-sm">Explore leading companies and find opportunities</p>

          {/* Search bar */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary transition-all">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No companies found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCompanies.map((company) => (
              <button
                key={company.name}
                onClick={() => handleCompanyClick(company.name)}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-primary-100 transition-all duration-200 text-left"
              >
                {/* Company Logo */}
                <div className="mb-4 flex justify-center">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-16 w-16 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gradient-to-br from-primary-300 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {company.name[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <h3 className="text-lg font-bold text-dark text-center line-clamp-1 group-hover:text-primary transition-colors">
                  {company.name}
                </h3>

                {/* Job Count */}
                <p className="text-sm text-gray-500 text-center mt-2">
                  {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'} posted
                </p>

                {/* CTA Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-primary text-center">
                    View Jobs →
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
