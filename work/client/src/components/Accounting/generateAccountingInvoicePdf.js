import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import signatureImage from './assets/invoice-signature-placeholder.png';
import { COMPANY_INFO, INVOICE_DEFAULTS } from './invoiceConstants.js';
import {
  formatClientAddressLines,
  formatInvoiceAmount,
  formatInvoiceDate,
  formatInvoiceUnitPrice,
} from './invoiceFormatters.js';

// ─── Layout constants derived from the template ────────────────────────────────
// A4: 210 × 297 mm. Left/right margins: 10 mm each → content width = 190 mm.
const MARGIN = 10;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = 190;

// Column unit widths (mm), tuned from the XLS column grid
const COL_B = 2.43;
const COL_D = 5.86;

// ─── Section widths (must sum to CONTENT_WIDTH = 190) ─────────────────────────
const W = {
  // Products table
  pNum: COL_B + COL_D,
  pConcept: 19 * COL_D,
  pQty: 4 * COL_D,
  pPrice: 4 * COL_D,
  pAmount: 4 * COL_D,

  // Meta table
  mFecha: COL_B + 5 * COL_D,
  mNumero: 7 * COL_D,
  mRef: 7 * COL_D,
  mExtern: 13 * COL_D,

  // Payment row
  payLabel: COL_B + 5 * COL_D,

  // IVA row
  ivaGap: COL_B + 3 * COL_D,
  ivaLabel: 17 * COL_D,
  ivaTipo: 4 * COL_D,
  ivaBase: 4 * COL_D,
  ivaCuota: 4 * COL_D,

  // Totals row
  totPorLabel: COL_B + 5 * COL_D,
  totPorVal: 8 * COL_D,
  totGap: 14 * COL_D,
  totTotalLbl: 1 * COL_D,
  totTotalVal: 4 * COL_D,

  // Observations / Firma y sello
  obs: COL_B + 24 * COL_D,
  firma: 8 * COL_D,

  // Client block (right side)
  clientLabelOffset: COL_B + 17 * COL_D,
  clientBoxOffset: COL_B + 18 * COL_D,
  clientBoxWidth: 13 * COL_D,
};

// ─── Typography & colour ───────────────────────────────────────────────────────
const FONT = 'helvetica';
const LINE_COLOR = [0, 0, 0];
const RED_COLOR = [220, 0, 0];
const THIN_LW = 0.2;
const MEDIUM_LW = 0.5;
const LH9 = 3.5;

// ─── Line-weight helpers ───────────────────────────────────────────────────────
const setThin = (doc) => {
  doc.setDrawColor(...LINE_COLOR);
  doc.setLineWidth(THIN_LW);
};

const setMedium = (doc) => {
  doc.setDrawColor(...LINE_COLOR);
  doc.setLineWidth(MEDIUM_LW);
};

const setMediumRed = (doc) => {
  doc.setDrawColor(...RED_COLOR);
  doc.setLineWidth(MEDIUM_LW);
};

const setFont = (doc, size = 9, style = 'normal') => {
  doc.setFont(FONT, style);
  doc.setFontSize(size);
};

// ─── Generic bordered cell ─────────────────────────────────────────────────────
const cell = (doc, x, y, w, h, text, opts = {}) => {
  const {
    align = 'left',
    valign = 'top',
    fontSize = 8,
    bold = false,
    padding = 1.2,
    border = 'thin',
    lineHeight,
    textColor = [0, 0, 0],
  } = opts;

  if (border === 'thin') setThin(doc);
  if (border === 'medium') setMedium(doc);
  if (border === 'mediumRed') setMediumRed(doc);
  if (border !== 'none') doc.rect(x, y, w, h);

  doc.setFont(FONT, bold ? 'bold' : 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(...textColor);

  const lh = lineHeight ?? fontSize * 0.38;
  const avail = w - padding * 2;
  const lines = doc.splitTextToSize(String(text ?? ''), avail);
  const totalTH = lines.length * lh;
  const startY =
    valign === 'middle' ? y + (h - totalTH) / 2 + lh : y + padding + lh;

  lines.forEach((line, i) => {
    const tx =
      align === 'right'
        ? x + w - padding
        : align === 'center'
          ? x + w / 2
          : x + padding;
    doc.text(line, tx, startY + i * lh, {
      align:
        align === 'center' ? 'center' : align === 'right' ? 'right' : 'left',
    });
  });

  doc.setTextColor(0, 0, 0);
};

const loadSignatureImage = () =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = signatureImage;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

// ─── Section drawers ───────────────────────────────────────────────────────────

/** Supplier block (left side). Returns bottom Y. */
const drawSupplierBlock = (doc, y) => {
  const x = MARGIN;
  let cy = y;

  setFont(doc, 10, 'bold');
  COMPANY_INFO.nameLines.forEach((line, i) => {
    doc.text(line, x, cy + i * (LH9 + 0.5));
  });
  cy += COMPANY_INFO.nameLines.length * (LH9 + 0.5) + 2;

  setFont(doc, 9, 'normal');
  COMPANY_INFO.addressLines.forEach((line, i) => {
    doc.text(line, x, cy + i * LH9);
  });
  cy += COMPANY_INFO.addressLines.length * LH9 + 1.5;

  [
    COMPANY_INFO.nif,
    COMPANY_INFO.tel,
    COMPANY_INFO.email,
    COMPANY_INFO.iban,
  ].forEach((line, i) => doc.text(line, x, cy + i * LH9));

  return cy + 4 * LH9;
};

/**
 * Client block (right side). Returns bottom Y.
 *
 * startY    = baseline of the BAUBLOCK company name (owner name aligns here).
 * addrAlignY = baseline where the supplier "Dirección:" line is drawn, so the
 *              client "Dirección:" aligns horizontally with the supplier's.
 *
 *   "Cliente:"   ← labelY  (above box top)
 *   ┌──────────────────────────────────┐  ← boxTop = startY − PAD_TOP
 *   │                                  │  ← PAD_TOP gap (visible space)
 *   │  OWNER NAME (uppercase bold)     │  ← baseline at startY
 *   │                                  │
 *   │  Dirección ...                   │  ← baseline at addrAlignY
 *   │  NIF / Tel / E-Mail              │
 *   └──────────────────────────────────┘
 */
const drawClientBlock = (
  doc,
  startY,
  addrAlignY,
  owner,
  deliveryAddress,
  contactInfo,
  idType,
  idValue,
) => {
  const labelX = MARGIN + W.clientLabelOffset;
  const boxX = labelX;
  const boxW = PAGE_WIDTH - MARGIN - labelX;
  const textX = boxX + 2;
  const textW = boxW - 4;

  // PAD_TOP: visible gap between the top border and the first text line
  const PAD_TOP = 4;
  const PAD_BOTTOM = 2;

  // Box top border sits PAD_TOP mm above the owner name baseline
  const boxTop = startY - PAD_TOP;

  // "Cliente:" label just above the box top border
  const labelY = boxTop - 1;
  setFont(doc, 9, 'normal');
  doc.text('Cliente:', labelX, labelY);

  // Measure name (need bold font active for correct width)
  const ownerName = String(owner?.c_name || '').toUpperCase();
  setFont(doc, 9, 'bold');
  const nameLines = doc.splitTextToSize(ownerName, textW).slice(0, 2);

  setFont(doc, 9, 'normal');
  const addrLines = formatClientAddressLines(deliveryAddress);
  const detailLines = [
    `${idType}: ${idValue}`,
    `Tel: ${contactInfo?.phone_number_mobile || contactInfo?.phone_mobile || ''}`,
    `E-Mail: ${contactInfo?.email || ''}`,
  ];

  // Actual Y positions for each section
  const nameStartY = startY; // aligned with BAUBLOCK
  const nameEndY = nameStartY + nameLines.length * LH9 + 1.5;
  const addrStartY = Math.max(nameEndY, addrAlignY); // aligned with supplier Dirección
  const addrEndY = addrStartY + addrLines.length * LH9 + 1;
  const detailEndY = addrEndY + detailLines.length * LH9;

  const boxH = detailEndY + PAD_BOTTOM - boxTop;

  setThin(doc);
  doc.rect(boxX, boxTop, boxW, boxH);

  // Draw owner name
  setFont(doc, 9, 'bold');
  nameLines.forEach((l, i) => doc.text(l, textX, nameStartY + i * LH9));

  // Draw address lines (horizontally aligned with supplier Dirección)
  setFont(doc, 9, 'normal');
  addrLines.forEach((l, i) => doc.text(l, textX, addrStartY + i * LH9));

  // Draw NIF / Tel / E-Mail
  detailLines.forEach((l, i) => doc.text(l, textX, addrEndY + i * LH9));

  return boxTop + boxH;
};

/** Draw supplier + client blocks. Returns lower bottom Y + gap. */
const drawAddressBlocks = (
  doc,
  owner,
  deliveryAddress,
  contactInfo,
  idType,
  idValue,
) => {
  const startY = 14;
  // Y baseline where the supplier "Dirección:" line is drawn — client Dirección aligns here
  const addrAlignY = startY + COMPANY_INFO.nameLines.length * (LH9 + 0.5) + 2;
  const leftBottom = drawSupplierBlock(doc, startY);
  const rightBottom = drawClientBlock(
    doc,
    startY,
    addrAlignY,
    owner,
    deliveryAddress,
    contactInfo,
    idType,
    idValue,
  );
  return Math.max(leftBottom, rightBottom) + 5;
};

/** "Factura" centered title bar with bottom rule. */
const drawFacturaTitle = (doc, y) => {
  cell(doc, MARGIN, y, CONTENT_WIDTH, 8, 'Factura', {
    fontSize: 16,
    bold: true,
    valign: 'middle',
    align: 'center',
    border: 'none',
  });
  setThin(doc);
  // doc.line(MARGIN, y + 8, MARGIN + CONTENT_WIDTH, y + 8);
  return y + 8;
};

/** 4-column meta table (Fecha / Número / Referencia cliente / Id. externa de orden). */
const drawMetaTable = (
  doc,
  y,
  invoiceDate,
  invoiceNumber,
  clientReference,
  externalOrderId,
) => {
  const x = MARGIN;
  const widths = [W.mFecha, W.mNumero, W.mRef, W.mExtern];
  const hdrH = 6;
  const valH = 16;
  const headers = [
    'Fecha',
    'Número',
    'Referencia cliente',
    'Id. externa de orden',
  ];
  const values = [
    invoiceDate,
    invoiceNumber || '-',
    clientReference || '-',
    externalOrderId || '-',
  ];

  let cx = x;
  headers.forEach((h, i) => {
    cell(doc, cx, y, widths[i], hdrH, h, {
      fontSize: 9,
      bold: true,
      valign: 'middle',
      align: 'center',
      border: 'thin',
    });
    cell(doc, cx, y + hdrH, widths[i], valH, values[i], {
      fontSize: 9,
      valign: 'top',
      align: 'center',
      border: 'thin',
    });
    cx += widths[i];
  });

  return y + hdrH + valH + 2;
};

/** Forma de pago row. */
const drawPaymentRow = (doc, y) => {
  cell(doc, MARGIN, y, W.payLabel, 7, 'Forma de pago', {
    fontSize: 9,
    bold: true,
    valign: 'middle',
    border: 'thin',
  });
  cell(
    doc,
    MARGIN + W.payLabel,
    y,
    CONTENT_WIDTH - W.payLabel,
    7,
    INVOICE_DEFAULTS.paymentForm,
    {
      fontSize: 9,
      valign: 'middle',
      align: 'center',
      border: 'thin',
    },
  );
  return y + 9;
};

/** Products table + Subtotal row. */
const drawProductsSection = (doc, y, invoiceLines, subtotal) => {
  const colWidths = [W.pNum, W.pConcept, W.pQty, W.pPrice, W.pAmount];
  const body = (invoiceLines || []).map((line) => [
    line.numero,
    line.concepto,
    `${line.cantidad} ${line.unidad}`,
    formatInvoiceUnitPrice(line.precio),
    formatInvoiceAmount(line.importe),
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: CONTENT_WIDTH,
    theme: 'grid',
    head: [['N', 'Concepto', 'Cantidad', 'Precio', 'Importe']],
    body,
    styles: {
      font: FONT,
      fontSize: 8,
      cellPadding: 1.2,
      lineWidth: THIN_LW,
      lineColor: LINE_COLOR,
      textColor: [0, 0, 0],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: THIN_LW,
      lineColor: LINE_COLOR,
      halign: 'center',
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      lineWidth: THIN_LW,
      lineColor: LINE_COLOR,
    },
    columnStyles: {
      0: { cellWidth: colWidths[0], halign: 'center' },
      1: { cellWidth: colWidths[1], halign: 'left' },
      2: { cellWidth: colWidths[2], halign: 'center' },
      3: { cellWidth: colWidths[3], halign: 'right' },
      4: { cellWidth: colWidths[4], halign: 'right' },
    },
  });

  const afterY = doc.lastAutoTable.finalY;
  const labelW = W.pNum + W.pConcept + W.pQty + W.pPrice;
  cell(doc, MARGIN, afterY, labelW, 6, 'Subtotal', {
    fontSize: 8,
    bold: true,
    valign: 'middle',
    border: 'thin',
  });
  cell(
    doc,
    MARGIN + labelW,
    afterY,
    W.pAmount,
    6,
    formatInvoiceAmount(subtotal),
    {
      fontSize: 8,
      valign: 'middle',
      align: 'right',
      border: 'thin',
    },
  );

  return afterY + 8;
};

/** IVA section — header row + value row. */
const drawVatSection = (doc, y, vatRate, base, cuota) => {
  // The IVA header row: only Tipo / Base / Cuota headers (right-aligned columns)
  const x0 = MARGIN + W.ivaGap + W.ivaLabel;

  cell(doc, x0, y, W.ivaTipo, 6, 'Tipo', {
    fontSize: 8,
    bold: true,
    valign: 'middle',
    align: 'center',
    border: 'thin',
  });
  cell(doc, x0 + W.ivaTipo, y, W.ivaBase, 6, 'Base', {
    fontSize: 8,
    bold: true,
    valign: 'middle',
    align: 'center',
    border: 'thin',
  });
  cell(doc, x0 + W.ivaTipo + W.ivaBase, y, W.ivaCuota, 6, 'Cuota', {
    fontSize: 8,
    bold: true,
    valign: 'middle',
    align: 'center',
    border: 'thin',
  });

  // Value row: "IVA:" label — NO border, right-aligned text only
  cell(doc, MARGIN, y + 6, W.ivaGap + W.ivaLabel, 6, 'IVA:', {
    fontSize: 8,
    bold: true,
    valign: 'middle',
    align: 'right',
    border: 'none',
  });
  cell(doc, x0, y + 6, W.ivaTipo, 6, `${vatRate}%`, {
    fontSize: 8,
    valign: 'middle',
    align: 'center',
    border: 'thin',
  });
  cell(doc, x0 + W.ivaTipo, y + 6, W.ivaBase, 6, formatInvoiceAmount(base), {
    fontSize: 8,
    valign: 'middle',
    align: 'right',
    border: 'thin',
  });
  cell(
    doc,
    x0 + W.ivaTipo + W.ivaBase,
    y + 6,
    W.ivaCuota,
    6,
    formatInvoiceAmount(cuota),
    {
      fontSize: 8,
      valign: 'middle',
      align: 'right',
      border: 'thin',
    },
  );

  return y + 14;
};

/**
 * "Por pagar" / "Total de factura" row.
 * "Por pagar" label and its value box are rendered in RED to match the template.
 * EUR labels appear below each value box.
 */
const drawTotalsSection = (doc, y, total) => {
  const x = MARGIN;
  const xPorVal = x + W.totPorLabel;
  const xTotalLbl = x + W.totPorLabel + W.totPorVal + W.totGap;
  const xTotalVal = xTotalLbl + W.totTotalLbl;
  const rowH = 7;

  // ── "Por pagar" label — RED ──────────────────────────────────────────────────
  doc.setTextColor(...RED_COLOR);
  setFont(doc, 9, 'bold');
  doc.text('Por pagar', x, y + rowH / 2 + 1.5);

  // "Por pagar" value box — red border + red text
  setMediumRed(doc);
  doc.rect(xPorVal, y, W.totPorVal, rowH);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(9);
  doc.text(
    formatInvoiceAmount(total),
    xPorVal + W.totPorVal / 2,
    y + rowH / 2 + 1.5,
    {
      align: 'center',
    },
  );

  // Reset to black
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(...LINE_COLOR);

  // ── "Total de factura:" label + value box — BLACK ────────────────────────────
  setFont(doc, 9, 'bold');
  doc.text(
    'Total de factura:',
    xTotalLbl + W.totTotalLbl - 1,
    y + rowH / 2 + 1.5,
    {
      align: 'right',
    },
  );

  setMedium(doc);
  doc.rect(xTotalVal, y, W.totTotalVal, rowH);
  setFont(doc, 9, 'bold');
  doc.text(
    formatInvoiceAmount(total),
    xTotalVal + W.totTotalVal - 1.2,
    y + rowH / 2 + 1.5,
    {
      align: 'right',
    },
  );

  // ── EUR currency labels below ─────────────────────────────────────────────────
  setFont(doc, 8, 'normal');
  const eurY = y + rowH + 3;
  // EUR under "Por pagar" box → RED (same colour as the box)
  doc.setTextColor(...RED_COLOR);
  doc.text('EUR', xPorVal + W.totPorVal / 2, eurY, { align: 'center' });
  // EUR under "Total de factura" box → black
  doc.setTextColor(0, 0, 0);
  doc.text('EUR', xTotalVal + W.totTotalVal - 1.2, eurY, { align: 'right' });

  return y + rowH + 8;
};

/**
 * Observations + Firma y sello block.
 *
 * Observations column has THREE bordered rows:
 *   ┌──────────────── Observaciones ────────────────┐
 *   │  "Nº de Registro..." (centered)               │
 *   ├───────────────────────────────────────────────┤
 *   │  Bank: Banco Bilbao...                        │
 *   │  El pagador es responsable...                 │
 *   └───────────────────────────────────────────────┘
 *
 * Firma y sello column: NO borders — just the label text + logo image.
 */
const drawObservationsAndSignature = async (
  doc,
  description,
  y,
  signatureImg,
) => {
  const x = MARGIN;
  const hdrH = 6; // "Observaciones" header row height
  const envH = 14; // env register sub-cell height
  const bankH = 16; // bank + payer note sub-cell height
  const totalH = hdrH + envH + bankH;

  const textX = x + 2;
  const textW = W.obs - 4;

  // ── "Observaciones" header cell (bordered) ───────────────────────────────────
  cell(doc, x, y, W.obs, hdrH, 'Observaciones', {
    fontSize: 9,
    bold: true,
    valign: 'middle',
    align: 'center',
    border: 'thin',
  });

  // ── "Firma y sello" label — NO border, just text ─────────────────────────────
  setFont(doc, 9, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Firma y sello', x + W.obs + W.firma / 2, y + hdrH / 2 + 1.5, {
    align: 'center',
  });

  // ── Sub-cell 1: env register, centered ───────────────────────────────────────
  setThin(doc);
  doc.rect(x, y + hdrH, W.obs, envH);
  setFont(doc, 7, 'normal');
  doc.setTextColor(0, 0, 0);
  // Center the env register text vertically and horizontally
  const envLines = doc.splitTextToSize(description, textW);
  const envLH = 3.0;
  const envTotalH = envLines.length * envLH;
  const envStartY = y + hdrH + (envH - envTotalH) / 2 + envLH;
  envLines.forEach((line, i) => {
    doc.text(line, x + W.obs / 2, envStartY + i * envLH, { align: 'center' });
  });

  // ── Sub-cell 2: bank footer + payer note together ─────────────────────────────
  setThin(doc);
  doc.rect(x, y + hdrH + envH, W.obs, bankH);
  setFont(doc, 7, 'normal');
  doc.text(INVOICE_DEFAULTS.bankFooter, textX, y + hdrH + envH + 4, {
    maxWidth: textW,
  });
  doc.text(INVOICE_DEFAULTS.payerNote, textX, y + hdrH + envH + 10, {
    maxWidth: textW,
  });

  // ── Logo image — NO border box ───────────────────────────────────────────────
  if (signatureImg) {
    const bx = x + W.obs + 2;
    const by = y + hdrH + 2;
    const bw = W.firma - 4;
    const bh = envH + bankH - 4;
    const sc = Math.min(bw / signatureImg.width, bh / signatureImg.height);
    const iw = signatureImg.width * sc;
    const ih = signatureImg.height * sc;
    doc.addImage(
      signatureImage,
      'PNG',
      bx + (bw - iw) / 2,
      by + (bh - ih) / 2,
      iw,
      ih,
    );
  }

  return y + totalH + 4;
};

// ─── Public export ─────────────────────────────────────────────────────────────
export const generateAccountingInvoicePdf = async ({
  orderCartData,
  invoiceLines,
  vatValue,
  idType,
  idValue,
  clientReference,
  description,
  invoiceNumber,
}) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const owner = orderCartData?.owner || {};
  const contactInfo = orderCartData?.contactInfo || {};
  const deliveryAddress = orderCartData?.deliveryAddress || {};

  const subtotal = Number(vatValue?.vat_euro_origin ?? 0);
  const vatRate = Number(vatValue?.vat_procent ?? 0);
  const vatAmount = Number(vatValue?.vat_euro ?? 0);
  const total = Number(vatValue?.vat_result ?? 0);

  try {
    const signatureImg = await loadSignatureImage().catch(() => null);

    setFont(doc);

    let y = drawAddressBlocks(
      doc,
      owner,
      deliveryAddress,
      contactInfo,
      idType,
      idValue,
    );
    y = drawFacturaTitle(doc, y + 2);
    y = drawMetaTable(
      doc,
      y + 5, // ~one line of breathing room between the Factura rule and the table
      formatInvoiceDate(),
      invoiceNumber || orderCartData?.article,
      clientReference,
      orderCartData?.article,
    );
    y = drawPaymentRow(doc, y);
    y = drawProductsSection(doc, y, invoiceLines, subtotal);
    y = drawVatSection(doc, y, vatRate, subtotal, vatAmount);
    y = drawTotalsSection(doc, y, total);
    y = await drawObservationsAndSignature(doc, description, y, signatureImg);

    return doc;
  } catch (error) {
    console.error('Failed to generate accounting invoice PDF', error);
    return null;
  }
};
