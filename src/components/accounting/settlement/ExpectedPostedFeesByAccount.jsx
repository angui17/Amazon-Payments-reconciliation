import React, { useMemo } from "react";

// helper safe
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const money = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// agrupa lines por account y suma amounts
const sumPostedByAccount = (lines) => {
  const map = new Map();

  (Array.isArray(lines) ? lines : []).forEach((l) => {
    // intentamos varios nombres comunes
    const account =
      l?.account ??
      l?.glAccount ??
      l?.gl_account ??
      l?.Account ??
      l?.GLAccount ??
      "—";

    // monto posteado: intentamos varios nombres comunes
    const amount =
      l?.amount ??
      l?.postedAmount ??
      l?.posted ??
      l?.total ??
      l?.Amount ??
      0;

    const key = String(account || "—").trim() || "—";
    map.set(key, (map.get(key) ?? 0) + num(amount));
  });

  return map; // Map(account -> postedSum)
};

// normaliza expectedFeesByAccount a [{account, expected}]
const normalizeExpected = (expectedFeesByAccount) => {
  if (!expectedFeesByAccount) return [];

  // Caso A: viene como array [{account, expected}, ...]
  if (Array.isArray(expectedFeesByAccount)) {
    return expectedFeesByAccount.map((x) => ({
      account: String(x?.account ?? x?.glAccount ?? x?.Account ?? "—").trim() || "—",
      expected: num(x?.expected ?? x?.amount ?? x?.total ?? 0),
    }));
  }

  // Caso B: viene como objeto { "6000": 123, "6100": 456 }
  if (typeof expectedFeesByAccount === "object") {
    return Object.entries(expectedFeesByAccount).map(([k, v]) => ({
      account: String(k).trim() || "—",
      expected: num(v),
    }));
  }

  return [];
};

const ExpectedPostedFeesByAccount = ({ expectedFeesByAccount, lines }) => {
  const rows = useMemo(() => {
    const expectedArr = normalizeExpected(expectedFeesByAccount);
    const postedMap = sumPostedByAccount(lines);

    // si no hay expected, devolvemos vacío (para mostrar mensaje)
    if (!expectedArr.length) return [];

    // armamos comparación solo sobre cuentas esperadas
    const out = expectedArr.map((e) => {
      const posted = postedMap.get(e.account) ?? 0;
      const expected = num(e.expected);
      const diff = expected - posted;

      return {
        account: e.account,
        expected,
        posted,
        difference: diff,
      };
    });

    // orden: por mayor diferencia absoluta (más “dolor” arriba)
    out.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

    return out;
  }, [expectedFeesByAccount, lines]);

  const hasExpected = useMemo(() => normalizeExpected(expectedFeesByAccount).length > 0, [expectedFeesByAccount]);

  if (!hasExpected) {
    return (
      <div className="card table-card" style={{ marginTop: 16 }}>
        <div className="table-header">
          <h3>Expected vs Posted Fees by Account</h3>
        </div>

        <div className="table-container">
          <div className="empty-row">
            No expected fees by account were provided for this settlement.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card table-card" style={{ marginTop: 16 }}>
      <div className="table-header">
        <h3>Expected vs Posted Fees by Account</h3>
      </div>

      <div className="table-container">
        <table className="settlements-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Account</th>
              <th style={{ textAlign: "right" }}>Expected</th>
              <th style={{ textAlign: "right" }}>Posted</th>
              <th style={{ textAlign: "right" }}>Difference</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => {
              const diffClass = r.difference === 0 ? "diff-ok" : r.difference > 0 ? "diff-warn" : "diff-bad";

              return (
                <tr key={r.account}>
                  <td>{r.account}</td>
                  <td style={{ textAlign: "right" }}>{money(r.expected)}</td>
                  <td style={{ textAlign: "right" }}>{money(r.posted)}</td>
                  <td style={{ textAlign: "right" }} className={diffClass}>
                    {money(r.difference)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpectedPostedFeesByAccount;
