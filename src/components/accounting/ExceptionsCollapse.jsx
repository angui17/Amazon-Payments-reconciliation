import React, { useState } from "react";
import "../../styles/collapsable.css";
import ExceptionsEmptyCard from "./ExceptionsEmptyCard";
import ExceptionsTable from "./ExceptionsTable";

const ExceptionsCollapse = ({
    defaultOpen = false,
    missingFeeSummary = null,
    missingFeeRows = [],
}) => {
    const [open, setOpen] = useState(defaultOpen);
    const count = Number(missingFeeSummary?.count ?? 0);
    const hasRows = Array.isArray(missingFeeRows) && missingFeeRows.length > 0;
    const showTable = count > 0 && hasRows;

    return (
        <div className="collapsable-card" style={{ marginBottom: 24 }}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="collapsable-header"
                aria-expanded={open}
            >
                <div style={{ textAlign: "left" }}>
                    <div className="collapsable-title">Exceptions</div>
                </div>

                <div className={`collapsable-icon ${open ? "open" : "closed"}`}>▸</div>
            </button>

            {open && <div className="collapsable-body">
                <ExceptionsEmptyCard summary={missingFeeSummary} rows={missingFeeRows} />
                {showTable ? (
                    <ExceptionsTable meta={`${missingFeeRows.length} results`} />
                ) :
                    <p className="text-center" style={{ margin: 24 }}>No missing fee account mappings found for this period.</p>
                }
            </div>}
        </div>
    );
};

export default ExceptionsCollapse;
