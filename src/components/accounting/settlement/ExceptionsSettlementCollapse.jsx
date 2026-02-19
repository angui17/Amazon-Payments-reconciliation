import React, { useMemo, useState } from "react";
import "../../../styles/collapsable.css";

const ExceptionsSettlementCollapse = ({ exceptionsData, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  const fees = useMemo(
    () => (exceptionsData?.feesMissingAccounts && Array.isArray(exceptionsData.feesMissingAccounts)
      ? exceptionsData.feesMissingAccounts
      : []),
    [exceptionsData]
  );

  const hasMissing = fees.length > 0;

  // impacto = suma de totals (puede venir negativo)
  const impact = useMemo(() => {
    if (!hasMissing) return 0;
    return fees.reduce((acc, f) => acc + Number(f?.total ?? 0), 0);
  }, [fees, hasMissing]);

  const missingCount = useMemo(() => {
    if (!hasMissing) return 0;
    return fees.reduce((acc, f) => acc + Number(f?.count ?? 0), 0);
  }, [fees, hasMissing]);

  return (
    <div className="collapsable-card" style={{ marginTop: 20 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="collapsable-header"
        aria-expanded={open}
      >
        <div style={{ textAlign: "left" }}>
          <div className="collapsable-title">Exceptions for this settlement</div>
        </div>

        <div className={`collapsable-icon ${open ? "open" : "closed"}`}>▸</div>
      </button>

      {open && (
        <div className="collapsable-body">
          {!hasMissing ? (
            <>
              <div style={{ fontSize: 13, opacity: 0.85 }}>
                ✅ No missing fee account mappings for this settlement.
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="kpi-card kpi-warning">
                  <div className="kpi-title">Missing mappings</div>
                  <div className="kpi-value">{missingCount}</div>
                  <div className="kpi-change">Fee account mappings missing</div>
                </div>

                <div className="kpi-card kpi-warning">
                  <div className="kpi-title">Impact</div>
                  <div className="kpi-value">{impact}</div>
                  <div className="kpi-change">Total impacted amount</div>
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
                Fix: add mapping in @CTS_AMAZON_FEES (U_acct).
              </div>

              {/* después metemos la tabla description/count/total */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExceptionsSettlementCollapse;
