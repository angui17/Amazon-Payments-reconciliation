import React from "react";
import "../../styles/pagination.css";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const SimplePagination = ({
  page = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = clamp(page, 1, totalPages);

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = totalItems === 0 ? 0 : Math.min(totalItems, safePage * pageSize);

  return (
    <div className="simple-pagination">
      <div className="simple-pagination-left">
        <button
          className="simple-pagination-btn"
          onClick={() => onPageChange?.(safePage - 1)}
          disabled={!canPrev}
          type="button"
        >
          ← Prev
        </button>

        <button
          className="simple-pagination-btn"
          onClick={() => onPageChange?.(safePage + 1)}
          disabled={!canNext}
          type="button"
        >
          Next →
        </button>
      </div>

      <div className="simple-pagination-info">
        <span>
          {from}-{to} of {totalItems}
        </span>
        <span className="muted">|</span>
        <span>
          Page {safePage} / {totalPages}
        </span>

        {onPageSizeChange ? (
          <>
            <span className="muted">|</span>
            <select
              className="simple-pagination-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SimplePagination;
