'use client';

export default function DeleteConfirmModal({ 
  isOpen, 
  title = 'Delete Item?', 
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm, 
  onCancel,
  isLoading = false,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDangerous = true
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 transition-opacity duration-200 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative max-w-sm p-6 mx-4 duration-200 bg-white shadow-2xl rounded-2xl sm:p-8 animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute text-gray-400 transition-colors top-4 right-4 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${isDangerous ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <svg className={`w-6 h-6 ${isDangerous ? 'text-red-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8.586a2 2 0 012.828 0L12 11.172l3.172-3.172a2 2 0 112.828 2.828L14.828 14l3.172 3.172a2 2 0 11-2.828 2.828L12 16.828l-3.172 3.172a2 2 0 11-2.828-2.828L9.172 14 6 10.828a2 2 0 010-2.828z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="mb-2 text-lg font-bold text-center text-dark">{title}</h2>
        <p className="mb-6 text-sm text-center text-gray-600">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 font-semibold text-gray-700 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isDangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
