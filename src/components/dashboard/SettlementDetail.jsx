import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import SettlementInfoCard from "./settlement/SettlementInfoCard";
import { getADashboardSettlementDetails, getSapInvoicesBySettlement } from "../../api/dashboard";

import SettlementKPIs from "./settlement/SettlementKPIs";
import SettlementExtras from "./settlement/SettlementExtras";
//tables
import SettlementRowsTable from "./settlement/SettlementRowsTable";
import SettlementRowsTableSkeleton from "./settlement/SettlementRowsTableSkeleton";
import SapInvoicesTableSection from "./settlement/SapInvoicesTableSection";

import SimplePagination from "../common/SimplePagination";
import { paginate } from "../../utils/pagination"

const DashboardSettlementDetail = () => {
    const navigate = useNavigate();
    const { settlementId } = useParams();
    const { state } = useLocation();

    const row = state?.row || null;

    // details state 
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    // paginación state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // sap invoices state (WS 280)
    const [sapInvoices, setSapInvoices] = useState([]);
    // pagination SAP
    const [invPage, setInvPage] = useState(1);
    const [invPageSize, setInvPageSize] = useState(10);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const resp = await getADashboardSettlementDetails({ settlementId });
            setDetails(resp);

            const data = await getSapInvoicesBySettlement({ settlementId })
            setSapInvoices(Array.isArray(data) ? data : []);

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

    useEffect(() => {
        setPage(1);
    }, [settlementId]);

    useEffect(() => {
        setInvPage(1);
    }, [settlementId]);

    const summary = details?.summary || null;
    const infoSource = summary || row;

    const allRows = details?.rows || [];
    const totalRows = allRows.length;

    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    const safePage = Math.min(page, totalPages);

    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    const pageRows = allRows.slice(start, end);

    const invPg = paginate({
        rows: sapInvoices,
        page: invPage,
        pageSize: invPageSize,
    });

    const invoicesRows = invPg.visibleRows;
    const sapInvoicesCount = Array.isArray(sapInvoices) ? sapInvoices.length : 0;

    const mergedInfoSource = {
        ...(infoSource || {}),
        sapInvoicesCount,
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

            {/* Info */}
            <SettlementInfoCard
                row={infoSource}
                allowKeys={[
                    "settlementId",
                    "depositDateDate",
                    "status",
                    "amazonTotalReported",
                    "sapPaymentsTotal",
                    "difference",
                    "sapInvoicesCount",
                    "amazonInternalDiff",
                    "reconciled",
                ]}
            />

            {/* KPIs */}
            <SettlementKPIs summary={summary} loading={loading} sapInvoicesCount={sapInvoicesCount} />

            {/* Table paginada */}
            {loading ? (
                <SettlementRowsTableSkeleton rows={pageSize} />
            ) : (
                <SettlementRowsTable rows={pageRows} />
            )}

            {/* Pagination */}
            <SimplePagination
                page={safePage}
                totalItems={totalRows}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(n) => {
                    setPageSize(n);
                    setPage(1);
                }}
            />

            {/* Charts */}
            <SettlementExtras details={details} summary={summary} loading={loading} />

            {/* SAP Invoices table */}
            {invoicesRows.length > 0 ?
                <SapInvoicesTableSection
                    loading={loading}
                    rows={invoicesRows}
                    skeletonRows={invPageSize}
                />
                : null
            }

            {sapInvoices.length > 0 ?
                <SimplePagination
                    page={invPg.page}
                    totalItems={invPg.totalItems}
                    pageSize={invPageSize}
                    onPageChange={setInvPage}
                    onPageSizeChange={(n) => {
                        setInvPageSize(n);
                        setInvPage(1);
                    }}
                />
                : null}

        </div>
    );
};

export default DashboardSettlementDetail;
