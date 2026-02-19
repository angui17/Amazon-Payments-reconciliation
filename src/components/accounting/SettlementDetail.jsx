import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSapInvoicesBySettlement } from "../../api/accounting";

// cards
import AccountingInfoCard from "./settlement/AccountingInfoCard";
import { getAccountingSettlementDetails, JournalEntries, exceptionsSettlement } from "../../api/accounting";
import { effectiveStatusFromDiff } from "../../utils/settlementsTableUtils";

// table
import AccountingSettlementDetailTable from "./settlement/AccountingSettlementDetailTable";
import AccountingSettlementDetailTableSkeleton from "./settlement/AccountingSettlementDetailTableSkeleton";

// pagination
import SimplePagination from "../common/SimplePagination";
// charts
import AccountingSettlementBreakdownsCharts from "./settlement/AccountingSettlementBreakdownsCharts";
// collapsable
import JournalEntriesCollapse from "./settlement/JournalEntriesCollapse";
import { parseWs282Item } from "../../utils/ws282";
import ExpectedPostedFeesByAccount from "./settlement/ExpectedPostedFeesByAccount";
import JournalDiagnostics282 from "./settlement/JournalDiagnostics282";


const AccountingSettlementDetail = () => {
    const { settlementId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation()

    const row = useMemo(() => state?.row ?? null, [state]);

    const [sapInvoices, setSapInvoices] = useState([]);
    const sapInvoicesCount = useMemo(
        () => (Array.isArray(sapInvoices) ? sapInvoices.length : 0),
        [sapInvoices]
    );

    const cardRow = useMemo(() => {
        if (!row) return null;

        const diff = row?.diffPayments ?? row?.difference ?? row?.diff ?? 0;
        const status = effectiveStatusFromDiff(diff);

        return {
            ...row,
            status,
            sapInvoicesCount,
        };
    }, [row, sapInvoicesCount]);


    // details state 
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    // paginación
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // Journal 
    const [journalData, setJournalData] = useState(null);
    const [exceptionsData, setExceptionsData] = useState(null);
    const [exceptionsLoading, setExceptionsLoading] = useState(false);

    const [diagnostics282, setDiagnostics282] = useState(null);
    const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const resp = await getAccountingSettlementDetails({ settlementId });
            setDetails(resp)

            const data = await JournalEntries({ settlementId })
            setJournalData(data);

            const inv = await getSapInvoicesBySettlement({ settlementId });
            setSapInvoices(Array.isArray(inv) ? inv : []);

            setPage(1)
        } catch (err) {
            console.error("Error:", err);
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

    useEffect(() => {
        if (!settlementId) return;

        const fetchDiagnostics = async () => {
            setDiagnosticsLoading(true);
            try {
                const resp = await exceptionsSettlement({ settlementId }); // WS 282
                const parsed = parseWs282Item(resp?.[0] ?? null);
                setDiagnostics282(parsed);
            } catch (e) {
                console.error("WS 282 → error:", e);
                setDiagnostics282(null);
            } finally {
                setDiagnosticsLoading(false);
            }
        };

        fetchDiagnostics();
    }, [settlementId]);


    const journalHeadersCount = journalData?.summary?.journalHeadersCount ?? null;
    const showExceptions = journalHeadersCount === 0;

    const shouldShowDiagnostics = diagnosticsLoading || diagnostics282 || Number(journalData?.summary?.journalHeadersCount ?? 0) === 0;

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
            {cardRow
                ? <AccountingInfoCard row={cardRow} />
                : <div className="card" style={{ padding: 14 }}>
                    <div className="empty-row">
                        No row data received. Open this page from the table to see the cards.
                    </div>
                </div>
            }

            <JournalEntriesCollapse
                journalData={journalData}
                defaultOpen={false}
                exceptionsData={exceptionsData}
                exceptionsLoading={exceptionsLoading}
            />

            <ExpectedPostedFeesByAccount
                expectedFeesByAccount={journalData?.expectedFeesByAccount ?? []}
                lines={journalData?.lines ?? []}
            />

            {shouldShowDiagnostics ?
                <JournalDiagnostics282
                    settlementId={settlementId}
                    data={diagnostics282}
                    loading={diagnosticsLoading}
                    defaultOpen={false}
                />
                : null}

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
