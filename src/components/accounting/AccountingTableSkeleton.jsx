import React from "react";
import AccountingTableHeaders from "./AccountingTableHeaders";
import "../../styles/settlementsTable.css";

const AccountingTableSkeleton = ({ rows = 6 }) => {
    return (
        <div className="card table-card">
            <div className="table-header" style={{ padding: 14 }}>
                <div>
                    <h3 style={{ margin: 0 }}>Settlements</h3>
                    <div className="table-meta">Loading…</div>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <AccountingTableHeaders />

                    <tbody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <tr key={i} className="sk-row">
                                <td><div className="sk-line" style={{ width: "120px" }} /></td>
                                <td><div className="sk-line" style={{ width: "110px" }} /></td>
                                <td><div className="sk-line" style={{ width: "80px" }} /></td>

                                <td className="th-center"><div className="sk-line" style={{ width: "90px", margin: "0 auto" }} /></td>
                                <td className="th-center"><div className="sk-line" style={{ width: "90px", margin: "0 auto" }} /></td>
                                <td className="th-center"><div className="sk-line" style={{ width: "90px", margin: "0 auto" }} /></td>

                                <td className="th-center"><div className="sk-line" style={{ width: "60px", margin: "0 auto" }} /></td>
                                <td className="th-center"><div className="sk-line" style={{ width: "90px", margin: "0 auto" }} /></td>
                                <td className="th-center"><div className="sk-line" style={{ width: "90px", margin: "0 auto" }} /></td>

                                <td className="th-center"><div className="sk-pill" /></td>
                                <td className="th-center"><div className="sk-line" style={{ width: "140px", margin: "0 auto" }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountingTableSkeleton;
