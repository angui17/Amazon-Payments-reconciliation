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


const InpaymentsFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // details
  const [selectedFee, setSelectedFee] = useState(null);

  const fechaDesde = "10-01-2024";
  const fechaHasta = "10-31-2024";

  // ✅ paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getFeesPayments();
        console.log(data)
        setFees(data || []);
        setPage(1);
      } catch (err) {
        console.error("Error fetching inpayments fees", err);
        setError(err?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil((fees?.length || 0) / pageSize));
  }, [fees, pageSize]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (fees || []).slice(start, start + pageSize);
  }, [fees, page, pageSize]);

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
<InpaymentsFeesKpiCards loading={loading} fees={fees} />

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
                dataLength={fees.length}
                colSpan={11}
                rows={10}
                emptyMessage="No fees found"
              />

              {!loading && fees.length > 0 && <InpaymentsFeesTable rows={fees} onView={setSelectedFee} />}
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


{/* details */}
{selectedFee && (
  <InpaymentsFeeDetailsModal
    fee={selectedFee}
    onClose={() => setSelectedFee(null)}
  />
)}

    </div>
  );
};

export default InpaymentsFees;
