import React from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-100 transition-opacity" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transform transition-all duration-200 scale-100 opacity-100">
          <div className="border-b px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">{title}</div>
            <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800" aria-label="Fechar">
              <X size={18} />
            </button>
          </div>
          <div className="px-4 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
