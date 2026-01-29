import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"

import { getRefundsSales, getRefundsPayments } from '../../api/refunds';

// Estilos
import '../../styles/dashboard.css';
import "../../styles/charts.css";

// Charts
import RefundsTimeline from "../charts/RefundsTimeline";
import TopSkusRefundBar from "../charts/TopSkusRefundBar";
import RefundBreakdownBar from "../charts/RefundBreakdownBar";

// Info tablas
import RefundsSalesRows from '../refunds/RefundsSalesRows';
import RefundsPaymentsRows from '../refunds/RefundsPaymentsRows';
import RefundsTableHeaders from '../refunds/RefundsTableHeaders';
import TableSkeletonOrEmpty from '../refunds/TableSkeletonOrEmpty';

// Cards
import KPICard from '../common/KPICard';
import { sumBy, toNumber, groupRefundsByReason, groupRefundsByDate, formatMoney, topSkusByRefundAmount, refundBreakdownTotals } from "../../utils/refundMath";

// Details
import RefundDetailsModal from "../refunds/RefundDetailsModal";

// Filters 
import RefundsFiltersBar from "../refunds/RefundsFiltersBar";
import { dateToTs, dateToTsEnd } from "../../utils/dateUtils";

const Refunds = () => {
  const fechaDesde = "10-01-2024";
  const fechaHasta = "10-31-2024";

  const { type } = useParams();  // sales o payments

  const [refunds, setRefunds] = useState([]);
  const [refundsAll, setRefundsAll] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // filters 
  const [statusFilter, setStatusFilter] = useState(""); // "" | "C" | "P"
  const [skuFilter, setSkuFilter] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [settlementFilter, setSettlementFilter] = useState("");

  const DEFAULT_FROM = "2024-10-01";
  const DEFAULT_TO = "2024-10-31";
  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_TO);

  const base = refundsAll;

  const refundsFiltered = base.filter(r => {
    const matchStatus = !statusFilter || String(r.STATUS) === String(statusFilter);
    const matchSku = !skuFilter || String(r.SKU || "").toLowerCase().includes(skuFilter.toLowerCase());
    const matchOrderId = !orderIdFilter || String(r.order_id || "").toLowerCase().includes(orderIdFilter.toLowerCase());
    const matchSettlement = !settlementFilter || String(r.SETTLEMENT_ID || "").toLowerCase().includes(settlementFilter.toLowerCase());

    const rowTs = dateToTs(r.DATE);
    const fromTs = dateFrom ? dateToTs(dateFrom) : null;
    const toTs = dateTo ? dateToTsEnd(dateTo) : null;

    const matchFrom = !fromTs || (rowTs !== null && rowTs >= fromTs);
    const matchTo = !toTs || (rowTs !== null && rowTs <= toTs);

    return matchStatus && matchSku && matchOrderId && matchSettlement && matchFrom && matchTo;
  });

  const hasAnyFilter =
    Boolean(statusFilter) ||
    Boolean(skuFilter) ||
    Boolean(orderIdFilter) ||
    Boolean(settlementFilter) ||
    (dateFrom && dateFrom !== DEFAULT_FROM) ||
    (dateTo && dateTo !== DEFAULT_TO);

  const refundsToRender = hasAnyFilter
    ? refundsFiltered
    : refundsFiltered.slice(0, 10);

  // kpi cards
  const refundUnits = sumBy(refundsAll, r => r.QUANTITY);
  const refundAmount = sumBy(refundsAll, r => Math.abs(toNumber(r.PRODUCT_SALES)));
  const netRefundTotal = sumBy(refundsAll, r => r.TOTAL);
  const fees = sumBy(refundsAll, r => toNumber(r.SELLING_FEES) + toNumber(r.FBA_FEES) + toNumber(r.OTHER));

  //charts
  const topSkus = topSkusByRefundAmount(refundsAll, 5);
  const refundsByDate = groupRefundsByDate(refunds);
  const breakdown = refundBreakdownTotals(refundsAll);

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
        if (type == "sales") {
          const allRefunds = await getRefundsSales({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
          });
          setRefundsAll(allRefunds)

          const data = await getRefundsSales({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            limit: 10,
          })
          console.log("sales: ", data)
          setRefunds(data);
          return
        } else if (type == "payments") {
          const allRefunds = await getRefundsPayments({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
          });
          setRefundsAll(allRefunds)

          const data = await getRefundsPayments({
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            limit: 10,
          });
          setRefunds(data);
          return
        }
      } catch (error) {
        console.error('Error fetching refunds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  return (
    <div className="main-content page active" id="refunds-page">
      <div className="content-header">
        <h1>{type == "sales" ? "Sales Refunds Management" : "Inpayments Refunds Management"} </h1>
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
          setDateFrom("");
          setDateTo("");
        }}
      />


      <div className="data-table">
        <div className="table-header">
          <h3>Refund Transactions</h3>
        </div>
        <div className="table-container">
          <table>
            <RefundsTableHeaders type={type} />
            <tbody>
              <TableSkeletonOrEmpty
                loading={loading}
                dataLength={refundsToRender.length}
                colSpan={9}
                emptyMessage="No refunds match the selected filters"
              />
              {!loading && refundsFiltered.length > 0 && (
                type === "sales" ?
                  <RefundsSalesRows refunds={refundsToRender} onDetails={handleOpenDetails} /> :
                  <RefundsPaymentsRows payments={refundsToRender} onDetails={handleOpenDetails} />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-grid">
        {/* Refund total per day */}
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

        {/* Top SKUs by refund amount */}
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

        {/* Refund breakdown */}
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

export default Refunds;