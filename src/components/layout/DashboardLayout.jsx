import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopNav from './TopNav'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import CSVUploadModal from '../common/CSVUploadModal'
import '../../styles/dashboard.css'
import '../../styles/mockup.css'

const DashboardLayout = () => {
  const [showCSVModal, setShowCSVModal] = useState(false)
  const location = useLocation()
  
  // Determinar el título de la sidebar basado en la ruta
  const getSidebarTitle = () => {
    const path = location.pathname
    if (path.includes('orders')) return 'Order Filters'
    if (path.includes('refunds')) return 'Refund Filters'
    if (path.includes('payments')) return 'Payment Filters'
    if (path.includes('fees')) return 'Fee Filters'
    if (path.includes('files')) return 'File Management'
    if (path.includes('errors')) return 'Error Filters'
    if (path.includes('reports')) return 'Report Filters'
    if (path.includes('accounting')) return 'Accounting Filters'
    if (path.includes('monitoring')) return 'Monitoring Settings'
    if (path.includes('admin')) return 'Admin Controls'
    return 'Dashboard Filters'
  }

  return (
    <div className="dashboard-container">
      <TopNav />
      
      {/* <LeftSidebar title={getSidebarTitle()} onUploadCSV={() => setShowCSVModal(true)} /> */}
      
      <main className="main-content">
        <Outlet />
      </main>
      
      {/* <RightSidebar /> */}
      
      <CSVUploadModal 
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
      />
    </div>
  )
}

export default DashboardLayout