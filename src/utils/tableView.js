export const hasAnyActiveFilters = (filters = {}, defaults = {}) => {
  const keys = Object.keys(filters);
  return keys.some((k) => {
    const v = filters[k];
    const dv = defaults[k];

    // strings
    if (typeof v === "string") {
      return v.trim() !== "" && v !== dv;
    }

    // null/undefined
    if (v == null) return false;

    // numbers/booleans
    return v !== dv;
  });
};

export const pickTableRows = ({ rows = [], hasFilters = false, limit = 10 }) => {
  if (hasFilters) return rows;
  return rows.slice(0, Math.max(1, Number(limit) || 10));
};
