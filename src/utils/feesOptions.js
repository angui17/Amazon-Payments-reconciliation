// utils/feesOptions.js

const normalize = (v) => String(v ?? "").trim();

export const getUniqueAmountDescriptions = (fees = []) => {
  const set = new Set();

  for (const f of fees) {
    const d = normalize(f.DESCRIPTION);
    if (d) set.add(d);
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
};


export const getUniqueValues = (rows = [], selector) => {
  const set = new Set();

  for (const r of rows) {
    const v = selector(r);
    if (v) set.add(String(v).trim());
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
};
