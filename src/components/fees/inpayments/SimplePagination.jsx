import React from "react";

const SimplePagination = ({
  page = 1,
  pageCount = 1,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25],
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) => {
  return (
    <div className="simple-pagination">
      <div className="simple-pagination-left">
        <button
          className="simple-pagination-btn"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <button
          className="simple-pagination-btn"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
        >
          Next
        </button>
      </div>

      <div className="simple-pagination-info">
        <span>
          Page <strong>{page}</strong> of {pageCount} •
        </span>

        <select
          className="simple-pagination-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SimplePagination;
