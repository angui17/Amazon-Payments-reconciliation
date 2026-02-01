import React, { useEffect, useState } from 'react'

import { getAccounting } from "../../api/accounting";
import { ymdToMdy } from "../../utils/dateUtils";

// kpi cards
import AccountingKPIs from "../accounting/AccountingKPIs";

// table
import AccountingTable from '../accounting/AccountingTable';
import AccountingTableSkeleton from '../accounting/AccountingTableSkeleton';
// details
import AccountingDetailsModal from "../accounting/AccountingDetailsModal";
// charts
import AccountingCharts from "../accounting/AccountingCharts";

const DEFAULT_FILTERS = {
	fecha_desde: "2025-01-01",
	fecha_hasta: "2025-01-31",
	status: "ALL",
	limit_records: 50,
};

const Accounting = () => {
	// kpi cards 
	const [loading, setLoading] = useState(false);
	const [summary, setSummary] = useState(null);
	// table
	const [rows, setRows] = useState(null)
	//details
	const [selectedRow, setSelectedRow] = useState(null);
	const [detailsOpen, setDetailsOpen] = useState(false);

	// charts
	const [charts, setCharts] = useState(null);


	const fetchAccounting = async () => {
		setLoading(true);
		setSummary(null);
		setRows(null)
		setCharts(null);
		
		try {
			const apiFilters = {
				...DEFAULT_FILTERS,
				fecha_desde: ymdToMdy(DEFAULT_FILTERS.fecha_desde),
				fecha_hasta: ymdToMdy(DEFAULT_FILTERS.fecha_hasta),
			};

			const resp = await getAccounting(apiFilters);
			setSummary(resp.summary);
			setRows(resp.rows || []);
			setCharts(resp.charts || null);
			console.log("ACCOUNTING WS 269:", resp);
		} catch (e) {
			console.error("Error fetching accounting:", e);
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchAccounting();
	}, []);

	return (
		<div className="main-content page active">
			<div className="content-header" style={{ marginBottom: "20px" }}>
				<h1>Accounting</h1>
				<p>Overview of accounting settlements and financial reconciliation.</p>
			</div>

			{/* kpi cards */}
			<AccountingKPIs summary={summary} loading={loading} />

			{/* filters */}

			{/* table */}
			{loading || rows === null ? (
				<AccountingTableSkeleton rows={6} />
			) : (
				<AccountingTable rows={rows} onDetails={(row) => { setSelectedRow(row), setDetailsOpen(true) }} />
			)}

			{/* charts */}
			<AccountingCharts charts={charts} loading={loading} />

			{/* details */}
			<AccountingDetailsModal
				open={detailsOpen}
				row={selectedRow}
				onClose={() => setDetailsOpen(false)}
			/>
		</div>

	)
}

export default Accounting
