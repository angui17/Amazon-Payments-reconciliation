import React from "react";
import "../../styles/filters.css";

const RefundsFiltersBar = ({ from, to, onFromChange, onToChange, status, onStatusChange, sku, onSkuChange, orderId, onOrderIdChange, settlement, onSettlementChange, onClear }) => {
  return (
    <div className="filters-card">
      <div className="filters-row">
        {/* Left filters */}
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
            <label className="filter-label">Settlement</label>
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

        {/* Right actions */}
        <div className="filters-actions">
          <button className="btn btn-sm btn-outline" onClick={onClear}>
            Clear
          </button>

          {/* Por ahora es estética: después lo conectamos a “apply server-side” si querés */}
          <button className="btn btn-sm" type="button">
            Apply
          </button>

          <div className="export-wrap">
            <button className="btn btn-sm btn-primary export-btn" type="button">
              Export <span className="export-caret">▾</span>
            </button>

            <div className="export-menu">
              <button className="export-item" type="button">Raw</button>
              <button className="export-item" type="button">Summary (by day)</button>
              <button className="export-item" type="button">Summary (by SKU)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundsFiltersBar;