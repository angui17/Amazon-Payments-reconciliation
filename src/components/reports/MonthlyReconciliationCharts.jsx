import React from "react";
import MonthlyEvolutionLine from "../charts/Reports/ReportsMonthlyCharts";
import MonthlyTopCausesStackedBar from "../charts/Reports/MonthlyTopCausesStackedBar";
import TopCausesOverallHorizontalBar from "../charts/Reports/TopCausesOverallHorizontalBar";
import TopCausesOverallDonut from "../charts/Reports/TopCausesOverallDonut";
import TopCausesOverallLinesBar from "../charts/Reports/TopCausesOverallLinesBar";

const MonthlyReconciliationCharts = ({ charts, loading }) => {
  return (
    <div className="charts-grid">
      <MonthlyEvolutionLine
        topCausesMonthly={charts?.topCausesMonthly || []}
        loading={loading}
      />

      <MonthlyTopCausesStackedBar
        topCausesMonthly={charts?.topCausesMonthly || []}
        loading={loading}
      />

      <TopCausesOverallHorizontalBar
        topCausesOverall={charts?.topCausesOverall || []}
        loading={loading}
      />

       <TopCausesOverallDonut
        topCausesOverall={charts?.topCausesOverall || []}
        loading={loading}
      />

      <TopCausesOverallLinesBar
        topCausesOverall={charts?.topCausesOverall || []}
        loading={loading}
      />

    </div>
  );
};

export default MonthlyReconciliationCharts;
