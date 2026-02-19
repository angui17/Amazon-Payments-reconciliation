import React, { useMemo } from "react";
import KPICard from "../../common/KPICard";
import { money } from "../../../utils/settlementsTableUtils";

const pillClass = (sev) => {
  const s = String(sev || "").toUpperCase();
  if (s === "ERROR") return "status-pill status-danger";
  if (s === "WARN" || s === "WARNING") return "status-pill status-warning";
  return "status-pill status-neutral";
};

const ExceptionsSettlementInfo = ({ exceptionsData }) => {
  const totals = exceptionsData?.totals ?? null;
  const breakdown = useMemo(() => exceptionsData?.breakdown ?? [], [exceptionsData]);
  const checks = useMemo(() => exceptionsData?.checks ?? [], [exceptionsData]);
  const fees = useMemo(() => exceptionsData?.feesMissingAccounts ?? [], [exceptionsData]);

  const missingCount = useMemo(
    () => fees.reduce((acc, f) => acc + Number(f?.count ?? 0), 0),
    [fees]
  );

  const impact = useMemo(
    () => fees.reduce((acc, f) => acc + Number(f?.total ?? 0), 0),
    [fees]
  );

  return (
    <div style={{ marginTop: 14 }}>
      <h3 style={{ margin: 14, color: "#cc5500" }}>Exceptions for this settlement</h3>
      {/* Mensaje principal por mappings */}
      {fees.length === 0 ? (
        <div style={{ fontSize: 13, opacity: 0.85,  margin: 14 }}>
          ✅ No missing fee account mappings for this settlement.
        </div>
      ) : (
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          Fix: add mapping in <b>@CTS_AMAZON_FEES</b> (<b>U_acct</b>).
        </div>
      )}
      {/* Mini KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <KPICard
          title="Missing mappings"
          value={missingCount}
          change="Fee account mappings missing"
          trend={missingCount > 0 ? "danger" : "success"}
        />
        <KPICard
          title="Impact"
          value={money(impact)}
          change="Total impacted amount"
          trend={impact !== 0 ? "warning" : "success"}
        />
        <KPICard
          title="Total Net"
          value={money(totals?.totalNet ?? 0)}
          change="Net total from totals[]"
          trend="neutral"
        />
        <KPICard
          title="Checks"
          value={checks.length}
          change="Diagnostics from WS 282"
          trend="neutral"
        />
        <KPICard
          title="Breakdown"
          value={breakdown.length}
          change="Types in breakdown[]"
          trend="neutral"
        />
      </div>

      {/* Checks */}
      {checks.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Checks</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {checks.map((c, idx) => (
              <span key={`${c?.code ?? "C"}-${idx}`} className={pillClass(c?.severity)}>
                {c?.code ?? "CHECK"}: {c?.message ?? "-"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExceptionsSettlementInfo;
