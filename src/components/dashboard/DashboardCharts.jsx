import React from "react";
import ChartCard from "./ChartCard";

import { Line, Bar, Doughnut } from "react-chartjs-2";

import {
  buildDepositsLine,
  buildReconBar,
  buildStatusDonut,
  lineOptions,
  barOptions,
  donutOptions,
} from "../../utils/dashboardCharts";

import "../../styles/charts.css";

import ChartCardSkeleton from "./ChartCardSkeleton";
import "../../styles/charts-skeleton.css";

const DashboardCharts = ({ charts }) => {
  if (!charts) {
    return (
      <div className="charts-grid">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
    );
  }

  const deposits = charts.depositsByDay || [];
  const status = charts.statusCounts || [];

  return (
    <div className="charts-grid">
      <ChartCard title="Reconciled vs Not Reconciled (by Day)">
        <div className="chart-canvas" style={{ height: "260px" }}>
          <Bar data={buildReconBar(deposits)} options={barOptions} />
        </div>
      </ChartCard>

      <ChartCard title="Status Breakdown">
        <div className="chart-canvas" style={{ height: "260px" }}>
          <Doughnut data={buildStatusDonut(status)} options={donutOptions} />
        </div>
      </ChartCard>

      <ChartCard title="Deposits by Day (Amazon vs SAP vs Difference)">
        <div className="chart-canvas" style={{ height: "260px" }}>
          <Line data={buildDepositsLine(deposits)} options={lineOptions} />
        </div>
      </ChartCard>

    </div>
  );
};

export default DashboardCharts;
