// // Layout principal del dashboard

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import TopNav from './TopNav';
// import LeftSidebar from './LeftSidebar';
// import RightSidebar from './RightSidebar';
// import CSVUploadModal from '../common/CSVUploadModal';

// const DashboardLayout = ({ children }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [showCSVModal, setShowCSVModal] = useState(false);
//   const [showUserDropdown, setShowUserDropdown] = useState(false);
//   const [activePage, setActivePage] = useState('dashboard');

//   // Determinar página activa basada en la URL
//   React.useEffect(() => {
//     const path = location.pathname;
//     if (path.includes('/orders')) setActivePage('orders');
//     else if (path.includes('/refunds')) setActivePage('refunds');
//     else if (path.includes('/payments')) setActivePage('payments');
//     else if (path.includes('/fees')) setActivePage('fees');
//     else if (path.includes('/files')) setActivePage('files');
//     else if (path.includes('/errors')) setActivePage('errors');
//     else if (path.includes('/reports')) setActivePage('reports');
//     else if (path.includes('/accounting')) setActivePage('accounting');
//     else if (path.includes('/monitoring')) setActivePage('monitoring');
//     else if (path.includes('/admin')) setActivePage('admin');
//     else if (path.includes('/user-profile')) setActivePage('user-profile');
//     else if (path.includes('/account-settings')) setActivePage('account-settings');
//     else if (path.includes('/security')) setActivePage('security');
//     else if (path.includes('/notifications')) setActivePage('notifications');
//     else setActivePage('dashboard');
//   }, [location]);

//   const handlePageChange = (page) => {
//     setActivePage(page);
//     navigate(`/${page}`);
//   };

//   return (
//     <div className="dashboard-container">
//       <TopNav 
//         activePage={activePage}
//         onPageChange={handlePageChange}
//         showUserDropdown={showUserDropdown}
//         setShowUserDropdown={setShowUserDropdown}
//       />
      
//       <LeftSidebar 
//         activePage={activePage}
//         onUploadCSV={() => setShowCSVModal(true)}
//       />
      
//       <main className="main-content">
//         {children}
//       </main>
      
//       <RightSidebar />
      
//       <CSVUploadModal 
//         isOpen={showCSVModal}
//         onClose={() => setShowCSVModal(false)}
//       />
//     </div>
//   );
// };

// export default DashboardLayout;

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
      
      <LeftSidebar 
        title={getSidebarTitle()}
        onUploadCSV={() => setShowCSVModal(true)}
      />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <RightSidebar />
      
      <CSVUploadModal 
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
      />
    </div>
  )
}

export default DashboardLayout