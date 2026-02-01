import React from 'react'

const KPICard = ({ title, value, change, trend }) => {
	return (
		<div className={`kpi-card kpi-${trend || 'neutral'}`}>
			<div className="kpi-title">{title}</div>
			<div className="kpi-value">{value}</div>
			{change != null && <div className="kpi-change">{change}</div>}
		</div>
	)
}

export default KPICard
