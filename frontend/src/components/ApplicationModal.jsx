'use client';

export default function ApplicationModal({ 
  isOpen, 
  application,
  onClose,
}) {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 transition-opacity duration-200 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl p-6 mx-4 duration-200 bg-white shadow-2xl rounded-2xl sm:p-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute text-gray-400 transition-colors top-4 right-4 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-dark">Application Details</h2>
          <p className="text-sm text-gray-500">Review applicant information</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Applicant Name */}
          <div>
            <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Applicant Name</label>
            <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
              <p className="text-lg font-bold text-dark">{application.name}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Email Address</label>
            <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
              <a href={`mailto:${application.email}`} className="font-semibold break-all text-primary hover:underline">
                {application.email}
              </a>
            </div>
          </div>

          {/* Job Applied */}
          {application.job && (
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Applied For</label>
              <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                <p className="mb-1 font-semibold text-dark">{application.job.title}</p>
                <p className="text-sm text-gray-500">{application.job.company}</p>
              </div>
            </div>
          )}

          {/* Resume Link */}
          <div>
            <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Resume</label>
            <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
              <a 
                href={application.resumeLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Resume (Opens in new tab)
              </a>
            </div>
          </div>

          {/* Cover Note */}
          {application.coverNote && (
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Cover Note</label>
              <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{application.coverNote}</p>
              </div>
            </div>
          )}

          {/* Applied Date */}
          <div>
            <label className="block mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Applied Date</label>
            <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                {new Date(application.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <a
            href={application.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="justify-center flex-1 text-center btn-primary"
          >
            View Full Resume
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 font-semibold text-gray-700 transition-colors border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
