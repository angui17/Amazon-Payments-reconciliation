import React from "react";
import "../../styles/filters.css";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "RECONCILED", label: "Reconciled" },
  { value: "PENDING", label: "Pending" },
  { value: "NOT_RECONCILED", label: "Not reconciled" },
];

const ReportsFilters = ({ filters, onChange, onApply, onReset, loading }) => {
  const set = (key) => (e) =>
    onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="filters-card">
      <div className="filters-top">
        {/* LEFT: filters */}
        <div className="filters-left">
          <div className="filter-group">
            <label className="filter-label">From date</label>
            <input
              type="date"
              value={filters.fecha_desde}
              onChange={set("fecha_desde")}
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">To date</label>
            <input
              type="date"
              value={filters.fecha_hasta}
              onChange={set("fecha_hasta")}
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              value={filters.status}
              onChange={set("status")}
              className="filter-input"
              disabled={loading}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Months to display</label>
            <input
              type="number"
              min="1"
              max="36"
              value={filters.limit_months}
              onChange={set("limit_months")}
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Top causes</label>
            <input
              type="number"
              min="1"
              max="50"
              value={filters.top_causes_n}
              onChange={set("top_causes_n")}
              className="filter-input"
              disabled={loading}
            />
          </div>
        </div>

        {/* RIGHT: actions */}
        <div className="filters-row filters-actions">
          <button
            className="btn btn-sm btn-primary"
            onClick={onApply}
            disabled={loading}
            type="button"
          >
            Apply
          </button>

          <button
            className="btn btn-sm"
            onClick={onReset}
            disabled={loading}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilters;
