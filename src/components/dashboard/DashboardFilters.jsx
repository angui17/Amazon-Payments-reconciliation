import React, { useMemo, useState, useEffect } from "react";
import "../../styles/filters.css";

const STATUS_OPTIONS = [
    { value: "ALL", label: "All statuses" },
    { value: "P", label: "Pending" },
    { value: "C", label: "Completed" },
];


const DashboardFilters = ({ value, onApply, onClear }) => {
    const [draft, setDraft] = useState(value);

    useEffect(() => setDraft(value), [value]);

    const canApply = useMemo(() => {
        return Boolean(draft?.fecha_desde && draft?.fecha_hasta);
    }, [draft?.fecha_desde, draft?.fecha_hasta]);

    const update = (key) => (e) => {
        const v = e.target.value;
        setDraft((prev) => ({
            ...prev,
            [key]:
                key === "limit_records"
                    ? v === "" ? "" : Number(v)
                    : v,
        }));
    };

    const handleApply = () => {
        if (!canApply) return;
        onApply({
            ...draft,
            limit_records: draft.limit_records === "" ? 50 : draft.limit_records,
        });
    };

    return (
        <div className="filters-card filters-card--sales">
            <div className="filters-inline">
                <div className="filter-group">
                    <span className="filter-label">From</span>
                    <input
                        className="filter-input"
                        type="date"
                        value={draft.fecha_desde || ""}
                        onChange={update("fecha_desde")}
                    />
                </div>

                <div className="filter-group">
                    <span className="filter-label">To</span>
                    <input
                        className="filter-input"
                        type="date"
                        value={draft.fecha_hasta || ""}
                        onChange={update("fecha_hasta")}
                    />
                </div>

                <div className="filter-group">
                    <span className="filter-label">Status</span>
                    <select
                        className="filter-input"
                        value={draft.status || "ALL"}
                        onChange={update("status")}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Limit Records</span>
                    <input
                        className="filter-input"
                        type="number"
                        min="1"
                        max="5000"
                        placeholder="50"
                        value={draft.limit_records ?? ""}
                        onChange={update("limit_records")}
                    />
                </div>

                <div className="filters-actions filters-actions--inline">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={handleApply}
                        disabled={!canApply}
                        title={!canApply ? "Select From/To dates to apply" : "Apply filters"}
                    >
                        Apply
                    </button>

                    <button className="btn btn-sm" onClick={() => { setDraft(value), onClear?.() }} type="button" title="Clear filters" >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardFilters;
