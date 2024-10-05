import React from 'react'
import { PenSquare } from 'lucide-react'

export default function Post_CommentLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="relative mx-auto h-24 w-24">
          <PenSquare
            className="absolute inset-0 h-full w-full text-blue-500 animate-ping"
            strokeWidth={2}
          />
          <PenSquare
            className="relative z-10 h-full w-full text-blue-500 animate-pulse"
            strokeWidth={2}
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-white animate-pulse">Adding Post...</h2>
        <p className="mt-2 text-sm text-gray-400">Your content is being published</p>
        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-blue-500"
              style={{ animation: `bounce 1.4s infinite ease-in-out ${i * 0.32}s` }}
            ></div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  )
}