import React from "react";
import "../../../styles/filters.css";

const SalesFeesFilters = ({
  value = {},
  onChange = () => {},
  onApply = () => {},
  onClear = () => {},
  typeOptions = [],
}) => {
  const v = {
    from: value.from || "",
    to: value.to || "",
    settlement: value.settlement || "",   
    status: value.status || "",
    type: value.type || "",
    description: value.description || "",
  };

  const types = typeOptions.length
    ? typeOptions
    : ["Order_Retrocharge", "Refund_Retrocharge"];

  const statuses = [
    { value: "", label: "All" },
    { value: "P", label: "Pending" },
    { value: "C", label: "Completed" },
    { value: "F", label: "Failed" },
  ];

  return (
    <div className="filters-card filters-card--inpay">
      <div className="filters-inline">
        {/* From */}
        <div className="filter-group">
          <div className="filter-label">From</div>
          <input
            type="date"
            className="filter-input"
            value={v.from}
            onChange={(e) => onChange({ ...v, from: e.target.value })}
          />
        </div>

        {/* To */}
        <div className="filter-group">
          <div className="filter-label">To</div>
          <input
            type="date"
            className="filter-input"
            value={v.to}
            onChange={(e) => onChange({ ...v, to: e.target.value })}
          />
        </div>

        {/* Settlement */}
        <div className="filter-group">
          <div className="filter-label">Settlement</div>
          <input
            className="filter-input"
            placeholder="e.g. 23405515541"
            value={v.settlement} 
            onChange={(e) => onChange({ ...v, settlement: e.target.value })} 
          />
        </div>

        {/* Type */}
        <div className="filter-group">
          <div className="filter-label">Type</div>
          <select
            className="filter-input"
            value={v.type}
            onChange={(e) => onChange({ ...v, type: e.target.value })}
          >
            <option value="">All</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="filter-group">
          <div className="filter-label">Status</div>
          <select
            className="filter-input"
            value={v.status}
            onChange={(e) => onChange({ ...v, status: e.target.value })}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="filters-actions filters-actions--inline">
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

export default SalesFeesFilters;
