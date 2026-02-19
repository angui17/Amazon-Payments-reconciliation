import React from "react";
import "../../styles/filters.css";

const PENDING_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "P", label: "Pending" },
  { value: "C", label: "Completed" },
];


const ReportsFilters = ({
  filters,
  onChange,
  onApply,
  onReset,
  loading,
  page = 1,
  pageSize = 10,
  totalItems = 0,
}) => {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = totalItems === 0 ? 0 : Math.min(totalItems, page * pageSize);

  return (
  <div className="filters-card filters-card--reports">
    <div className="filters-inline">
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
        <label className="filter-label">Pending</label>
        <select
          value={filters.pending}
          onChange={set("pending")}
          className="filter-input"
          disabled={loading}
        >
          {PENDING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Status pegado a Pending */}
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

      {/* ✅ Acciones como última “columna” */}
      <div className="filters-actions filters-actions--reports">
        <button className="btn btn-sm btn-primary" onClick={onApply} disabled={loading} type="button">
          Apply
        </button>

        <button className="btn btn-sm" onClick={onReset} disabled={loading} type="button">
          Clear
        </button>
      </div>
    </div>
  </div>
);

};

export default ReportsFilters;
