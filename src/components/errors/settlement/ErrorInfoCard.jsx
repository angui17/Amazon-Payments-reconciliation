import React from "react";
import RecordInfoCard from "../../common/RecordInfoCard";

const errorStatusMapper = (v) => {
  const code = String(v || "").toUpperCase();
  if (code === "P") return { label: "Pending", badge: "pending" };
  if (code === "C") return { label: "Completed", badge: "success" };
  return { label: String(v ?? "—"), badge: null };
};

const ErrorInfoCard = ({ row }) => {
  return (
    <RecordInfoCard
      record={row}
      title="Error settlement data"
      subtitle="Key fields from the selected error record."
      statusKey="status"
      statusMapper={errorStatusMapper}
      hiddenKeys={[
        "rn",
        "rawJson",
      ]}
    />
  );
};

export default ErrorInfoCard;
