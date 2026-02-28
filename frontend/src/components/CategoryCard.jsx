'use client';
import { useRouter } from 'next/navigation';

const categoryIcons = {
  Design: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
    </svg>
  ),
  Sales: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  Marketing: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Finance: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  ),
  Technology: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  Engineering: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Business: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  ),
  'Human Resources': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
};

export default function CategoryCard({ category, count = 0, active = false, onClick }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick(category);
    else router.push(`/jobs?category=${encodeURIComponent(category)}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${
        active
          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
          : 'bg-white border-gray-100 text-dark hover:border-primary hover:shadow-card-hover'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
        active ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-primary/10'
      }`}>
        <span className={active ? 'text-white' : 'text-primary'}>
          {categoryIcons[category]}
        </span>
      </div>
      <p className={`font-bold text-sm mb-1 ${active ? 'text-white' : 'text-dark'}`}>{category}</p>
      <div className="flex items-center justify-between">
        <p className={`text-xs ${active ? 'text-white/70' : 'text-gray-400'}`}>
          {count} jobs available
        </p>
        <span className={`text-lg ${active ? 'text-white/70' : 'text-gray-300 group-hover:text-primary'} transition-colors`}>
          →
        </span>
      </div>
    </button>
  );
}
