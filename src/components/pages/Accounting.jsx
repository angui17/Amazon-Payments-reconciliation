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

// filters
import AccountingFilters, { DEFAULT_ACCOUNTING_FILTERS } from "../accounting/AccountingFilters";

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
	// filters
	const [filters, setFilters] = useState(DEFAULT_ACCOUNTING_FILTERS);

	const fetchAccounting = async (f) => {
		setLoading(true);
		setSummary(null);
		setRows(null);
		setCharts(null);

		try {
			const apiFilters = {
				...f,
				fecha_desde: ymdToMdy(f.fecha_desde),
				fecha_hasta: ymdToMdy(f.fecha_hasta),
			};

			const resp = await getAccounting(apiFilters);

			setSummary(resp.summary);
			setRows(resp.rows || []);
			setCharts(resp.charts || null);
		} catch (e) {
			console.error("Error fetching accounting:", e);
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchAccounting(filters);
	}, []);


	const handleApply = (nextFilters) => {
		setFilters(nextFilters);
		fetchAccounting(nextFilters);
	};

	const getRowStatus = (r) => {
		const raw = r?.status ?? r?.STATUS ?? r?.Status ?? "";
		return String(raw).toUpperCase();
	};

	const allRows = rows || [];

	// 1) status filter
	const statusFiltered =
		filters.status === "ALL"
			? allRows
			: allRows.filter((r) => getRowStatus(r) === String(filters.status).toUpperCase());

	// 2) limit_records 
	const limitN = Math.max(1, Number(filters.limit_records) || 50);

	const filteredRows = statusFiltered.slice(0, limitN);

	return (
		<div className="main-content page active">
			<div className="content-header" style={{ marginBottom: "20px" }}>
				<h1>Accounting</h1>
				<p>Overview of accounting settlements and financial reconciliation.</p>
			</div>

			{/* kpi cards */}
			{filteredRows.length > 0 ? <AccountingKPIs summary={summary} rows={filteredRows} loading={loading} /> : null}

			{/* filters */}
			<AccountingFilters value={filters} onApply={handleApply} />

			{/* table */}
			{loading || filteredRows === null ? (
				<AccountingTableSkeleton rows={6} />
			) : filteredRows.length === 0 ? (
				<div className="orders-empty">
					No records found for the selected filters.
				</div>
			) : (
				<AccountingTable rows={filteredRows} onDetails={(row) => { setSelectedRow(row), setDetailsOpen(true) }} />
			)}

			{/* charts */}
			{filteredRows.length > 0 ? <AccountingCharts charts={charts} rows={filteredRows} loading={loading} /> : null}

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
