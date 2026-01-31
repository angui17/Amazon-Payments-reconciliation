import React, { useEffect, useMemo, useState } from "react";
import { getFeesPayments } from "../../../api/fees";

import "../../../styles/dashboard.css";

// table
import InpaymentsFeesTableHeaders from "./InpaymentsFeesTableHeaders";
import InpaymentsFeesTable from "./InpaymentsFeesTable";
import InpaymentsFeesTableSkeleton from "./InpaymentsFeesTableSkeleton";

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

const InpaymentsFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // details
  const [selectedFee, setSelectedFee] = useState(null);

  // ✅ paginación
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

  // ✅ si estás en una page que ya no existe 
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div className="page">
      <div className="content-header">
        <h1>Inpayments Fees</h1>
        <p>Process and monitor Amazon fees transactions</p>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* kpi cards */}
      <InpaymentsFeesKpiCards loading={loading} fees={filteredFees} />

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
      <div className="data-table">
        <div className="table-header">
          <h3>Inpayments Fees</h3>
        </div>

        <div className="table-container">
          <table className="table">
            <InpaymentsFeesTableHeaders />
            <tbody>
              <InpaymentsFeesTableSkeleton
                loading={loading}
                dataLength={filteredFees.length}
                colSpan={11}
                rows={10}
                emptyMessage="No fees found"
              />

              {!loading && filteredFees.length > 0 && <InpaymentsFeesTable rows={paginated} onView={setSelectedFee} />}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Pagination */}
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

      {/* charts */}
      <InpaymentsFeesCharts loading={loading} fees={filteredFees} />

      {/* details */}
      {selectedFee && (<InpaymentsFeeDetailsModal fee={selectedFee} onClose={() => setSelectedFee(null)} />)}
    </div>
  );
};

export default InpaymentsFees;
