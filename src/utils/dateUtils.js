// utils/dateUtils.js
export const parseDateUTC = (dateStr, endOfDay = false) => {
  if (!dateStr) return null;
  const s = String(dateStr).trim();

  let year, month, day;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    [year, month, day] = s.split("-").map(Number);
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    [month, day, year] = s.split("-").map(Number);
  } else {
    return null;
  }

  if (endOfDay) {
    return Date.UTC(year, month - 1, day, 23, 59, 59, 999);
  }
  return Date.UTC(year, month - 1, day, 0, 0, 0, 0);
};

export const dateToTs = (dateStr) => parseDateUTC(dateStr, false);
export const dateToTsEnd = (dateStr) => parseDateUTC(dateStr, true);