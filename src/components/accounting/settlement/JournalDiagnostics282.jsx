import React, { useMemo, useState } from "react";

const safeJson = (s, fallback) => {
  if (!s) return fallback;
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
};

const money = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const SeverityChip = ({ severity = "INFO" }) => {
  const sev = String(severity || "INFO").toUpperCase();
  const cls =
    sev === "ERROR" ? "chip chip-error" :
    sev === "WARN" ? "chip chip-warn" :
    "chip chip-info";

  return <span className={cls}>{sev}</span>;
};

const JournalDiagnostics282 = ({ settlementId, data, loading, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  // si defaultOpen cambia (navegación), mantenelo sincronizado
  React.useEffect(() => setOpen(defaultOpen), [defaultOpen]);

  const totals = useMemo(() => {
    const arr = safeJson(data?.totals, []);
    return arr?.[0] ?? { count: 0, totalNet: 0 };
  }, [data]);

  const breakdown = useMemo(() => safeJson(data?.breakdown, []), [data]);
  const checks = useMemo(() => safeJson(data?.checks, []), [data]);
  const feesMissingAccounts = useMemo(() => safeJson(data?.feesMissingAccounts, []), [data]);

  const noCtsData = Number(totals?.count ?? 0) === 0;

  return (
    <div className="card table-card" style={{ marginTop: 16 }}>
      <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Diagnostics Journal Entries</h3>

        <button className="chart-action" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide diagnostics" : "Show diagnostics"}
        </button>
      </div>

      {open ? (
        <div className="table-container" style={{ padding: 14 }}>
          {loading ? (
            <div className="chart-skeleton chart-skeleton-bars" style={{ height: 180 }} />
          ) : !data ? (
            <div className="empty-row">No diagnostics data available.</div>
          ) : noCtsData ? (
            <div className="empty-row">
              <strong>No CTS_AMAZON_SALES data found for this settlement.</strong>{" "}
              Verify that the settlement was loaded.{" "}
              <span style={{ color: "#6b7280" }}>({settlementId})</span>
            </div>
          ) : (
            <>
              {/* B4.1 Totals */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Totals</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>Rows in CTS_AMAZON_SALES</div>
                    <div style={{ fontWeight: 700 }}>{Number(totals.count ?? 0)}</div>
                  </div>
                  <div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>Net total</div>
                    <div style={{ fontWeight: 700 }}>{money(totals.totalNet ?? 0)}</div>
                  </div>
                </div>
              </div>

              {/* B4.2 Breakdown */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Breakdown (TYPE / STATUS)</div>
                {breakdown.length === 0 ? (
                  <div className="empty-row">No breakdown rows.</div>
                ) : (
                  <table className="settlements-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Type</th>
                        <th style={{ textAlign: "left" }}>Status</th>
                        <th style={{ textAlign: "right" }}>Count</th>
                        <th style={{ textAlign: "right" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdown.map((r, idx) => (
                        <tr key={`${r.type}-${r.status}-${idx}`}>
                          <td>{r.type ?? "-"}</td>
                          <td>{r.status ?? "-"}</td>
                          <td style={{ textAlign: "right" }}>{Number(r.count ?? 0)}</td>
                          <td style={{ textAlign: "right" }}>{money(r.total ?? 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* B4.3 Checks */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Checks</div>

                {checks.length === 0 ? (
                  <div className="empty-row">No checks.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {checks.map((c, idx) => (
                      <div key={`${c.code}-${idx}`} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <SeverityChip severity={c.severity} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.message}</div>
                          {c.code ? <div style={{ color: "#6b7280", fontSize: 12 }}>{c.code}</div> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* opcional: mostrar feesMissingAccounts si querés */}
              {Array.isArray(feesMissingAccounts) && feesMissingAccounts.length > 0 ? (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Fees missing accounts</div>
                  <div className="empty-row">{feesMissingAccounts.join(", ")}</div>
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default JournalDiagnostics282;
