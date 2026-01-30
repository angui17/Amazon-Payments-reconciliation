import React from "react";
import "../../styles/filters.css";

const RefundsPaymentsFiltersBar = ({
  from,
  to,
  onFromChange,
  onToChange,

  settlement,
  onSettlementChange,

  orderId,
  onOrderIdChange,

  sku,
  onSkuChange,

  status,
  onStatusChange,

  reasons,
  reasonOptions = [],
  onReasonsChange,

  onClear,
}) => {
  return (
    <div className="filters-card">
      <div className="filters-row">
        <div className="filters-left">
          <div className="filter-group">
            <label className="filter-label">From</label>
            <input
              type="date"
              className="filter-input"
              value={from || ""}
              onChange={(e) => onFromChange?.(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">To</label>
            <input
              type="date"
              className="filter-input"
              value={to || ""}
              onChange={(e) => onToChange?.(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Settlement ID</label>
            <input
              className="filter-input"
              placeholder="e.g. 123-456"
              value={settlement || ""}
              onChange={(e) => onSettlementChange?.(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Order ID</label>
            <input
              className="filter-input"
              placeholder="e.g. 112-123..."
              value={orderId || ""}
              onChange={(e) => onOrderIdChange?.(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">SKU</label>
            <input
              className="filter-input"
              placeholder="e.g. ABC-001"
              value={sku || ""}
              onChange={(e) => onSkuChange?.(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-input"
              value={status || ""}
              onChange={(e) => onStatusChange?.(e.target.value)}
            >
              <option value="">All</option>
              <option value="C">Completed</option>
              <option value="P">Pending</option>
            </select>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Reason</label>
          <select
            className="filter-input"
            multiple
            value={reasons || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
              onReasonsChange?.(selected);
            }}
            style={{ minHeight: 90 }} // multi-select usable
          >
            {reasonOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="filters-actions">
          <button className="btn btn-sm btn-outline" onClick={onClear} type="button">
            Clear
          </button>

          <button className="btn btn-sm" type="button">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundsPaymentsFiltersBar;
