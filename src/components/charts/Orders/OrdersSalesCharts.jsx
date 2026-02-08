import React, { useMemo, useRef, useImperativeHandle } from "react";

// Gráficos
import OrdersNetTotalLineChart from "./OrdersNetTotalLineChart";
import OrdersComponentsStackedBar from "./OrdersComponentsStackedBar";
import OrdersFulfillmentMixDoughnut from "./OrdersFulfillmentMixDoughnut";
import OrdersTopSkusBar from "./OrdersTopSkusBar";

import {
  netTotalByDay,
  componentsByDay,
  fulfillmentMix,
  topSkusBySales,
} from "../../../utils/ordersCharts";

// Estilos
import "../../../styles/charts.css";

// helper: soporta react-chartjs-2 v4/v5
const grabChartImage = (chartRef) => {
  const cur = chartRef?.current;
  if (!cur) return null;

  // v5 style
  if (typeof cur.toBase64Image === "function") return cur.toBase64Image();

  // some builds keep chart instance at cur.chart
  if (cur.chart && typeof cur.chart.toBase64Image === "function")
    return cur.chart.toBase64Image();

  return null;
};

const OrdersSalesCharts = React.forwardRef(({ loading = true, orders = [] }, ref) => {
  // ✅ refs para export (4 gráficos)
  const netRef = useRef(null);
  const compsRef = useRef(null);
  const mixRef = useRef(null);
  const topRef = useRef(null);

  // Cálculos
  const net = useMemo(() => netTotalByDay(orders), [orders]);
  const comps = useMemo(() => componentsByDay(orders), [orders]);
  const mix = useMemo(() => fulfillmentMix(orders, "count"), [orders]);
  const topSkus = useMemo(() => topSkusBySales(orders, 5), [orders]);

  // ✅ expone método para el PDF
  useImperativeHandle(
    ref,
    () => ({
      getChartImages: async () => {
        if (loading) return [];

        const imgs = [];

        const netImg = grabChartImage(netRef);
        if (netImg) imgs.push(netImg);

        const compsImg = grabChartImage(compsRef);
        if (compsImg) imgs.push(compsImg);

        const mixImg = grabChartImage(mixRef);
        if (mixImg) imgs.push(mixImg);

        const topImg = grabChartImage(topRef);
        if (topImg) imgs.push(topImg);

        return imgs;
      },
    }),
    [loading]
  );

  const customStyles = {
    chartsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: "16px",
      marginTop: "16px",
    },
    chartCard: {
      gridColumn: "span 6",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      padding: "14px",
      boxShadow: "0 6px 18px rgba(0,0,0,.06)",
    },
  };

  return (
    <div className="charts-grid" style={customStyles.chartsGrid}>
      {/* ===== Line: Net total ===== */}
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
            <OrdersNetTotalLineChart
              ref={netRef}
              labels={net.labels}
              values={net.values}
            />
          </div>
        )}
      </div>

      {/* ===== Stacked bar: Components ===== */}
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
            <OrdersComponentsStackedBar
              ref={compsRef}
              labels={comps.labels}
              sales={comps.sales}
              fees={comps.fees}
              tax={comps.tax}
            />
          </div>
        )}
      </div>

      {/* ===== Doughnut: mix ===== */}
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
            <OrdersFulfillmentMixDoughnut
              ref={mixRef}
              labels={mix.labels}
              values={mix.values}
            />
          </div>
        )}
      </div>

      {/* ===== Bar: Top skus ===== */}
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
            <OrdersTopSkusBar
              ref={topRef}
              labels={topSkus.labels}
              values={topSkus.values}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default OrdersSalesCharts;