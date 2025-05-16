import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    console.log('content script loaded')
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-6 border border-gray-200 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Hello World, from Huynh
      </h1>
      <p className="text-gray-600">Welcome to the content script!</p>
    </div>
  )
}
