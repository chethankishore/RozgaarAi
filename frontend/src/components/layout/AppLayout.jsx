// src/components/layout/AppLayout.jsx
import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page)' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}