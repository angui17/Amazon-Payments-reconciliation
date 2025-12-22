// // Sidebar derecho con notificaciones

// import React from 'react';

// const RightSidebar = () => {
//   const systemMessages = [
//     { id: 1, message: 'Reconciliation job completed successfully', time: '2:15 PM' },
//     { id: 2, message: '15 new orders processed from Amazon SP-API', time: '2:10 PM' },
//     { id: 3, message: 'Settlement report processing started', time: '1:45 PM' },
//     { id: 4, message: 'SAP DI API connection established', time: '1:30 PM' }
//   ];

//   const userActivities = [
//     { id: 1, user: 'JD', action: 'John Doe uploaded settlement report', time: '2:05 PM' },
//     { id: 2, user: 'SM', action: 'Sarah Miller acknowledged 3 errors', time: '1:50 PM' },
//     { id: 3, user: 'AR', action: 'Admin reran failed payment jobs', time: '1:20 PM' }
//   ];

//   return (
//     <div className="right-sidebar">
//       <div className="sidebar-section">
//         <h3>System Messages</h3>
//         <div className="system-messages">
//           {systemMessages.map(msg => (
//             <div key={msg.id} className="message-item">
//               {msg.message}
//               <div className="message-time">{msg.time}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="sidebar-section">
//         <h3>User Activity</h3>
//         <div className="activity-log">
//           {userActivities.map(activity => (
//             <div key={activity.id} className="activity-item">
//               <div className="activity-avatar">{activity.user}</div>
//               <div className="activity-content">
//                 {activity.action}
//                 <div className="activity-time">{activity.time}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;

import React from 'react'

const RightSidebar = () => {
  const systemMessages = [
    { id: 1, message: 'Reconciliation job completed successfully', time: '2:15 PM', type: 'success' },
    { id: 2, message: '15 new orders processed from Amazon SP-API', time: '2:10 PM', type: 'info' },
    { id: 3, message: 'Settlement report processing started', time: '1:45 PM', type: 'info' },
    { id: 4, message: 'SAP DI API connection established', time: '1:30 PM', type: 'success' },
    { id: 5, message: 'Amazon API quota nearing limit (85%)', time: '1:15 PM', type: 'warning' }
  ]

  const userActivities = [
    { id: 1, user: 'JD', action: 'John Doe uploaded settlement report', time: '2:05 PM' },
    { id: 2, user: 'SM', action: 'Sarah Miller acknowledged 3 errors', time: '1:50 PM' },
    { id: 3, user: 'AR', action: 'Admin reran failed payment jobs', time: '1:20 PM' },
    { id: 4, user: 'TJ', action: 'Tom Johnson scheduled weekly report', time: '12:45 PM' }
  ]

  return (
    <div className="right-sidebar">
      <div className="sidebar-section">
        <h3>System Messages</h3>
        <div className="system-messages">
          {systemMessages.map(msg => (
            <div key={msg.id} className={`message-item ${msg.type}`}>
              <div className="message-icon">
                {msg.type === 'success' ? '✅' : msg.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.message}</div>
                <div className="message-time">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Recent Activity</h3>
        <div className="activity-log">
          {userActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-avatar">{activity.user}</div>
              <div className="activity-content">
                <div className="activity-text">{activity.action}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Quick Stats</h3>
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-label">Today's Processed</div>
            <div className="stat-value">1,247</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Success Rate</div>
            <div className="stat-value">96.5%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Avg. Processing</div>
            <div className="stat-value">45s</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar