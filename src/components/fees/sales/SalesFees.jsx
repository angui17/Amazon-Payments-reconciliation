import React, { useEffect, useMemo, useState, useRef } from "react";
import { getFeesSales } from "../../../api/fees";
// Estilos
import "../../../styles/dashboard.css";
// Table
import SalesFeesTable from "./SalesFeesTable";
// Details
import SalesFeeDetailsModal from "./SalesFeeDetailsModal";
// KPI
import SalesFeesKpiCards from "./SalesFeesKpiCards";
// Charts
import SalesFeesCharts from "../../charts/Fees/SalesFeesCharts";
// Filters
import SalesFeesFilters from "./SalesFeesFilters";
import { filterFees } from "../../../utils/feesFilters";
import { getUniqueValues } from "../../../utils/feesOptions";
import { ymdToMdy } from "../../../utils/dateUtils";
// pagination 
import SimplePagination from "../../common/SimplePagination";
import { paginate } from "../../../utils/pagination";
// export to pdf 
import { exportRowsToPdf } from "../../../utils/pdfExport/exportTableToPdf";
import { salesFeesPdfColumns } from "../../../utils/pdfExport/salesFeesPdfColumns";
import { totalFeesNet, feeTransactionsCount, topFeeTypeByImpact, avgFeePerSettlement } from "../../../utils/feesMath";

// fechas por defecto
const DEFAULT_FROM = "2025-04-01";
const DEFAULT_TO = "2025-04-30";

const SalesFees = () => {
  const [feesAll, setFeesAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // details
  const [selectedFee, setSelectedFee] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // filtros
  const [draftFilters, setDraftFilters] = useState({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    settlement: "",
    status: "",
    type: "",
    description: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    settlement: "",
    status: "",
    type: "",
    description: "",
  });

  // options
  const typeOptions = useMemo(() => getUniqueValues(feesAll, (f) => f.TYPE ?? f.type), [feesAll]);

  // filtered
  const filteredFees = useMemo(() => {
    return filterFees(feesAll, {
      settlementId: appliedFilters.settlement,
      status: appliedFilters.status,
      type: appliedFilters.type,
      description: appliedFilters.description,
      from: appliedFilters.from,
      to: appliedFilters.to,
    });
  }, [feesAll, appliedFilters]);


  // pagination
  const pagination = useMemo(
    () =>
      paginate({
        rows: filteredFees,
        page,
        pageSize,
      }),
    [filteredFees, page, pageSize]
  );

  const { page: safePage, totalItems, totalPages, visibleRows: paginated } = pagination;

  // keep page in sync if paginate clamps it
  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  // fetch
  const fetchFees = async ({ from, to } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      const fd = ymdToMdy(from);
      const fh = ymdToMdy(to);

      if (fd) params.fecha_desde = fd;
      if (fh) params.fecha_hasta = fh;

      const data = await getFeesSales(params);
      //   console.log(data)
      setFeesAll(data || []);
      setPage(1);
    } catch (err) {
      console.error("Error fetching sales fees", err);
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees({ from: DEFAULT_FROM, to: DEFAULT_TO });
  }, []);

  // export to pdf
  const chartsRef = useRef(null); // charts
  const handleExportPdf = async () => {
    const feesForKpis = paginated;

    const kpi1 = totalFeesNet(feesForKpis);
    const kpi2 = feeTransactionsCount(feesForKpis);
    const kpi3 = topFeeTypeByImpact(feesForKpis);
    const kpi4 = avgFeePerSettlement(feesForKpis);

    await new Promise((r) => requestAnimationFrame(r));
    const chartImages = chartsRef.current?.getChartImages?.() || [];

    const headerBlocks = [
      { label: "Total Fees (net)", value: String(kpi1 ?? "—") },
      { label: "Fee transactions", value: String(kpi2 ?? "—") },
      { label: "Top fee type", value: String(kpi3 ?? "—") },
      { label: "Avg per settlement", value: String(kpi4 ?? "—") },
    ];

    exportRowsToPdf({
      rows: paginated,
      columns: salesFeesPdfColumns,
      title: `Sales Fees (${appliedFilters.from || "-"} → ${appliedFilters.to || "-"})`,
      fileName: `sales_fees_${appliedFilters.from || "from"}_${appliedFilters.to || "to"}_page_${safePage}.pdf`,
      orientation: "l",
      headerBlocks,
      chartImages,
      footerNote: `page=${safePage}/${totalPages} | pageSize=${pageSize} | total=${totalItems}`,
    });
  };

  return (
    <div className="page">
      <div className="content-header">
        <h1>Sales Fees</h1>
        <p>Process and monitor Amazon fees transactions</p>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* KPI */}
      {filteredFees.length > 0 ? <SalesFeesKpiCards loading={loading} fees={paginated} /> : null}

      {/* Filters */}
      <SalesFeesFilters
        value={draftFilters}
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
          const reset = {
            from: DEFAULT_FROM,
            to: DEFAULT_TO,
            settlement: "",
            status: "",
            type: "",
            description: "",
          };

          setDraftFilters(reset);
          setAppliedFilters(reset);
          setPage(1);

          fetchFees({ from: DEFAULT_FROM, to: DEFAULT_TO });
        }}

      />

      {/* Table */}
      {filteredFees.length > 0 ?
        <SalesFeesTable
          title="Sales Fees"
          loading={loading}
          rows={paginated}
          totalItems={totalItems}
          pageSize={pageSize}
          onView={setSelectedFee}
          onExportPdf={handleExportPdf}
        />
        : <div style={{ margin: "40px 0", textAlign: "center", color: "gray" }}>
          {loading ? "Loading fees..." : "No fees found for the selected filters."}
        </div>
      }

      {/* Pagination */}
      {filteredFees.length > 0 ? (
        <SimplePagination
          page={safePage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      ) : null}


      {/* Charts */}
      {filteredFees.length > 0 ? <SalesFeesCharts ref={chartsRef} loading={loading} fees={paginated} /> : null}

      {/* Details */}
      {selectedFee && (
        <SalesFeeDetailsModal
          fee={selectedFee}
          onClose={() => setSelectedFee(null)}
        />
      )}
    </div>
  );
};

export default SalesFees;
