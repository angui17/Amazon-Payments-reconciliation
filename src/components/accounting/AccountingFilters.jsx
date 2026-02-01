import React, { useEffect, useState } from "react";

const DEFAULT = {
    fecha_desde: "2025-01-01",
    fecha_hasta: "2025-01-31",
    status: "ALL",
    limit_records: 50,
};

const STATUS_OPTIONS = [
    { value: "ALL", label: "All" },
    { value: "C", label: "Completed" },
    { value: "P", label: "Pending" },
];

const AccountingFilters = ({ value, onApply }) => {
    const [local, setLocal] = useState(value || DEFAULT);

    useEffect(() => {
        setLocal(value || DEFAULT);
    }, [value]);

    const set = (k, v) => setLocal((p) => ({ ...p, [k]: v }));

    const apply = (e) => {
        e.preventDefault();
        onApply?.({
            ...local,
            limit_records: Number(local.limit_records) || 50,
        });
    };

    const reset = () => {
        setLocal(DEFAULT);
        onApply?.(DEFAULT);
    };

    return (
        <form className="filters-card" onSubmit={apply}>
            <div className="filters-top">
                <div className="filters-left">
                    <div className="filter-group">
                        <div className="filter-label">From</div>
                        <input
                            type="date"
                            className="filter-input"
                            value={local.fecha_desde}
                            onChange={(e) => set("fecha_desde", e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">To</div>
                        <input
                            type="date"
                            className="filter-input"
                            value={local.fecha_hasta}
                            onChange={(e) => set("fecha_hasta", e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">Status</div>
                        <select
                            className="filter-input"
                            value={local.status}
                            onChange={(e) => set("status", e.target.value)}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <div className="filter-label">Limit records</div>
                        <input
                            type="number"
                            className="filter-input"
                            min={10}
                            max={500}
                            value={local.limit_records}
                            onChange={(e) => set("limit_records", e.target.value)}
                        />
                    </div>
                </div>

                <div className="filters-actions">
                    <button type="submit" className="btn btn-sm btn-primary">
                        Apply
                    </button>
                    <button type="button" className="btn btn-sm" onClick={reset}>
                        Clear
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AccountingFilters;
export { DEFAULT as DEFAULT_ACCOUNTING_FILTERS };
