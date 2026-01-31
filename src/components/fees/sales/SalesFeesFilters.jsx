import React, { useMemo } from "react";
import "../../../styles/filters.css";

const SalesFeesFilters = ({
    value = {},
    onChange = () => { },
    onApply = () => { },
    onClear = () => { },
    typeOptions = [],
    statusOptions = [],
}) => {
    const v = {
        from: value.from || "",
        to: value.to || "",
        last: value.last || "",
        settlementId: value.settlementId || "",
        types: value.types || [],
        description: value.description || "",
        status: value.status || "",
    };

    const hint = useMemo(() => {
        const chips = [];
        if (v.from || v.to) chips.push("date range");
        if (v.last) chips.push(`last ${v.last} days`);
        if (v.settlementId) chips.push("settlement");
        if (v.types.length) chips.push(`${v.types.length} types`);
        if (v.description) chips.push("description");
        if (v.status) chips.push("status");
        return chips.length ? `Active: ${chips.join(" • ")}` : "No filters applied";
    }, [v.from, v.to, v.last, v.settlementId, v.types, v.description, v.status]);

    return (
        <div className="filters-card">
            <div className="filters-top">
                <div className="filters-left">
                    <div className="filter-group">
                        <div className="filter-label">From</div>
                        <input
                            type="date"
                            className="filter-input"
                            value={v.from}
                            onChange={(e) => onChange({ ...v, from: e.target.value, last: "" })}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">To</div>
                        <input
                            type="date"
                            className="filter-input"
                            value={v.to}
                            onChange={(e) => onChange({ ...v, to: e.target.value, last: "" })}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">Quick</div>
                        <select
                            className="filter-input"
                            value={v.last}
                            onChange={(e) => onChange({ ...v, last: e.target.value, from: "", to: "" })}
                        >
                            <option value="7">Last 7 days</option>
                            <option value="14">Last 14 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">Settlement ID</div>
                        <input
                            className="filter-input"
                            placeholder="e.g. 23405515541"
                            value={v.settlementId}
                            onChange={(e) => onChange({ ...v, settlementId: e.target.value })}
                        />
                    </div>

                    <div className="filter-group" style={{ gridColumn: "span 2" }}>
                        <div className="filter-label">Type (multi)</div>
                        <select
                            multiple
                            className="filter-input"
                            value={v.types}
                            onChange={(e) =>
                                onChange({
                                    ...v,
                                    types: Array.from(e.target.selectedOptions).map((o) => o.value),
                                })
                            }
                            style={{ height: 90, paddingTop: 8, paddingBottom: 8 }}
                        >
                            {typeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filters-right">
                    <div className="filter-group">
                        <div className="filter-label">Status</div>
                        <select
                            className="filter-input"
                            value={v.status}
                            onChange={(e) => onChange({ ...v, status: e.target.value })}
                        >
                            <option value="">All</option>
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filters-actions" style={{ paddingTop: 10 }}>
                        <button className="btn btn-sm btn-primary" onClick={onApply}>
                            Apply
                        </button>
                        <button className="btn btn-sm btn-outline" onClick={onClear}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesFeesFilters;