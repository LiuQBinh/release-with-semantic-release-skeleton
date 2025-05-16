import React from 'react'
import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router'

const Home = lazy(() => import('../pages/home'))
const About = lazy(() => import('../pages/about'))

const ExampleLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative w-16 h-16">
        <div className="absolute w-16 h-16 rounded-full border-4 border-blue-200 animate-ping"></div>
        <div className="absolute w-16 h-16 rounded-full border-4 border-blue-400 animate-pulse"></div>
        <div className="absolute w-16 h-16 rounded-full border-t-4 border-blue-600 animate-spin"></div>
      </div>
      <h2 className="mt-8 text-xl font-medium text-blue-800 animate-pulse">
        Loading...
      </h2>
    </div>
  )
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<ExampleLoading />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<ExampleLoading />}>
        <About />
      </Suspense>
    ),
  },
]

export default routes
