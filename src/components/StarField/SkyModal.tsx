import { useEffect } from 'react'

interface SkyModalProps {
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function SkyModal({ onClose, children, footer }: SkyModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(250,250,249,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAFAF9] border border-[#E7E5E4] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded-full transition-colors text-base leading-none"
          aria-label="Zamknij"
        >
          ✕
        </button>
        <div className="overflow-y-auto px-8 pt-8 pb-4" style={{ flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div className="px-8 py-5 border-t border-[#E7E5E4] flex justify-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
