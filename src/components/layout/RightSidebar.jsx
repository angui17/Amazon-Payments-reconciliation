import React from 'react'

const RightSidebar = () => {

  const userActivities = [
    { id: 1, user: 'JD', action: 'John Doe uploaded settlement report', time: '2:05 PM' },
    { id: 2, user: 'SM', action: 'Sarah Miller acknowledged 3 errors', time: '1:50 PM' },
    { id: 3, user: 'AR', action: 'Admin reran failed payment jobs', time: '1:20 PM' },
    { id: 4, user: 'TJ', action: 'Tom Johnson scheduled weekly report', time: '12:45 PM' }
  ]

  return (
    <div className="right-sidebar">
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
    </div>
  )
}

export default RightSidebar