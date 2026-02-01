import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Info que trae por defecto
import SettlementInfoCard from "./settlement/SettlementInfoCard";
import { getAccountingSettlementDetails } from "../../api/accounting";

// kpi cards
import SettlementKPIs from "./settlement/SettlementKPIs";

// charts
import SettlementExtras from "./settlement/SettlementExtras";

// table 
import SettlementRowsTable from "./settlement/SettlementRowsTable";
import SettlementRowsTableSkeleton from "./settlement/SettlementRowsTableSkeleton";

const SettlementDetail = () => {
    const navigate = useNavigate();
    const { settlementId } = useParams();
    const { state } = useLocation();

    // row viene del navigate(..., { state: { row } })
    const row = state?.row || null;

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            console.log("WS 266 → fetching settlementId:", settlementId);

            const resp = await getAccountingSettlementDetails({ settlementId });

            console.log("WS 266 → response:", resp);
            setDetails(resp);
        } catch (err) {
            console.error("WS 266 → error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!settlementId) return;
        fetchDetails();
    }, [settlementId]);

    // ✅ summary real del WS 266
    const summary = details?.summary || null;

    // ✅ Info: preferimos summary (más confiable). Fallback: row (lo que vino por state)
    const infoSource = summary || row;

    return (
        <div className="main-content page active">
            <div className="content-header" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <h1>Settlement: {settlementId}</h1>
                    <p>Detailed accounting information for the selected settlement.</p>
                </div>

                <button className="chart-action" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>

            {/* Info que trae por defecto */}
            <SettlementInfoCard
                row={infoSource}
                allowKeys={["settlementId", "depositDateDate", "status", "amazonTotalReported", "sapPaymentsTotal", "difference", "sapPaymentsCount", "amazonInternalDiff", "reconciled"]} />

            {/* kpi cards */}
            <SettlementKPIs summary={summary} loading={loading} />

            {/* Table */}
           
  {loading ? (
    <SettlementRowsTableSkeleton rows={10} />
  ) : (
    <SettlementRowsTable rows={details?.rows || []} limit={10} />
  )}


            {/* charts */}
            <SettlementExtras details={details} summary={summary} loading={loading} />
        </div>
    );
};

export default SettlementDetail;
