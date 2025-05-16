import { Outlet } from 'react-router'

export default function MainLayout() {
  console.log('MainLayout')

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Seconder</h1>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
