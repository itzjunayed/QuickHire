import Link from 'next/link';
import { getCompanyColor, TAG_COLORS } from '../lib/api';

export function JobCard({ job }) {
  const bgColor = getCompanyColor(job.company);

  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="flex flex-col h-full gap-4 job-card">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Company logo */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0 overflow-hidden`}>
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" onError={(e) => e.target.style.display = 'none'} />
            ) : (
              job.company[0].toUpperCase()
            )}
          </div>
          <span className="px-3 py-1 text-xs font-semibold text-gray-500 border border-gray-200 rounded-full">
            {job.type}
          </span>
        </div>

        {/* Title & company */}
        <div>
          <h3 className="mb-1 text-base font-bold text-dark line-clamp-1">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
        </div>

        {/* Description */}
        <p className="flex-1 text-sm leading-relaxed text-gray-400 line-clamp-2">
          {job.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {(job.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className={`tag ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-600'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function JobListItem({ job }) {
  const bgColor = getCompanyColor(job.company);

  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="flex items-center gap-4 p-4 transition-all duration-200 bg-white border border-gray-100 cursor-pointer rounded-xl hover:shadow-card-hover hover:border-primary-100">
        {/* Logo */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 overflow-hidden`}>
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" onError={(e) => e.target.style.display = 'none'} />
          ) : (
            job.company[0].toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-dark text-sm mb-0.5 truncate">{job.title}</h3>
          <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
        </div>

        {/* Tags */}
        <div className="hidden sm:flex flex-wrap gap-1.5 justify-end">
          <span className="text-xs font-semibold text-gray-400 border border-gray-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {job.type}
          </span>
          {(job.tags || []).slice(0, 2).map(tag => (
            <span key={tag} className={`tag text-xs ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-600'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
