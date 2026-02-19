import React, { useMemo, useState } from "react";

import "../../../styles/collapsable.css";

import JournalSummaryCard from "./JournalSummaryCard";
import SapJournalEntriesTable from "./SapJournalEntriesTable";
import ExceptionsSettlementInfo from "./ExceptionsSettlementInfo";

const JournalEntriesCollapse = ({ journalData, defaultOpen = false, exceptionsData = null, exceptionsLoading = false }) => {
    const [open, setOpen] = useState(defaultOpen);

    const summary = useMemo(() => journalData?.summary ?? null, [journalData]);

    const journalsArr = journalData?.journals ?? [];
    const linesArr = journalData?.lines ?? [];
    const headersCount = summary?.journalHeadersCount ?? 0;

    const showTable = headersCount > 0 && journalsArr.length > 0;
    const shouldShowExceptions = headersCount === 0;


    return (
        <div className="collapsable-card">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="collapsable-header"
                aria-expanded={open}
            >
                <div style={{ textAlign: "left" }}>
                    <div className="collapsable-title">
                        SAP Journal Entries details
                    </div>

                </div>

                <div
                    className={`collapsable-icon ${open ? "open" : "closed"
                        }`}
                >
                    ▸
                </div>
            </button>

            {open && (
                <div className="collapsable-body">
                    {summary ? (
                        <>
                            <JournalSummaryCard
                                summary={summary}
                                journals={journalData?.journals ?? []}
                            />

                            {shouldShowExceptions && (
                                <>
                                    {exceptionsLoading ? (
                                        <div className="collapsable-empty">Loading exceptions…</div>
                                    ) : exceptionsData ? (
                                        <ExceptionsSettlementInfo exceptionsData={exceptionsData} />
                                    ) : (
                                        <div className="collapsable-empty">No exceptions data available.</div>
                                    )}
                                </>
                            )}

                            {showTable && (
                                <SapJournalEntriesTable
                                    journals={journalsArr}
                                    lines={linesArr} />
                            )}
                        </>
                    ) : (
                        <div className="collapsable-empty">
                            No journal summary available.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JournalEntriesCollapse;
