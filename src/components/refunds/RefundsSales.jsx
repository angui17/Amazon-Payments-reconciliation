import React, { useEffect, useState, useMemo } from 'react';

import { getRefundsSales } from '../../api/refunds';

// Estilos
import '../../styles/dashboard.css';
import "../../styles/charts.css";

// Charts
import RefundsTimeline from "../charts/RefundsTimeline";
import TopSkusRefundBar from "../charts/TopSkusRefundBar";
import RefundBreakdownBar from "../charts/RefundBreakdownBar";

// Info tablas
import RefundsSalesRows from '../refunds/RefundsSalesRows';
import RefundsTableHeaders from '../refunds/RefundsTableHeaders';
import TableSkeletonOrEmpty from '../refunds/TableSkeletonOrEmpty';

// Cards
import KPICard from '../common/KPICard';
import { sumBy, toNumber, groupRefundsByDate, formatMoney, topSkusByRefundAmount, refundBreakdownTotals } from "../../utils/refundMath";

// Details
import RefundDetailsModal from "../refunds/RefundDetailsModal";

// Filters 
import RefundsFiltersBar from "../refunds/RefundsFiltersBar";
import { dateToTs, dateToTsEnd } from "../../utils/dateUtils";

const DEFAULT_FROM = "2024-10-01";
const DEFAULT_TO = "2024-10-31";

const RefundsSales = () => {
  const fechaDesde = "10-01-2024";
  const fechaHasta = "10-31-2024";

  const [refundsAll, setRefundsAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // filters 
  const [statusFilter, setStatusFilter] = useState(""); // "" | "C" | "P"
  const [skuFilter, setSkuFilter] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [settlementFilter, setSettlementFilter] = useState("");

  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_TO);

  const refundsFiltered = useMemo(() => {
    const fromTs = dateFrom ? dateToTs(dateFrom) : null;
    const toTs = dateTo ? dateToTsEnd(dateTo) : null;

    return refundsAll.filter(r => {
      const matchStatus = !statusFilter || String(r.STATUS) === String(statusFilter);
      const matchSku = !skuFilter || String(r.SKU || "").toLowerCase().includes(skuFilter.toLowerCase());
      const matchOrderId = !orderIdFilter || String(r.order_id || "").toLowerCase().includes(orderIdFilter.toLowerCase());
      const matchSettlement = !settlementFilter || String(r.SETTLEMENT_ID || "").toLowerCase().includes(settlementFilter.toLowerCase());

      const rowTs = dateToTs(r.DATE);
      const matchFrom = !fromTs || (rowTs !== null && rowTs >= fromTs);
      const matchTo = !toTs || (rowTs !== null && rowTs <= toTs);

      return matchStatus && matchSku && matchOrderId && matchSettlement && matchFrom && matchTo;
    });
  }, [refundsAll, statusFilter, skuFilter, orderIdFilter, settlementFilter, dateFrom, dateTo]);

  const hasAnyFilter = useMemo(() => {
    return (
      Boolean(statusFilter) ||
      Boolean(skuFilter) ||
      Boolean(orderIdFilter) ||
      Boolean(settlementFilter) ||
      (dateFrom && dateFrom !== DEFAULT_FROM) ||
      (dateTo && dateTo !== DEFAULT_TO)
    );
  }, [statusFilter, skuFilter, orderIdFilter, settlementFilter, dateFrom, dateTo]);

  const refundsToRender = useMemo(() => {
    return hasAnyFilter ? refundsFiltered : refundsFiltered.slice(0, 10);
  }, [hasAnyFilter, refundsFiltered]);

  // kpi cards
  const refundUnits = sumBy(refundsAll, r => r.QUANTITY);
  const refundAmount = sumBy(refundsAll, r => Math.abs(toNumber(r.PRODUCT_SALES)));
  const netRefundTotal = sumBy(refundsAll, r => r.TOTAL);
  const fees = sumBy(refundsAll, r => toNumber(r.SELLING_FEES) + toNumber(r.FBA_FEES) + toNumber(r.OTHER));

  // charts 
  const topSkus = topSkusByRefundAmount(refundsFiltered, 5);
  const refundsByDate = groupRefundsByDate(refundsFiltered);
  const breakdown = refundBreakdownTotals(refundsFiltered);

  const handleOpenDetails = (refund) => {
    setSelectedRefund(refund);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedRefund(null);
  };
  
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const allRefunds = await getRefundsSales({
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta,
        });
        setRefundsAll(allRefunds || []);
      } catch (error) {
        console.error('Error fetching refunds:', error);
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

      <div className="kpi-cards">
        <KPICard title="Refund Amount" value={loading ? "—" : formatMoney(refundAmount)} change="Total refunded" />
        <KPICard title="Refund Units" value={loading ? "—" : refundUnits} change="Items returned" />
        <KPICard title="Net Refund Total" value={loading ? "—" : formatMoney(netRefundTotal)} change="After adjustments" />
        <KPICard title="Fees Refunded / Applied" value={loading ? "—" : formatMoney(fees)} change="Selling + FBA + Other" />
      </div>

      <RefundsFiltersBar
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sku={skuFilter}
        onSkuChange={setSkuFilter}
        orderId={orderIdFilter}
        onOrderIdChange={setOrderIdFilter}
        settlement={settlementFilter}
        onSettlementChange={setSettlementFilter}
        from={dateFrom}
        to={dateTo}
        onFromChange={setDateFrom}
        onToChange={setDateTo}
        onClear={() => {
          setStatusFilter("");
          setSkuFilter("");
          setOrderIdFilter("");
          setSettlementFilter("");
          setDateFrom(DEFAULT_FROM);
          setDateTo(DEFAULT_TO);
        }}
      />

      <div className="data-table">
        <div className="table-header">
          <h3>Refund Transactions</h3>
        </div>
        <div className="table-container">
          <table>
            <RefundsTableHeaders type="sales" />
            <tbody>
              <TableSkeletonOrEmpty
                loading={loading}
                dataLength={refundsToRender.length}
                colSpan={9}
                emptyMessage="No refunds match the selected filters"
              />

              {!loading && refundsToRender.length > 0 && (
                <RefundsSalesRows refunds={refundsToRender} onDetails={handleOpenDetails} />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Refund total per day</div>
              <div className="chart-subtitle">Line chart</div>
            </div>
          </div>
          {loading ? (
            <div className="chart-skeleton chart-skeleton-line" />
          ) : (
            <div className="chart-inner">
              <RefundsTimeline data={refundsByDate} />
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Top SKUs by refund amount</div>
              <div className="chart-subtitle">Bar chart</div>
            </div>
          </div>
          {loading ? (
            <div className="chart-skeleton chart-skeleton-bars" />
          ) : (
            <div className="chart-inner">
              <TopSkusRefundBar data={topSkus} />
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-title">Refund breakdown</div>
              <div className="chart-subtitle">Principal vs tax vs fees</div>
            </div>
          </div>
          {loading ? (
            <div className="chart-skeleton chart-skeleton-breakdown" />
          ) : (
            <div className="chart-inner">
              <RefundBreakdownBar breakdown={breakdown} />
            </div>
          )}
        </div>
      </div>

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