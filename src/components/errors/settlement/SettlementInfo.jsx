import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getSettlementErrorsDetail } from "../../../api/error";

// cards info
import ErrorInfoCard from "./ErrorInfoCard";
// table
import SettlementErrorsDetailTable from "./SettlementErrorsDetailTable";
import SettlementErrorsDetailTableSkeleton from "./SettlementErrorsDetailTableSkeleton";
// pagination
import SimplePagination from "../../common/SimplePagination";
// charts
import SettlementBreakdownsCharts from "./SettlementBreakdownsCharts";

const SettlementInfo = () => {
    const navigate = useNavigate();
    const { settlementId } = useParams();
    const { state } = useLocation()

    const row = state?.row || null;

    // details state 
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    // paginación
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const resp = await getSettlementErrorsDetail({ settlementId });
            console.log("resp", resp);
            setDetails(resp)
            setPage(1)
        } catch (err) {
            console.error("WS 268 → error:", err);
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
                    <p>Detailed information for the selected settlement.</p>
                </div>

                <button className="chart-action" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>
            <ErrorInfoCard row={row} />

            {loading ? (
                <SettlementErrorsDetailTableSkeleton rows={10} />
            ) : (
                <SettlementErrorsDetailTable rows={pageRows} />
            )}

            <SimplePagination
                page={page}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 25, 50, 100]}
            />

            <SettlementBreakdownsCharts
                loading={loading}
                breakdownByAmountDescription={details?.breakdownByAmountDescription ?? []}
                breakdownByType={details?.breakdownByType ?? []}
            />
        </div>
    );
};

export default SettlementInfo;