import React, { useEffect, useState, useRef } from 'react'

import { getAccounting, getMissingFeeAccounts } from "../../api/accounting";
import { ymdToMdy } from "../../utils/dateUtils";

// kpi cards
import AccountingKPIs from "../accounting/AccountingKPIs";
import ReconciliationHealthCard from "../accounting/ReconciliationHealthCard";

// table
import AccountingTable from '../accounting/AccountingTable';
import AccountingTableSkeleton from '../accounting/AccountingTableSkeleton';

// details
import AccountingDetailsModal from "../accounting/AccountingDetailsModal";

// charts
import AccountingCharts from "../accounting/AccountingCharts";

// filters
import AccountingFilters, { DEFAULT_ACCOUNTING_FILTERS } from "../accounting/AccountingFilters";
import { effectiveStatusFromDiff } from "../../utils/settlementsTableUtils";

// Export to pdf
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";
import { accountingPdfColumns } from "../../utils/pdfExport/accountingPdfColumns";
import { computeAccountingKpis, accountingKpisToHeaderBlocks } from "../../utils/accountingKpis";

// Collapsable
import ExceptionsCollapse from "../accounting/ExceptionsCollapse";
//Aging
import PendingSettlementsAging from "../accounting/PendingSettlementsAging";

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
	// pdf
	const chartsRef = useRef(null);
	// collapse
	const [missingFeeSummary, setMissingFeeSummary] = useState(null);
	const [missingFeeRows, setMissingFeeRows] = useState([]);

	const fetchAccounting = async (f) => {
		setLoading(true);
		setSummary(null);
		setRows(null);
		setCharts(null);
		setMissingFeeSummary(null);
		setMissingFeeRows([]);

		try {
			const { status, ...rest } = f;
			const apiFilters = {
				...rest,
				fecha_desde: ymdToMdy(f.fecha_desde),
				fecha_hasta: ymdToMdy(f.fecha_hasta),
			};

			const resp = await getAccounting(apiFilters);
			setSummary(resp.summary);
			setRows(resp.rows || []);
			setCharts(resp.charts || null);

			const data = await getMissingFeeAccounts(apiFilters)
			setMissingFeeSummary(data?.summary ?? null);
			setMissingFeeRows(data?.rows ?? []);
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

	const allRows = rows || [];
	const getEffectiveStatus = (r) => effectiveStatusFromDiff(r?.diffPayments);

	// 1) status filter (basado en diffPayments)
	const statusFiltered =
		filters.status === "ALL"
			? allRows
			: allRows.filter(
				(r) => getEffectiveStatus(r) === String(filters.status).toUpperCase()
			);

	// 2) limit_records 
	const limitN = Math.max(1, Number(filters.limit_records) || 50);

	const filteredRows = statusFiltered.slice(0, limitN);

	const handleExportPdf = async () => {
		const kpis = computeAccountingKpis({ rows: filteredRows, summary });
		const headerBlocks = accountingKpisToHeaderBlocks(kpis);

		let chartImages = [];
		try {
			if (chartsRef.current?.getChartImages) {
				chartImages = await chartsRef.current.getChartImages();
			}
		} catch (e) {
			console.warn("Could not capture chart images:", e);
		}

		exportRowsToPdf({
			rows: filteredRows,
			columns: accountingPdfColumns,
			title: `Accounting (${filters.fecha_desde} → ${filters.fecha_hasta})`,
			fileName: `accounting_${filters.fecha_desde}_${filters.fecha_hasta}.pdf`,
			orientation: "l",
			headerBlocks,
			footerNote: `Filters: status=${filters.status} | limit=${filters.limit_records}`,
			chartImages,
		});
	};

	return (
		<div className="main-content page active">
			<div className="content-header" style={{ marginBottom: "20px" }}>
				<h1>Accounting</h1>
				<p>Overview of accounting settlements and financial reconciliation.</p>
			</div>

			{/* Health card */}
			<ReconciliationHealthCard summary={summary} loading={loading} />

			<PendingSettlementsAging
				rows={allRows}
				loading={loading}
				amountAccessor={(r) => r?.diffPayments ?? r?.difference ?? 0}
				pendingPredicate={(r) => {
					const n = Number(r?.diffPayments ?? r?.difference ?? 0);
					return Number.isFinite(n) && Math.abs(n) >= 0.005;
				}}
			/>

			{/* kpi cards */}
			{filteredRows.length > 0 ? <AccountingKPIs summary={summary} rows={filteredRows} loading={loading} /> : null}

			{/* Collapsable */}
			<ExceptionsCollapse
				defaultOpen={false}
				missingFeeSummary={missingFeeSummary}
				missingFeeRows={missingFeeRows}
			/>

			{/* filters */}
			<AccountingFilters value={filters} onApply={handleApply} />

			{/* table */}
			{loading || filteredRows === null
				? (<AccountingTableSkeleton rows={6} />)
				: filteredRows.length === 0
					? (<div className="orders-empty"> No records found for the selected filters. </div>)
					: (<AccountingTable
						rows={filteredRows}
						onDetails={(row) => { setSelectedRow(row), setDetailsOpen(true) }}
						onExportPdf={handleExportPdf}
					/>
					)}

			{/* charts */}
			{filteredRows.length > 0
				? <AccountingCharts charts={charts} rows={filteredRows} loading={loading} ref={chartsRef} />
				: null}

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
