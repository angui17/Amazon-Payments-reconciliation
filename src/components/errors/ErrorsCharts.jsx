import React from "react";
import ChartCard from "../charts/Errors/ChartCard";
import ErrorsByRuleBar from "../charts/Errors/ErrorsByRuleBar";
import ErrorsByDayLine from "../charts/Errors/ErrorsByDayLine";
import ErrorsBreakdownBars from "../charts/Errors/ErrorsBreakdownBars";

const ErrorsCharts = ({ charts, loading }) => {
  const byRule = charts?.exceptionsByRule || [];
  const byDay = charts?.exceptionsByDay || [];

  return (
    <div className="charts-grid">
      <ChartCard
        title="Exceptions by Rule"
        subtitle="Cantidad por tipo de excepción"
        loading={loading || !charts}
        skeletonType="bars"
      >
        <ErrorsByRuleBar data={byRule} />
      </ChartCard>

      <ChartCard
        title="Exceptions Trend"
        subtitle="Total de excepciones por día"
        loading={loading || !charts}
        skeletonType="line"
      >
        <ErrorsByDayLine data={byDay} />
      </ChartCard>

      <ChartCard
        title="Exceptions Breakdown"
        subtitle="Diff / No SAP / Amazon Internal por día"
        loading={loading || !charts}
        skeletonType="bars"
      >
        <ErrorsBreakdownBars data={byDay} />
      </ChartCard>
    </div>
  );
};

export default ErrorsCharts;
