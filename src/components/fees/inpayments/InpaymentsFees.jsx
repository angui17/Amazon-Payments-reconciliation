import React, { useEffect, useMemo, useState, useRef } from "react";
import { getFeesPayments } from "../../../api/fees";

import "../../../styles/dashboard.css";
// table
import InpaymentsFeesTableCard from "./InpaymentsFeesTableCard";
// pagination
import SimplePagination from "./SimplePagination"
// kpi cards
import InpaymentsFeesKpiCards from "./InpaymentsFeesKpiCards";
// details
import InpaymentsFeeDetailsModal from "./InpaymentsFeeDetailsModal";
// charts
import InpaymentsFeesCharts from "../../charts/Fees/InpaymentsFeesCharts";
// filters
import InpaymentsFeesFiltersBar from "./InpaymentsFeesFiltersBar";
import { filterFees } from "../../../utils/feesFilters";
import { getUniqueValues } from "../../../utils/feesOptions";
import { ymdToMdy } from "../../../utils/dateUtils"
// export to pdf
import { exportRowsToPdf } from "../../../utils/pdfExport/exportTableToPdf";
import { inpaymentsFeesPdfColumns } from "../../../utils/pdfExport/inpaymentsFeesPdfColumns";
import {
  totalInpaymentsNet,
  inpaymentsRowsCount,
  topFeeConceptByAbs,
  reserveMovementNet,
} from "../../../utils/inpaymentsMath";


const InpaymentsFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // details
  const [selectedFee, setSelectedFee] = useState(null);

  // paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtros 
  const DEFAULT_FROM = "2024-10-01";
  const DEFAULT_TO = "2024-10-31";

  const [draftFilters, setDraftFilters] = useState({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    amountDesc: "",
    status: "",
    type: "",
    settlement: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    amountDesc: "",
    status: "",
    type: "",
    settlement: "",
  });

  const amountDescOptions = useMemo(
    () => getUniqueValues(fees, f => f.AMOUNT_DESCRIPTION ?? f.amount_description),
    [fees]
  );

  const typeOptions = useMemo(
    () => getUniqueValues(fees, f => f.TYPE ?? f.type),
    [fees]
  );

  const filteredFees = useMemo(() => {
    return filterFees(fees, {
      amountDesc: appliedFilters.amountDesc,
      status: appliedFilters.status,
      type: appliedFilters.type,
      settlementId: appliedFilters.settlement,
      from: appliedFilters.from,
      to: appliedFilters.to,
    });
  }, [
    fees,
    appliedFilters.amountDesc,
    appliedFilters.status,
    appliedFilters.type,
    appliedFilters.settlement,
    appliedFilters.from,
    appliedFilters.to,
  ]);

  // Paginacion
  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil((filteredFees?.length || 0) / pageSize));
  }, [filteredFees, pageSize]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (filteredFees || []).slice(start, start + pageSize);
  }, [filteredFees, page, pageSize]);

  const fetchFees = async ({ from, to } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      const fd = ymdToMdy(from);
      const fh = ymdToMdy(to);

      if (fd) params.fecha_desde = fd;
      if (fh) params.fecha_hasta = fh;

      const data = await getFeesPayments(params);
      setFees(data || []);
      setPage(1);
    } catch (err) {
      console.error("Error fetching inpayments fees", err);
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees({ from: DEFAULT_FROM, to: DEFAULT_TO });
  }, []);

  // si estás en una page que ya no existe 
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  // export to pdf
  const chartsRef = useRef(null);

  const handleExportPdf = async () => {
    const feesForKpis = filteredFees;

    const kpi1 = totalInpaymentsNet(feesForKpis);
    const kpi2 = inpaymentsRowsCount(feesForKpis);
    const kpi3 = topFeeConceptByAbs(feesForKpis);
    const kpi4 = reserveMovementNet(feesForKpis);

    const headerBlocks = [
      { label: "Total Fees Net", value: String(kpi1 ?? "—") },
      { label: "Fee Rows", value: String(kpi2 ?? "—") },
      { label: "Top Fee Concept", value: String(kpi3 ?? "—") },
      { label: "Reserve Movement", value: String(kpi4 ?? "—") },
    ];

    await new Promise((r) => setTimeout(r, 50));
    const chartImages = chartsRef.current?.getChartImages?.() || [];

    exportRowsToPdf({
      rows: filteredFees,
      columns: inpaymentsFeesPdfColumns,
      title: `Inpayments Fees (${appliedFilters.from || "-"} → ${appliedFilters.to || "-"})`,
      fileName: `inpayments_fees_${appliedFilters.from || "from"}_${appliedFilters.to || "to"}_page_${page}.pdf`,
      orientation: "l",
      headerBlocks,
      chartImages,
      footerNote: `page=${page}/${pageCount} | pageSize=${pageSize} | total=${filteredFees.length}`,
    });
  };


  return (
    <div className="page">
      <div className="content-header">
        <h1>Inpayments Fees</h1>
        <p>Process and monitor Amazon fees transactions</p>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* kpi cards */}
      {filteredFees.length > 0 ?
        <InpaymentsFeesKpiCards loading={loading} fees={filteredFees} />
        : null}

      {/* Filters */}
      <InpaymentsFeesFiltersBar
        value={draftFilters}
        amountDescOptions={amountDescOptions}
        typeOptions={typeOptions}
        onChange={(v) => {
          setDraftFilters(v);
          setPage(1);
        }}
        onApply={() => {
          setAppliedFilters(draftFilters);
          setPage(1);
          fetchFees({ from: draftFilters.from, to: draftFilters.to });
        }}
        onClear={() => {
          const empty = {
            from: "",
            to: "",
            amountDesc: "",
            status: "",
            type: "",
            settlement: "",
          };

          setDraftFilters(empty);
          setAppliedFilters(empty);
          setPage(1);

          fetchFees();
        }}
      />

      {/* Table */}
      {filteredFees.length > 0 ?
        <InpaymentsFeesTableCard
          title="Inpayments Fees"
          loading={loading}
          rows={paginated}
          totalItems={filteredFees.length}
          pageSize={pageSize}
          onView={setSelectedFee}
          onExportPdf={handleExportPdf}
        />
        : <p className="text-center">No fees found for the selected filters.</p>}

      {/* Pagination */}
      {filteredFees.length > 0 ?
        <SimplePagination
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 25]}
          onPageChange={(nextPage) => setPage(nextPage)}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPage(1);
          }}
        />
        : null}

      {/* charts */}
      {filteredFees.length > 0 ?
        <InpaymentsFeesCharts loading={loading} fees={filteredFees} ref={chartsRef} />
        : null}

      {/* details */}
      {selectedFee && (<InpaymentsFeeDetailsModal fee={selectedFee} onClose={() => setSelectedFee(null)} />)}
    </div>
  );
};

export default InpaymentsFees;
