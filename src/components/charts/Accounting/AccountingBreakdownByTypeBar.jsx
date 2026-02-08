import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { SLATE } from "../../../utils/feesCharts";

const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const AccountingBreakdownByTypeBar = ({ data = [] }) => {
    const chartData = useMemo(() => {
        const sorted = [...(data || [])]
            .map((x) => ({
                label: x?.type ?? "—",
                amount: toNum(x?.amount),
            }))
            .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

        return {
            labels: sorted.map((x) => x.label),
            datasets: [
                {
                    label: "Amount",
                    data: sorted.map((x) => x.amount),
                    backgroundColor: SLATE.soft,
                    borderColor: SLATE.border,
                    borderWidth: 1,
                },
            ],
        };
    }, [data]);

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
            },
            scales: {
                x: { ticks: { color: "#6b7280" }, grid: { display: false } },
                y: { ticks: { color: "#6b7280" }, grid: { color: "rgba(71,85,105,0.12)" } },
            },
        }),
        []
    );

    return <Bar data={chartData} options={options} />;
};

export default AccountingBreakdownByTypeBar;
