import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportSettlementsToPdf = ({
  rows = [],
  title = "Settlements Report",
}) => {
  const doc = new jsPDF("l", "pt"); // landscape

  doc.setFontSize(14);
  doc.text(title, 40, 40);

  if (!rows.length) {
    doc.text("No data available", 40, 80);
    doc.save("settlements.pdf");
    return;
  }

  const columns = [
    { header: "Settlement ID", dataKey: "settlementId" },
    { header: "Date", dataKey: "date" },
    { header: "Status", dataKey: "status" },
    { header: "Amazon Total", dataKey: "amazonTotal" },
    { header: "SAP Total", dataKey: "sapTotal" },
    { header: "Difference", dataKey: "difference" },
  ];

  const body = rows.map((r) => ({
    settlementId: r.settlementId ?? r.SETTLEMENT_ID ?? "-",
    date: r.date ?? r.DATE ?? "-",
    status: r.status ?? r.STATUS ?? "-",
    amazonTotal: r.amazonTotal ?? r.AMAZON_TOTAL ?? 0,
    sapTotal: r.sapTotal ?? r.SAP_TOTAL ?? 0,
    difference:
      (r.amazonTotal ?? 0) - (r.sapTotal ?? 0),
  }));

  autoTable(doc, {
    startY: 70,
    columns,
    body,
    styles: {
      fontSize: 9,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [255, 107, 0],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save("settlements-page.pdf");
};
