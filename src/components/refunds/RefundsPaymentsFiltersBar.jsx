import React from "react";
import "../../styles/filters.css";

const RefundsPaymentsFiltersBar = ({
  value = {},

  onChange,
  onApply,
  onClear,

  statusOptions = [],
  reasonOptions = [],
}) => {
  const v = {
    from: value.from || "",
    to: value.to || "",
    settlement: value.settlement || "",
    orderId: value.orderId || "",
    sku: value.sku || "",
    status: value.status || "",
    reason: value.reason || "",
  };

  return (
  <div className="filters-card filters-card--refunds-payments">
    <div className="filters-row-inline">
      <div className="filter-group">
        <label className="filter-label">From</label>
        <input
          type="date"
          className="filter-input"
          value={v.from}
          onChange={(e) => onChange({ ...v, from: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">To</label>
        <input
          type="date"
          className="filter-input"
          value={v.to}
          onChange={(e) => onChange({ ...v, to: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Settlement ID</label>
        <input
          className="filter-input"
          placeholder="e.g. 123-456"
          value={v.settlement}
          onChange={(e) => onChange({ ...v, settlement: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Order ID</label>
        <input
          className="filter-input"
          placeholder="e.g. 112-123..."
          value={v.orderId}
          onChange={(e) => onChange({ ...v, orderId: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">SKU</label>
        <input
          className="filter-input"
          placeholder="e.g. ABC-001"
          value={v.sku}
          onChange={(e) => onChange({ ...v, sku: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          className="filter-input"
          value={v.status}
          onChange={(e) => onChange({ ...v, status: e.target.value })}
        >
          <option value="">All</option>
          <option value="P">Pending</option>
          <option value="C">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Reason</label>
        <select
          className="filter-input"
          value={v.reason}
          onChange={(e) => onChange({ ...v, reason: e.target.value })}
        >
          <option value="">All</option>
          {reasonOptions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="filters-actions--refunds-payments">
        <button className="btn btn-sm btn-primary" onClick={onApply} type="button">
          Apply
        </button>
        <button className="btn btn-sm" onClick={onClear} type="button">
          Clear
        </button>
      </div>
    </div>
  </div>
);

};

export default RefundsPaymentsFiltersBar;
