import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// cards
import AccountingInfoCard from "./settlement/AccountingInfoCard";
import { getAccountingSettlementDetails } from "../../api/accounting";
// table
import AccountingSettlementDetailTable from "./settlement/AccountingSettlementDetailTable";
import AccountingSettlementDetailTableSkeleton from "./settlement/AccountingSettlementDetailTableSkeleton";

// pagination
import SimplePagination from "../common/SimplePagination";
// charts
import AccountingSettlementBreakdownsCharts from "./settlement/AccountingSettlementBreakdownsCharts";


const AccountingSettlementDetail = () => {
    const { settlementId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation()

    const row = useMemo(() => state?.row ?? null, [state]);
    // details state 
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    // paginación
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const resp = await getAccountingSettlementDetails({ settlementId });
            console.log("resp", resp);
            setDetails(resp)
            setPage(1)
        } catch (err) {
            console.error("WS 266 → error:", err);
            setDetails(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!settlementId) return;
        fetchDetails();
    }, [settlementId]);

    const allRows = useMemo(() => details?.rows ?? [], [details])
    const totalItems = allRows.length

    const pageRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return allRows.slice(start, start + pageSize);
    }, [allRows, page, pageSize]);

    const handlePageChange = (nextPage) => setPage(nextPage);

    const handlePageSizeChange = (nextSize) => {
        setPageSize(nextSize);
        setPage(1);
    };

    return (
        <div className="main-content page active">
            <div
                className="content-header"
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <div>
                    <h1>Settlement: <span style={{ color: "#cc5500" }}>{settlementId}</span></h1>
                    <p>Detailed accounting information for the selected settlement.</p>
                </div>

                <button className="chart-action" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>

            {/* Cards */}
            {row ? (
                <AccountingInfoCard row={row} />
            ) : (
                <div className="card" style={{ padding: 14 }}>
                    <div className="empty-row">
                        No row data received. Open this page from the table to see the cards.
                    </div>
                </div>
            )}

            {/* Detail table */}
            {loading ? (
                <AccountingSettlementDetailTableSkeleton rows={10} />
            ) : (
                <AccountingSettlementDetailTable rows={pageRows} />
            )}

            {/* Pagination */}
            <SimplePagination
                page={page}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(next) => {
                    setPageSize(next);
                    setPage(1);
                }}
                pageSizeOptions={[10, 25, 50, 100]}
            />

            <AccountingSettlementBreakdownsCharts
                loading={loading}
                breakdownByAmountDescription={details?.breakdownByAmountDescription ?? []}
                breakdownByType={details?.breakdownByType ?? []}
            />

        </div>
    );
};

export default AccountingSettlementDetail;
