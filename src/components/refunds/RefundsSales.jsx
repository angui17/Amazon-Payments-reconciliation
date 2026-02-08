import React, { useEffect, useState, useMemo, useRef } from "react";

import { getRefundsSales } from "../../api/refunds";

// Estilos
import "../../styles/dashboard.css";
import "../../styles/charts.css";

// Charts
import RefundsSalesCharts from "./RefundsSalesCharts";

// KPIs
import RefundsSalesKpis from "./RefundsSalesKpis";

// Table
import RefundsSalesTable from "./RefundsSalesTable";

// Details
import RefundDetailsModal from "../refunds/RefundDetailsModal";

// Filters
import RefundsFiltersBar from "../refunds/RefundsFiltersBar";

// utils
import { filterRefundsSales } from "../../utils/refundsSalesFilters";

// pagination
import SimplePagination from "../common/SimplePagination";
import { paginate } from "../../utils/pagination";

// PDF export (usa tu helper)
import { exportRowsToPdf } from "../../utils/pdfExport/exportTableToPdf";

// 👉 si ya tenés columnas para refunds, importalas acá.
// Si no las tenés aún, te dejo abajo un ejemplo quick.
import { refundsSalesPdfColumns } from "../../utils/pdfExport/refundsSalesPdfColumns";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

const RefundsSales = () => {
  const fechaDesde = "10-01-2024";
  const fechaHasta = "10-31-2024";

  const [refundsAll, setRefundsAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // details
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // filters
  const [statusFilter, setStatusFilter] = useState(""); // "" | "C" | "P"
  const [skuFilter, setSkuFilter] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [settlementFilter, setSettlementFilter] = useState("");

  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_TO);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [draft, setDraft] = useState({
    status: "",
    sku: "",
    orderId: "",
    settlement: "",
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
  });

  const [applied, setApplied] = useState(draft);

  // pdf charts ref
  const chartsRef = useRef(null);

  // ===== Filters object (memo) =====
  const filters = useMemo(
    () => ({
      status: applied.status,
      sku: applied.sku,
      orderId: applied.orderId,
      settlementId: applied.settlement,
      from: applied.from,
      to: applied.to,
    }), [applied]);

  // ===== 1) FILTER =====
  const refundsFiltered = useMemo(() => {
    return filterRefundsSales(refundsAll, filters);
  }, [refundsAll, filters]);

  // ===== 2) PAGINATE =====
  const pagination = useMemo(
    () =>
      paginate({
        rows: refundsFiltered,
        page,
        pageSize,
      }),
    [refundsFiltered, page, pageSize]
  );

  const { page: safePage, totalItems, totalPages, visibleRows: refundsToRender } =
    pagination;

  // keep page in sync if paginate clamps it
  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  // ===== Details handlers =====
  const handleOpenDetails = (refund) => {
    setSelectedRefund(refund);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedRefund(null);
  };

  // ===== Export PDF =====
  const handleExportPdf = async () => {
    // 1) charts images
    let chartImages = [];
    try {
      if (chartsRef.current?.getChartImages) {
        chartImages = await chartsRef.current.getChartImages();
      }
    } catch (e) {
      console.warn("Could not capture refund chart images:", e);
    }

    const headerBlocks = [
      { label: "View", value: "PAGE" },
      { label: "Status", value: statusFilter || "ALL" },
      { label: "SKU", value: skuFilter || "-" },
      { label: "Order ID", value: orderIdFilter || "-" },
      { label: "Settlement", value: settlementFilter || "-" },
    ];

    exportRowsToPdf({
      rows: refundsToRender,
      columns: refundsSalesPdfColumns,
      title: `Refunds Sales (${dateFrom || "-"} → ${dateTo || "-"})`,
      fileName: `refunds_sales_${dateFrom || "from"}_${dateTo || "to"}_page_${safePage}.pdf`,
      orientation: "l",
      headerBlocks,
      footerNote: `page=${safePage}/${totalPages} | pageSize=${pageSize} | total=${totalItems}`,
      chartImages, // ✅ tabla + charts abajo
    });
  };

  // ===== Fetch =====
  useEffect(() => {
    const fetchRefunds = async () => {
      setLoading(true);
      try {
        const allRefunds = await getRefundsSales({
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta,
        });
        setRefundsAll(allRefunds || []);
      } catch (error) {
        console.error("Error fetching refunds:", error);
        setRefundsAll([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  return (
    <div className="main-content page active" id="refunds-page">
      <div className="content-header">
        <h1>Sales Refunds Management</h1>
        <p>Process and monitor Amazon refund transactions</p>
      </div>

      {/* KPI Cards */}
      {refundsToRender.length > 0 ?
        <RefundsSalesKpis loading={loading} refunds={refundsToRender} />
        : null}

      <RefundsFiltersBar
        from={draft.from}
        to={draft.to}
        settlement={draft.settlement}
        orderId={draft.orderId}
        sku={draft.sku}
        status={draft.status}

        onFromChange={(v) => setDraft((d) => ({ ...d, from: v }))}
        onToChange={(v) => setDraft((d) => ({ ...d, to: v }))}
        onSettlementChange={(v) => setDraft((d) => ({ ...d, settlement: v }))}
        onOrderIdChange={(v) => setDraft((d) => ({ ...d, orderId: v }))}
        onSkuChange={(v) => setDraft((d) => ({ ...d, sku: v }))}
        onStatusChange={(v) => setDraft((d) => ({ ...d, status: v }))}

        onApply={() => {
          setApplied(draft);
          setPage(1);
        }}

        onClear={() => {
          const cleared = {
            status: "",
            sku: "",
            orderId: "",
            settlement: "",
            from: DEFAULT_FROM,
            to: DEFAULT_TO,
          };
          setDraft(cleared);
          setApplied(cleared);
          setPage(1);
        }}
      />


      {/* Table  */}
      {refundsToRender.length > 0 ?
        <RefundsSalesTable
          loading={loading}
          rows={refundsToRender}
          totalItems={totalItems}
          pageSize={pageSize}
          title="Refund Transactions"
          onDetails={handleOpenDetails}
          onExportPdf={handleExportPdf}
        />
        :
        <div className="no-data text-center">
          {loading ? "Loading refunds..." : "No refunds found for the selected filters."}
        </div>
      }

      {/* Pagination */}
      {refundsToRender.length > 0 ?
        <SimplePagination
          page={safePage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          pageSizeOptions={[5, 10, 25, 50]}
        />
        : null}

      {/* Charts */}
      {refundsToRender.length > 0 ?
        <RefundsSalesCharts
          ref={chartsRef}
          loading={loading}
          refunds={refundsToRender}
        />
        : null}

      {isDetailsOpen && (
        <RefundDetailsModal
          refund={selectedRefund}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default RefundsSales;