import React from "react";
import SapInvoicesTableSkeleton from "./SapInvoicesTableSkeleton";
import SapInvoicesTable from "./SapInvoicesTable";

const SapInvoicesTableSection = ({ loading, rows = [], skeletonRows = 10 }) => {
  if (loading) return <SapInvoicesTableSkeleton rows={skeletonRows} />;
  return <SapInvoicesTable rows={rows} />;
};

export default SapInvoicesTableSection;
