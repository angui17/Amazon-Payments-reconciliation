import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { ORANGE, SLATE } from "../../../utils/feesCharts";

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const prettyLabel = (s) =>
    String(s || "")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase());

const AccountingFlagsBars = ({ data }) => {
    const labels = useMemo(() => (data || []).map((d) => prettyLabel(d.label)), [data]);
    const values = useMemo(() => (data || []).map((d) => safeNum(d.count)), [data]);

    const chartData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    label: "count",
                    data: values,
                    backgroundColor: ORANGE.soft,
                    borderColor: ORANGE.border,
                    borderWidth: 1,
                    borderRadius: 6,
                    maxBarThickness: 60,
                }
            ],
        }),
        [labels, values]
    );

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } },
            },
        }),
        []
    );

    if (!values.length) {
        return <div className="chart-placeholder">No data</div>;
    }

    return <Bar data={chartData} options={options} />;
};

export default AccountingFlagsBars;
