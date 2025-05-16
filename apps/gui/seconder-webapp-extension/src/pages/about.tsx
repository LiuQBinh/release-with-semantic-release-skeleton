import { Link } from 'react-router'

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Seconder Extension - ABOUT PAGE</h1>
      <Link to="/">Home</Link>
    </div>
  )
}
