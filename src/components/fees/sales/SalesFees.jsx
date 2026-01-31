import React, { useEffect, useMemo, useState } from "react";
import { getFeesSales } from "../../../api/fees";

import "../../../styles/dashboard.css";

// Table
import SalesFeesTableHeaders from "./SalesFeesTableHeaders";
import SalesFeesTableSkeleton from "./SalesFeesTableSkeleton";
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

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

const SalesFees = () => {
  const [feesAll, setFeesAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // details
  const [selectedFee, setSelectedFee] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ filtros
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
  const typeOptions = useMemo(
    () => getUniqueValues(feesAll, (f) => f.TYPE ?? f.type),
    [feesAll]
  );

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
  }, [
    feesAll,
    appliedFilters.settlement,
    appliedFilters.status,
    appliedFilters.type,
    appliedFilters.description,
    appliedFilters.from,
    appliedFilters.to,
  ]);

  // pagination
  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil((filteredFees?.length || 0) / pageSize));
  }, [filteredFees, pageSize]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (filteredFees || []).slice(start, start + pageSize);
  }, [filteredFees, page, pageSize]);

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
      console.log(data)
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

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div className="page">
      <div className="content-header">
        <h1>Sales Fees</h1>
        <p>Process and monitor Amazon fees transactions</p>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* KPI */}
      <SalesFeesKpiCards loading={loading} fees={filteredFees} />

      {/* Filters */}
      {/* <SalesFeesFilters
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
          const empty = {
            from: "",
            to: "",
            settlement: "",
            status: "",
            type: "",
            description: "",
          };

          setDraftFilters(empty);
          setAppliedFilters(empty);
          setPage(1);
          fetchFees();
        }}
      /> */}

      {/* Table */}
      <div className="data-table">
        <div className="table-header">
          <h3>Sales Fees</h3>
        </div>

        <div className="table-container">
          <table className="table">
            <SalesFeesTableHeaders />
            <tbody>
              <SalesFeesTableSkeleton
                loading={loading}
                dataLength={filteredFees.length}
                colSpan={11}
                rows={pageSize}
                emptyMessage="No fees found"
              />

              {!loading && filteredFees.length > 0 && (
                <SalesFeesTable
                  rows={paginated}
                  onView={setSelectedFee}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="simple-pagination">
        <div className="simple-pagination-left">
          <button
            className="simple-pagination-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          <button
            className="simple-pagination-btn"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
          >
            Next
          </button>
        </div>

        <div className="simple-pagination-info">
          <span>
            Page <strong>{page}</strong> of {pageCount} •
          </span>

          <select
            className="simple-pagination-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <SalesFeesCharts loading={loading} fees={filteredFees} />

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
