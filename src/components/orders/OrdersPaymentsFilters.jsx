import React from "react";
import "../../styles/filters.css";

import { STATUS_LABELS } from "../../utils/status"

const OrdersPaymentsFilters = ({
  value = {},
  onChange = () => {},
  onApply = () => {},
  onClear = () => {},
  statusOptions = [],
  descOptions = [],
}) => {
  const v = {
    from: value.from || "",
    to: value.to || "",
    orderId: value.orderId || "",
    sku: value.sku || "",
    status: value.status || "",
    descriptions: value.descriptions || [],
  };

  return (
    <div className="filters-card">
      <div className="filters-top">
        {/* LEFT GRID */}
        <div className="filters-left">
          {/* Posted from */}
          <div className="filter-group">
            <div className="filter-label">Posted from</div>
            <input
              type="date"
              className="filter-input"
              value={v.from}
              onChange={(e) => onChange({ ...v, from: e.target.value })}
            />
          </div>

          {/* Posted to */}
          <div className="filter-group">
            <div className="filter-label">Posted to</div>
            <input
              type="date"
              className="filter-input"
              value={v.to}
              onChange={(e) => onChange({ ...v, to: e.target.value })}
            />
          </div>

          {/* Order ID */}
          <div className="filter-group">
            <div className="filter-label">Order ID</div>
            <input
              className="filter-input"
              placeholder="e.g. 111-..."
              value={v.orderId}
              onChange={(e) => onChange({ ...v, orderId: e.target.value })}
            />
          </div>

          {/* SKU */}
          <div className="filter-group">
            <div className="filter-label">SKU</div>
            <input
              className="filter-input"
              placeholder="e.g. 15100BLK"
              value={v.sku}
              onChange={(e) => onChange({ ...v, sku: e.target.value })}
            />
          </div>

          {/* Amount Description */}
          <div className="filter-group" style={{ gridColumn: "span 2" }}>
            <div className="filter-label">Amount Description</div>
            <select
              multiple
              className="filter-input"
              value={v.descriptions}
              onChange={(e) =>
                onChange({
                  ...v,
                  descriptions: Array.from(
                    e.target.selectedOptions
                  ).map((o) => o.value),
                })
              }
              style={{ height: 90, paddingTop: 8, paddingBottom: 8 }}
            >
              {descOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT */}
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
        {STATUS_LABELS[s] ?? s}
      </option>
    ))}
            </select>
          </div>

          <div className="filters-actions">
            <button className="btn btn-sm btn-primary" onClick={onApply}>
              Apply
            </button>
            <button className="btn btn-sm" onClick={onClear}>
              Clear
            </button>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default OrdersPaymentsFilters;
