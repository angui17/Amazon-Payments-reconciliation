import React, { useEffect, useState } from "react";


const AccountingSettlementDetail = () => {
    return (
        <div className="main-content page active">
            <div
                className="content-header"
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <div>
                    <h1>Settlement: {settlementId}</h1>
                    <p>Detailed accounting information for the selected settlement.</p>
                </div>

                <button className="chart-action" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
            </div>
        </div>
    );
};

export default AccountingSettlementDetail;
