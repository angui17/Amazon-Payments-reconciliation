const fmtMoney = (n) => {
  const num = Number(n || 0);
  const sign = num < 0 ? "-" : "";
  const abs = Math.abs(num);
  return `${sign}${abs.toFixed(2)}`;
};

export const totalInpaymentsNet = (rows = []) => {
  const sum = (rows || []).reduce((acc, r) => acc + Number(r?.amount || 0), 0);
  return fmtMoney(sum);
};

export const inpaymentsRowsCount = (rows = []) => (rows || []).length;

export const topFeeConceptByAbs = (rows = []) => {
  // amount-description con mayor abs (sumado por concepto)
  const map = new Map();

  for (const r of rows || []) {
    const concept = String(r?.AMOUNT_DESCRIPTION ?? "").trim();
    if (!concept) continue;
    const amt = Number(r?.amount || 0);
    map.set(concept, (map.get(concept) || 0) + amt);
  }

  let bestConcept = "—";
  let bestAbs = -1;

  for (const [concept, sum] of map.entries()) {
    const abs = Math.abs(sum);
    if (abs > bestAbs) {
      bestAbs = abs;
      bestConcept = concept;
    }
  }

  return bestConcept;
};

export const reserveMovementNet = (rows = []) => {
  const reserveConcepts = new Set([
    "Previous Reserve Amount Balance",
    "Current Reserve Amount",
  ]);

  const sum = (rows || []).reduce((acc, r) => {
    const concept = String(r?.AMOUNT_DESCRIPTION ?? "").trim();
    if (!reserveConcepts.has(concept)) return acc;
    return acc + Number(r?.amount || 0);
  }, 0);

  return fmtMoney(sum);
};
