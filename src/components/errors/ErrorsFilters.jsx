import React, { useEffect, useMemo, useState } from "react";
import "../../styles/filters.css";
import { ymdToMdy } from "../../utils/dateUtils";

// UI labels (user friendly)
const STATUS_UI_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "P" },
  { label: "Completed", value: "C" },
];

const ErrorsFilters = ({ value, onApply, loading }) => {
  // value esperado en formato UI:
  // { fecha_desde: "YYYY-MM-DD", fecha_hasta: "YYYY-MM-DD", status: "ALL|P|C", limit_records: number }
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const canApply = useMemo(() => {
    return Boolean(draft?.fecha_desde && draft?.fecha_hasta);
  }, [draft?.fecha_desde, draft?.fecha_hasta]);

  const update = (key) => (e) => {
    const v = e.target.value;
    setDraft((prev) => ({
      ...prev,
      [key]: key === "limit_records" ? (v === "" ? "" : Number(v)) : v,
    }));
  };

  const handleApply = () => {
    if (!canApply) return;

    // API quiere MM-DD-YYYY, nosotros guardamos UI en YYYY-MM-DD
    const payload = {
      ...draft,
      limit_records: draft.limit_records === "" ? 50 : Number(draft.limit_records || 50),
      fecha_desde: ymdToMdy(draft.fecha_desde),
      fecha_hasta: ymdToMdy(draft.fecha_hasta),
      status: draft.status || "ALL",
    };

    onApply(payload);
  };

  const handleReset = () => {
    onApply({
      fecha_desde: ymdToMdy(value.fecha_desde),
      fecha_hasta: ymdToMdy(value.fecha_hasta),
      status: value.status || "ALL",
      limit_records: value.limit_records || 50,
    });
  };

  return (
    <div className="filters-card">
      <div className="filters-top">
        <div className="filters-left">
          <div className="filter-group">
            <div className="filter-label">From</div>
            <input
              className="filter-input"
              type="date"
              value={draft.fecha_desde}
              onChange={update("fecha_desde")}
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <div className="filter-label">To</div>
            <input
              className="filter-input"
              type="date"
              value={draft.fecha_hasta}
              onChange={update("fecha_hasta")}
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <div className="filter-label">Status</div>
            <select
              className="filter-input"
              value={draft.status}
              onChange={update("status")}
              disabled={loading}
            >
              {STATUS_UI_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-label">Limit</div>
            <input
              className="filter-input"
              type="number"
              min="1"
              max="5000"
              placeholder="50"
              value={draft.limit_records}
              onChange={update("limit_records")}
              disabled={loading}
            />
          </div>

          <div className="filters-actions">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleApply}
              disabled={!canApply || loading}
            >
              Apply
            </button>

            <button
              className="btn btn-sm"
              onClick={handleReset}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorsFilters;
