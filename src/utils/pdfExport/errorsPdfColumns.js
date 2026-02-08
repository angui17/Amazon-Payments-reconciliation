import { money } from "../settlementsTableUtils"; 

export const errorsPdfColumns = [
  {
    header: "Settlement ID",
    accessor: (r) => r.settlementId ?? "-",
  },
  {
    header: "Deposit Date",
    accessor: (r) => r.depositDateDate ?? "-",
  },
  {
    header: "Amazon Total",
    accessor: (r) => Number(r.amazonTotalReported ?? 0),
    format: (v) => money(v),
    align: "right",
  },
  {
    header: "SAP Total",
    accessor: (r) => Number(r.sapPaymentsTotal ?? 0),
    format: (v) => money(v),
    align: "right",
  },
  {
    header: "Diff",
    accessor: (r) => Number(r.difference ?? 0),
    format: (v) => money(v),
    align: "right",
  },
  {
    header: "Flags",
    accessor: (r) => {
      const diff = Number(r.difference ?? 0);
      const hasDiff = Number(r.flagDiff ?? 0) === 1 || diff !== 0;
      const hasNoSap = Number(r.flagNoSap ?? 0) === 1;
      const hasAmazonInternal =
        Number(r.flagAmazonInternal ?? 0) === 1 ||
        Number(r.amazonInternalDiff ?? 0) !== 0;

      const flags = [];
      if (hasDiff) flags.push("Diff");
      if (hasNoSap) flags.push("No SAP");
      if (hasAmazonInternal) flags.push("Amazon Internal");

      return flags.length ? flags.join(", ") : "OK";
    },
  },
  {
    header: "Status",
    accessor: (r) => r.status ?? "-",
  },
];
