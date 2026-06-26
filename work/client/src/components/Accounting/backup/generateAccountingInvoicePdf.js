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

const MARGIN = 10;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_COLOR = [0, 0, 0];
const LINE_WIDTH = 0.2;
const TOP_SPACE = 14;
const DOCUMENT_FONT = 'helvetica';
const FONT_SIZE_DEFAULT = 9;
const FONT_SIZE_TITLE = 10;
const LINE_HEIGHT_9 = 4;
const LINE_HEIGHT_10 = 4.4;
const CLIENT_BOX_X = 102;
const CLIENT_BOX_PADDING_TOP = 3;
const CLIENT_BOX_PADDING_X = 3;

const COLUMN_FRACTIONS = {
  meta: [6, 7, 7, 14],
  paymentLabel: 6,
  products: [2, 19, 4, 4, 5],
};

const toWidths = (fractions) => {
  const total = fractions.reduce((sum, part) => sum + part, 0);
  return fractions.map((part) => (CONTENT_WIDTH * part) / total);
};

const loadSignatureImage = () =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = signatureImage;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

const setDrawStyle = (doc) => {
  doc.setDrawColor(...LINE_COLOR);
  doc.setLineWidth(LINE_WIDTH);
};

const drawCell = (doc, x, y, width, height, text, options = {}) => {
  const {
    align = 'left',
    valign = 'top',
    fontSize = 8,
    fontStyle = 'normal',
    padding = 1.5,
    maxWidth,
  } = options;

  setDrawStyle(doc);
  doc.rect(x, y, width, height);

  doc.setFont(DOCUMENT_FONT, fontStyle);
  doc.setFontSize(fontSize);

  const lines = doc.splitTextToSize(String(text ?? ''), maxWidth || width - padding * 2);
  const lineHeight = fontSize * 0.45;
  let textY = y + padding + lineHeight;

  if (valign === 'middle') {
    textY = y + (height - lines.length * lineHeight) / 2 + lineHeight;
  }

  lines.forEach((line, index) => {
    const textX =
      align === 'right'
        ? x + width - padding
        : align === 'center'
          ? x + width / 2
          : x + padding;

    doc.text(line, textX, textY + index * lineHeight, {
      align: align === 'left' ? 'left' : align,
    });
  });
};

const drawRow = (doc, x, y, widths, cells, rowHeight, rowOptions = {}) => {
  let cursorX = x;
  cells.forEach((cell, index) => {
    drawCell(doc, cursorX, y, widths[index], rowHeight, cell.text, {
      ...rowOptions,
      ...cell,
    });
    cursorX += widths[index];
  });
};

const setDocumentFont = (doc, fontSize = FONT_SIZE_DEFAULT, fontStyle = 'normal') => {
  doc.setFont(DOCUMENT_FONT, fontStyle);
  doc.setFontSize(fontSize);
};

const splitToMaxLines = (doc, text, maxWidth, maxLines, fontSize, fontStyle) => {
  setDocumentFont(doc, fontSize, fontStyle);
  return doc.splitTextToSize(String(text ?? ''), maxWidth).slice(0, maxLines);
};

const drawSupplierBlock = (doc, startY) => {
  const leftX = MARGIN;
  let y = startY;

  setDocumentFont(doc, FONT_SIZE_TITLE, 'bold');
  COMPANY_INFO.nameLines.forEach((line, index) => {
    doc.text(line, leftX, y + index * LINE_HEIGHT_10);
  });
  y += COMPANY_INFO.nameLines.length * LINE_HEIGHT_10 + 2;

  setDocumentFont(doc, FONT_SIZE_DEFAULT, 'normal');
  COMPANY_INFO.addressLines.forEach((line, index) => {
    doc.text(line, leftX, y + index * LINE_HEIGHT_9);
  });
  y += COMPANY_INFO.addressLines.length * LINE_HEIGHT_9 + 1;

  [COMPANY_INFO.nif, COMPANY_INFO.tel, COMPANY_INFO.email, COMPANY_INFO.iban].forEach(
    (line, index) => {
      doc.text(line, leftX, y + index * LINE_HEIGHT_9);
    },
  );

  return y + 4 * LINE_HEIGHT_9;
};

const drawClientBlock = (
  doc,
  startY,
  owner,
  deliveryAddress,
  contactInfo,
  idType,
  idValue,
) => {
  const boxRight = PAGE_WIDTH - MARGIN;
  const boxWidth = boxRight - CLIENT_BOX_X;
  const textX = CLIENT_BOX_X + CLIENT_BOX_PADDING_X;
  const textWidth = boxWidth - CLIENT_BOX_PADDING_X * 2;

  setDocumentFont(doc, FONT_SIZE_DEFAULT, 'normal');
  doc.text('Cliente:', CLIENT_BOX_X, startY);

  const boxTop = startY + LINE_HEIGHT_9 + 1.5;
  const clientNameLines = splitToMaxLines(
    doc,
    owner?.c_name || '',
    textWidth,
    2,
    FONT_SIZE_DEFAULT,
    'normal',
  );
  const clientAddressLines = formatClientAddressLines(deliveryAddress);
  const clientDetailLines = [
    `${idType}: ${idValue}`,
    `Tel: ${contactInfo?.phone_number_mobile || contactInfo?.phone_mobile || ''}`,
    `E-Mail: ${contactInfo?.email || ''}`,
  ];

  const contentHeight =
    CLIENT_BOX_PADDING_TOP +
    clientNameLines.length * LINE_HEIGHT_9 +
    2 +
    clientAddressLines.length * LINE_HEIGHT_9 +
    1 +
    clientDetailLines.length * LINE_HEIGHT_9 +
    2;

  setDrawStyle(doc);
  doc.rect(CLIENT_BOX_X, boxTop, boxWidth, contentHeight);

  let y = boxTop + CLIENT_BOX_PADDING_TOP;

  clientNameLines.forEach((line, index) => {
    doc.text(line, textX, y + index * LINE_HEIGHT_9);
  });
  y += clientNameLines.length * LINE_HEIGHT_9 + 2;

  clientAddressLines.forEach((line, index) => {
    doc.text(line, textX, y + index * LINE_HEIGHT_9);
  });
  y += clientAddressLines.length * LINE_HEIGHT_9 + 1;

  clientDetailLines.forEach((line, index) => {
    doc.text(line, textX, y + index * LINE_HEIGHT_9);
  });

  return boxTop + contentHeight;
};

const drawAddressBlocks = (doc, owner, deliveryAddress, contactInfo, idType, idValue) => {
  const startY = TOP_SPACE;
  const leftBottom = drawSupplierBlock(doc, startY);
  const rightBottom = drawClientBlock(
    doc,
    startY,
    owner,
    deliveryAddress,
    contactInfo,
    idType,
    idValue,
  );

  return Math.max(leftBottom, rightBottom) + 6;
};

const drawFacturaTitle = (doc, y) => {
  drawCell(doc, MARGIN, y, CONTENT_WIDTH, 8, 'Factura', {
    fontSize: 14,
    fontStyle: 'bold',
    valign: 'middle',
    align: 'left',
  });
  return y + 8;
};

const drawMetaTable = (
  doc,
  y,
  invoiceDate,
  invoiceNumber,
  clientReference,
  externalOrderId,
) => {
  const widths = toWidths(COLUMN_FRACTIONS.meta);
  const headerHeight = 6;
  const valueHeight = 14;

  drawRow(
    doc,
    MARGIN,
    y,
    widths,
    [
      { text: 'Fecha' },
      { text: 'Número' },
      { text: 'Referencia cliente' },
      { text: 'Id. externa de orden' },
    ],
    headerHeight,
    { fontStyle: 'bold', fontSize: 8 },
  );

  drawRow(
    doc,
    MARGIN,
    y + headerHeight,
    widths,
    [
      { text: invoiceDate },
      { text: invoiceNumber || '-' },
      { text: clientReference || '-' },
      { text: externalOrderId || '-' },
    ],
    valueHeight,
    { fontSize: 8, valign: 'top' },
  );

  return y + headerHeight + valueHeight + 2;
};

const drawPaymentRow = (doc, y) => {
  const labelWidth = (CONTENT_WIDTH * COLUMN_FRACTIONS.paymentLabel) / 34;
  const valueWidth = CONTENT_WIDTH - labelWidth;

  drawCell(doc, MARGIN, y, labelWidth, 7, 'Forma de pago', {
    fontStyle: 'bold',
    valign: 'middle',
  });
  drawCell(doc, MARGIN + labelWidth, y, valueWidth, 7, INVOICE_DEFAULTS.paymentForm, {
    valign: 'middle',
  });

  return y + 9;
};

const drawProductsSection = (doc, y, invoiceLines, subtotal) => {
  const widths = toWidths(COLUMN_FRACTIONS.products);
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
    head: [['№', 'Concepto', 'Cantidad', 'Precio', 'Importe']],
    body,
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      lineWidth: LINE_WIDTH,
      lineColor: LINE_COLOR,
      textColor: [0, 0, 0],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineWidth: LINE_WIDTH,
      lineColor: LINE_COLOR,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      lineWidth: LINE_WIDTH,
      lineColor: LINE_COLOR,
    },
    columnStyles: {
      0: { cellWidth: widths[0], halign: 'center' },
      1: { cellWidth: widths[1] },
      2: { cellWidth: widths[2], halign: 'center' },
      3: { cellWidth: widths[3], halign: 'right' },
      4: { cellWidth: widths[4], halign: 'right' },
    },
  });

  const afterProductsY = doc.lastAutoTable.finalY;
  const importWidth = widths[4];
  const labelWidth = CONTENT_WIDTH - importWidth;

  drawCell(doc, MARGIN, afterProductsY, labelWidth, 6, 'Subtotal', {
    fontStyle: 'bold',
    valign: 'middle',
  });
  drawCell(doc, MARGIN + labelWidth, afterProductsY, importWidth, 6, formatInvoiceAmount(subtotal), {
    align: 'right',
    valign: 'middle',
  });

  return afterProductsY + 8;
};

const drawVatSection = (doc, y, vatRate, base, cuota) => {
  const tipoWidth = CONTENT_WIDTH * (4 / 34);
  const baseWidth = CONTENT_WIDTH * (4 / 34);
  const cuotaWidth = CONTENT_WIDTH * (5 / 34);
  const leftGap = CONTENT_WIDTH - tipoWidth - baseWidth - cuotaWidth;

  drawRow(
    doc,
    MARGIN + leftGap,
    y,
    [tipoWidth, baseWidth, cuotaWidth],
    [{ text: 'Tipo' }, { text: 'Base' }, { text: 'Cuota' }],
    6,
    { fontStyle: 'bold', align: 'center', valign: 'middle' },
  );

  drawCell(doc, MARGIN, y + 6, leftGap, 6, 'IVA:', {
    fontStyle: 'bold',
    valign: 'middle',
  });
  drawRow(
    doc,
    MARGIN + leftGap,
    y + 6,
    [tipoWidth, baseWidth, cuotaWidth],
    [
      { text: `${vatRate}`, align: 'center', valign: 'middle' },
      { text: formatInvoiceAmount(base), align: 'right', valign: 'middle' },
      { text: formatInvoiceAmount(cuota), align: 'right', valign: 'middle' },
    ],
    6,
  );

  return y + 14;
};

const drawTotalsSection = (doc, y, total) => {
  const porPagarLabelWidth = CONTENT_WIDTH * (6 / 34);
  const porPagarValueWidth = CONTENT_WIDTH * (1 / 34);
  const middleGap =
    CONTENT_WIDTH * (14 / 34) -
    porPagarLabelWidth -
    porPagarValueWidth;
  const totalLabelWidth = CONTENT_WIDTH * (4 / 34);
  const totalValueWidth = CONTENT_WIDTH * (5 / 34);

  drawCell(doc, MARGIN, y, porPagarLabelWidth, 7, 'Por pagar', {
    fontStyle: 'bold',
    valign: 'middle',
  });
  drawCell(
    doc,
    MARGIN + porPagarLabelWidth,
    y,
    porPagarValueWidth + middleGap,
    7,
    formatInvoiceAmount(total),
    { align: 'left', valign: 'middle' },
  );
  drawCell(
    doc,
    MARGIN + porPagarLabelWidth + porPagarValueWidth + middleGap,
    y,
    totalLabelWidth,
    7,
    'Total de factura:',
    { fontStyle: 'bold', align: 'right', valign: 'middle' },
  );
  drawCell(
    doc,
    MARGIN +
      porPagarLabelWidth +
      porPagarValueWidth +
      middleGap +
      totalLabelWidth,
    y,
    totalValueWidth,
    7,
    formatInvoiceAmount(total),
    { align: 'right', valign: 'middle' },
  );

  drawCell(doc, MARGIN + CONTENT_WIDTH * (12 / 34), y + 7, CONTENT_WIDTH * (2 / 34), 5, 'EUR', {
    align: 'center',
    valign: 'middle',
  });
  drawCell(doc, MARGIN + CONTENT_WIDTH * (29 / 34), y + 7, CONTENT_WIDTH * (5 / 34), 5, 'EUR', {
    align: 'right',
    valign: 'middle',
  });

  return y + 14;
};

const drawObservationsAndSignature = async (doc, y, signatureImg) => {
  const obsWidth = CONTENT_WIDTH * (19 / 34);
  const signWidth = CONTENT_WIDTH - obsWidth;
  const blockHeight = 28;

  drawCell(doc, MARGIN, y, obsWidth, 6, 'Observaciones', {
    fontStyle: 'bold',
    valign: 'middle',
  });
  drawCell(doc, MARGIN + obsWidth, y, signWidth, 6, 'Firma y sello', {
    fontStyle: 'bold',
    align: 'center',
    valign: 'middle',
  });

  drawCell(doc, MARGIN, y + 6, obsWidth, blockHeight - 6, INVOICE_DEFAULTS.envRegister, {
    valign: 'top',
    fontSize: 7,
  });

  setDrawStyle(doc);
  doc.rect(MARGIN + obsWidth, y + 6, signWidth, blockHeight - 6);

  if (signatureImg) {
    const boxX = MARGIN + obsWidth + 2;
    const boxY = y + 8;
    const boxWidth = signWidth - 4;
    const boxHeight = blockHeight - 10;
    const scale = Math.min(boxWidth / signatureImg.width, boxHeight / signatureImg.height);
    const imgWidth = signatureImg.width * scale;
    const imgHeight = signatureImg.height * scale;
    doc.addImage(
      signatureImage,
      'PNG',
      boxX + (boxWidth - imgWidth) / 2,
      boxY + (boxHeight - imgHeight) / 2,
      imgWidth,
      imgHeight,
    );
  }

  return y + blockHeight + 2;
};

const drawFooterNotes = (doc, y) => {
  doc.setFont(undefined, 'normal');
  doc.setFontSize(7);
  doc.text(INVOICE_DEFAULTS.bankFooter, MARGIN, y, { maxWidth: CONTENT_WIDTH });
  doc.text(INVOICE_DEFAULTS.payerNote, MARGIN, y + 8, { maxWidth: CONTENT_WIDTH });
};

export const generateAccountingInvoicePdf = async ({
  orderCartData,
  invoiceLines,
  vatValue,
  idType,
  idValue,
  clientReference,
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

    setDocumentFont(doc);

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
      y,
      formatInvoiceDate(),
      invoiceNumber || orderCartData?.article,
      clientReference,
      orderCartData?.article,
    );
    y = drawPaymentRow(doc, y);
    y = drawProductsSection(doc, y, invoiceLines, subtotal);
    y = drawVatSection(doc, y, vatRate, subtotal, vatAmount);
    y = drawTotalsSection(doc, y, total);
    y = await drawObservationsAndSignature(doc, y, signatureImg);
    drawFooterNotes(doc, y);

    return doc;
  } catch (error) {
    console.error('Failed to generate accounting invoice PDF', error);
    return null;
  }
};
