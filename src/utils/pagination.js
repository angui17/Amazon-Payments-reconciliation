export const paginate = ({
  rows = [],
  page = 1,
  pageSize = 10,
}) => {
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  return {
    page: safePage,
    totalItems,
    totalPages,
    visibleRows: rows.slice(start, end),
  };
};
