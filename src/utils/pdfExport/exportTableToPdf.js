import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const defaultFormat = (v) => (v === null || v === undefined ? "" : String(v));

export const exportRowsToPdf = ({
  rows = [],
  columns = [],
  title = "Export",
  fileName = "export.pdf",
  orientation = "l", // landscape
}) => {
  const doc = new jsPDF(orientation, "pt");

  doc.setFontSize(14);
  doc.text(title, 40, 40);

  if (!rows.length) {
    doc.setFontSize(11);
    doc.text("No data available", 40, 70);
    doc.save(fileName);
    return;
  }

  // headers
  const head = [columns.map((c) => c.header)];

  // body
  const body = rows.map((r) =>
    columns.map((c) => {
      const raw = typeof c.accessor === "function" ? c.accessor(r) : r?.[c.accessor];
      const val = c.format ? c.format(raw, r) : raw;
      return defaultFormat(val);
    })
  );

  // alineación por columna (autoTable)
  const columnStyles = {};
  columns.forEach((c, i) => {
    if (c.align) columnStyles[i] = { halign: c.align };
  });

  autoTable(doc, {
    startY: 70,
    head,
    body,
    styles: {
      fontSize: 9,
      cellPadding: 6,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [255, 107, 0],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles,
  });

  doc.save(fileName);
};
