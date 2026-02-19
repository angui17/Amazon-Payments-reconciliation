import React, { useMemo } from "react";
import KPICard from "../../common/KPICard";
import { money } from "../../../utils/settlementsTableUtils";

const JournalSummaryCard = ({ summary, journals = [] }) => {
  const headersCount = useMemo(() => summary?.journalHeadersCount ?? 0, [summary]);
  const linesCount = useMemo(() => summary?.journalLinesCount ?? 0, [summary]);

  const hasNoJournals = useMemo(() => {
    // condición de tu SP 270 cuando no hay asientos
    const jCount = Array.isArray(journals) ? journals.length : 0;
    return headersCount === 0 && jCount === 0;
  }, [headersCount, journals]);

  const { balancedCount, unbalancedCount, totalDebit, totalCredit } = useMemo(() => {
    const arr = Array.isArray(journals) ? journals : [];

    let balanced = 0;
    let unbalanced = 0;
    let debit = 0;
    let credit = 0;

    for (const j of arr) {
      const b = Number(j?.balanced);
      if (b === 1) balanced += 1;
      else if (b === 0) unbalanced += 1;

      debit += Number(j?.totalDebit ?? 0);
      credit += Number(j?.totalCredit ?? 0);
    }

    return { balancedCount: balanced, unbalancedCount: unbalanced, totalDebit: debit, totalCredit: credit };
  }, [journals]);

  if (!summary) return null;

  // ✅ MODO VACÍO: solo 1 card + mensaje
  if (hasNoJournals) {
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <KPICard
            title="Journal Headers"
            value={0}
            trend="neutral"
            change="Accounting documents created in SAP"
          />
        </div>

        {/* <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
          ✅ No journal entries found for this settlement in SAP (OJDT.U_CTS_SettlementID).
        </div> */}
      </div>
    );
  }

  // ✅ MODO NORMAL: 5 cards
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: 12,
      }}
    >
      <KPICard
        title="Journal Headers"
        value={headersCount}
        trend="neutral"
        change="Accounting documents created in SAP"
      />

      <KPICard
        title="Journal Lines"
        value={linesCount}
        trend="neutral"
        change="Debit and credit entries within the journals"
      />

      <KPICard
        title="Balanced entries"
        value={balancedCount}
        change="Journals where total debit equals total credit"
        trend={balancedCount === headersCount ? "success" : "warning"}
      />

      <KPICard
        title="Unbalanced entries"
        value={unbalancedCount}
        change="Journals with debit/credit mismatch"
        trend={unbalancedCount > 0 ? "danger" : "success"}
      />

      <KPICard
        title="Total Debit / Credit"
        value={`${money(totalDebit)} / ${money(totalCredit)}`}
        change="Sum of debit and credit amounts across journals"
        trend={Math.abs(totalDebit - totalCredit) < 0.0001 ? "success" : "warning"}
      />
    </div>
  );
};

export default JournalSummaryCard;