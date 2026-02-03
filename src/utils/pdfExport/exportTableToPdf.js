import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const asText = (v) => (v === null || v === undefined ? "" : String(v));

/**
 * columns: [{ header, accessor, format?, align? }]
 * headerBlocks: [{ label, value }]  // KPIs arriba (opcional)
 * chartImages: ["data:image/png;base64,..."] // charts abajo (opcional)
 */
export const exportRowsToPdf = ({
  rows = [],
  columns = [],
  title = "Export",
  fileName = "export.pdf",
  orientation = "l", // "l" landscape | "p" portrait
  headerBlocks = [],
  footerNote = "",
  chartImages = [], 
}) => {
  const doc = new jsPDF(orientation, "pt");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 40;
  let y = 40;

  // ===== Title =====
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text(asText(title), marginX, y);
  y += 22;

  // ===== Header blocks (KPIs) =====
  if (headerBlocks?.length) {
    const gap = 10;
    const boxW = (pageWidth - marginX * 2 - gap * 2) / 3; // 3 por fila
    const boxH = 40;

    headerBlocks.forEach((b, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);

      let x = marginX + col * (boxW + gap);
      let yy = y + row * (boxH + gap);

      // ✅ salto de página si no entra
      if (yy + boxH > pageHeight - 60) {
        doc.addPage();
        y = 40;
        yy = y; // ✅ recalculamos el y en la nueva página
        x = marginX + col * (boxW + gap);
      }

      // caja
      doc.setDrawColor(230);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, yy, boxW, boxH, 8, 8, "FD");

      // label
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.text(asText(b.label), x + 10, yy + 14);

      // value
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(12);
      doc.text(asText(b.value), x + 10, yy + 32);
    });

    const rowsUsed = Math.ceil(headerBlocks.length / 3);
    y += rowsUsed * (boxH + gap) + 12;
  }

  // ===== Empty state =====
  if (!rows.length) {
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("No data available", marginX, y);
    doc.save(fileName);
    return;
  }

  // ===== Table build =====
  const head = [columns.map((c) => c.header)];

  const body = rows.map((r) =>
    columns.map((c) => {
      const raw = typeof c.accessor === "function" ? c.accessor(r) : r?.[c.accessor];
      const val = c.format ? c.format(raw, r) : raw;
      return asText(val);
    })
  );

  const columnStyles = {};
  columns.forEach((c, i) => {
    if (c.align) columnStyles[i] = { halign: c.align };
  });

  autoTable(doc, {
    startY: y,
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
    margin: { left: marginX, right: marginX },
  });

  let afterTableY = (doc.lastAutoTable?.finalY ?? y) + 18;

  // ===== Footer note =====
  if (footerNote) {
    if (afterTableY > pageHeight - 40) {
      doc.addPage();
      afterTableY = 40;
    }

    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(asText(footerNote), marginX, afterTableY);
    afterTableY += 14;
  }

  // ===== Charts images =====
  if (chartImages?.length) {
    // si no entra el título de charts, saltamos
    if (afterTableY > pageHeight - 60) {
      doc.addPage();
      afterTableY = 40;
    }

    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text("Charts", marginX, afterTableY);
    afterTableY += 12;

    const gapX = 12;
    const imgW = (pageWidth - marginX * 2 - gapX) / 2; // 2 por fila
    const imgH = 260; // ✅ tu altura deseada

    for (let i = 0; i < chartImages.length; i++) {
      const img = chartImages[i];
      const col = i % 2;

      const x = marginX + col * (imgW + gapX);

      // si es nueva fila, sumamos altura
      if (col === 0 && i !== 0) afterTableY += imgH + 16;

      // salto de página si no entra la fila
      if (afterTableY + imgH > pageHeight - 40) {
        doc.addPage();
        afterTableY = 40;

        doc.setFontSize(12);
        doc.setTextColor(17, 24, 39);
        doc.text("Charts (cont.)", marginX, afterTableY);
        afterTableY += 12;
      }

      doc.addImage(img, "PNG", x, afterTableY, imgW, imgH);
    }
  }

  doc.save(fileName);
};
