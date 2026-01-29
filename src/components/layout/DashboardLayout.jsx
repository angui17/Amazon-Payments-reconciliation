import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopNav from './TopNav'
import CSVUploadModal from '../common/CSVUploadModal'

// Estilos
import '../../styles/dashboard.css'
import '../../styles/mockup.css'

const DashboardLayout = () => {
  const [showCSVModal, setShowCSVModal] = useState(false)

  return (
    <div className="dashboard-container responsive-layout">
      <TopNav />
      <main className="main-content"> <Outlet /> </main>
      <CSVUploadModal isOpen={showCSVModal} onClose={() => setShowCSVModal(false)} />
    </div>
  )
}

export default DashboardLayout