import React from "react";
import RecordInfoCard from "../../common/RecordInfoCard";

const accountingStatusMapper = (v) => {
  const code = String(v || "").toUpperCase();
  if (code === "P") return { label: "Pending", badge: "pending" };
  if (code === "C") return { label: "Completed", badge: "success" };
  return { label: String(v ?? "—"), badge: null };
};

const AccountingInfoCard = ({ row }) => {
  return (
    <RecordInfoCard
      record={row}
      title="Accounting settlement data"
      subtitle="Key fields from the selected settlement record."
      statusKey="status"
      statusMapper={accountingStatusMapper}
      hiddenKeys={[
        "rn",
        "rawJson",
        "sapPaymentsCount",
      ]}
    />
  );
};

export default AccountingInfoCard;
