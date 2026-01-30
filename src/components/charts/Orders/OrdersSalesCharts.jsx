import React, { useMemo } from "react";

// Gráficos
import OrdersNetTotalLineChart from "./OrdersNetTotalLineChart"
import OrdersComponentsStackedBar from "./OrdersComponentsStackedBar";
import OrdersFulfillmentMixDoughnut from "./OrdersFulfillmentMixDoughnut";
import OrdersTopSkusBar from "./OrdersTopSkusBar";

import { netTotalByDay, componentsByDay, fulfillmentMix, topSkusBySales } from "../../../utils/ordersCharts";

// Estilos
import "../../../styles/charts.css";

const OrdersSalesCharts = ({ loading = true, orders = [] }) => {
  // Estilos específicos para este componente
  const customStyles = {
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '16px',
      marginTop: '16px'
    },
    chartCard: {
      gridColumn: 'span 6',
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      padding: '14px',
      boxShadow: '0 6px 18px rgba(0,0,0,.06)'
    },
    chartCardFull: {
      gridColumn: 'span 12'
    }
  };

  // Calculos
  const net = useMemo(() => netTotalByDay(orders), [orders]);
  const comps = useMemo(() => componentsByDay(orders), [orders]);
  const mix = useMemo(() => fulfillmentMix(orders, "count"), [orders]);
  const topSkus = useMemo(() => topSkusBySales(orders, 5), [orders]);

  return (
    <div className="charts-grid" style={customStyles.chartsGrid}>
      <div className="chart-card" style={customStyles.chartCard}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Net total per day</div>
            <div className="chart-subtitle">Line chart • TOTAL by DATE</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-line" />
        ) : (
          <div className="chart-inner" style={{ height: 260 }}>
            <OrdersNetTotalLineChart labels={net.labels} values={net.values} />
          </div>
        )}
      </div>

      <div className="chart-card" style={customStyles.chartCard}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Daily components</div>
            <div className="chart-subtitle">Stacked bars • Sales vs Fees vs Tax</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner" style={{ height: 260 }}>
            <OrdersComponentsStackedBar labels={comps.labels} sales={comps.sales} fees={comps.fees} tax={comps.tax} />
          </div>
        )}
      </div>

      {/* Este ocupa solo la mitad (span 6) */}
      <div className="chart-card" style={customStyles.chartCard}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Fulfillment mix</div>
            <div className="chart-subtitle">Doughnut • count or net total</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-doughnut" />
        ) : (
          <div className="chart-inner">
            <OrdersFulfillmentMixDoughnut labels={mix.labels} values={mix.values} />
          </div>
        )}
      </div>

      {/* Este también ocupa la mitad (span 6) y va al lado */}
      <div className="chart-card" style={customStyles.chartCard}>
        <div className="chart-card-header">
          <div>
            <div className="chart-title">Top SKUs</div>
            <div className="chart-subtitle">Bars • PRODUCT_SALES by SKU</div>
          </div>
        </div>

        {loading ? (
          <div className="chart-skeleton chart-skeleton-bars" />
        ) : (
          <div className="chart-inner" style={{ height: 260 }}>
            <OrdersTopSkusBar labels={topSkus.labels} values={topSkus.values} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersSalesCharts;