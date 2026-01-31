import React, { useEffect, useMemo, useState } from "react";
import { getFeesSales } from "../../../api/fees";

// Estilos
import "../../../styles/dashboard.css";

// Table
import SalesFeesTableHeaders from "./SalesFeesTableHeaders";
import SalesFeesTableSkeleton from "./SalesFeesTableSkeleton";
import SalesFeesTable from "./SalesFeesTable";

// Details
import SalesFeeDetailsModal from "./SalesFeeDetailsModal";

// kpi cards
import SalesFeesKpiCards from "./SalesFeesKpiCards";

// charts
import SalesFeesCharts from "../../charts/Fees/SalesFeesCharts";

// filters
import { filterFees, lastNDaysRange } from "../../../utils/feesFilters";
import SalesFeesFilters from "./SalesFeesFilters";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

const DEFAULT_FILTERS = {
    from: "",
    to: "",
    last: "",
    settlementId: "",
    types: [],
    description: "",
    status: "",
};

const SalesFees = () => {
    const [feesAll, setFeesAll] = useState([]); // ✅ antes era fees
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ faltaban
    const [filtersDraft, setFiltersDraft] = useState(DEFAULT_FILTERS);
    const [filtersApplied, setFiltersApplied] = useState(DEFAULT_FILTERS);

    // paginación
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // details
    const [selectedFee, setSelectedFee] = useState(null);

    const fechaDesde = "10-01-2024";
    const fechaHasta = "10-31-2024";

    const typeOptions = useMemo(() => {
        const set = new Set(
            (feesAll || [])
                .map((f) => String(f.TYPE || "").trim())
                .filter(Boolean)
        );
        return Array.from(set).sort();
    }, [feesAll]);

    const statusOptions = useMemo(() => {
        const set = new Set(
            (feesAll || [])
                .map((f) => String(f.STATUS ?? f.status ?? "").trim())
                .filter(Boolean)
        );
        return Array.from(set).sort();
    }, [feesAll]);

    // ✅ este es el array que alimenta TODO
    const filteredFees = useMemo(
        () => filterFees(feesAll, filtersApplied),
        [feesAll, filtersApplied]
    );

    const pageCount = Math.max(1, Math.ceil(filteredFees.length / pageSize));

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredFees.slice(start, start + pageSize);
    }, [filteredFees, page, pageSize]);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    fecha_desde: fechaDesde,
                    fecha_hasta: fechaHasta,
                };

                const data = await getFeesSales(params);
                setFeesAll(data || []);
                setPage(1);
            } catch (err) {
                console.error("Error fetching sales fees", err);
                setError(err?.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    return (
        <div className="page">
            <div className="content-header">
                <h1>Sales Fees</h1>
                <p>Process and monitor Amazon fees transactions</p>
            </div>

            {/* KPI Cards ✅ filtrados */}
            <SalesFeesKpiCards loading={loading} fees={filteredFees} />

            {/* Filters */}
            {/* <SalesFeesFilters
                value={filtersDraft}
                onChange={(next) => setFiltersDraft(next)}
                typeOptions={typeOptions}
                statusOptions={statusOptions}
                onApply={() => {
                    const next = {
                        ...filtersDraft,
                        types: Array.isArray(filtersDraft.types) ? [...filtersDraft.types] : [],
                    };

                    if (next.last) {
                        const anchor = next.to || DEFAULT_TO;
                        const r = lastNDaysRange(next.last, anchor);
                        next.from = r.from;
                        next.to = r.to;
                    }

                    setFiltersApplied(next);
                    setPage(1);
                }}
                onClear={() => {
                    setFiltersDraft(DEFAULT_FILTERS);
                    setFiltersApplied(DEFAULT_FILTERS);
                    setPage(1);
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
                                dataLength={paginated.length}
                                colSpan={11}
                                rows={pageSize}
                                emptyMessage="No fees found"
                            />

                            {!loading && paginated.length > 0 && (
                                <SalesFeesTable rows={paginated} onView={setSelectedFee} />
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

            {/* Charts ✅ filtrados */}
            <SalesFeesCharts loading={loading} fees={filteredFees} />

            {error && <p style={{ color: "crimson" }}>{error}</p>}

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
