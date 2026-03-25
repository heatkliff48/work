import React, { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import image from './headerPDF.jpg';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

const loadImage = () => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

const getTypeByArticle = (article = '') => {
  if (article.startsWith('T.')) return 'product';
  if (article.startsWith('X.P')) return 'relMat';
  if (article.startsWith('X.T')) return 'tool';
  if (article.startsWith('X.M')) return 'dryMixed';
  if (article.startsWith('X.F')) return 'anchor';
  return 'product';
};

const WMOPdf = ({ orderCartData, toggle }) => {
  const {
    wmoctProduct,
    wmoctProductShippedBD,
    saveHandler,
    additionalInfoPDF,
    aldabaranNum,
    wmoctProductDeltaForPdf,
  } = useWarehouseContext();

  const { latestProducts } = useProductsContext();
  const { latestDryMix, latestAnchors, latestTools, latestRelatedMaterials } =
    useProductsTypeJournalContext();

  const [pdfUrl, setPdfUrl] = useState(null);

  const productMap = useMemo(
    () => ({
      product: latestProducts,
      dryMixed: latestDryMix,
      anchor: latestAnchors,
      tool: latestTools,
      relMat: latestRelatedMaterials,
    }),
    [
      latestProducts,
      latestDryMix,
      latestAnchors,
      latestTools,
      latestRelatedMaterials,
    ],
  );

  const pdfData = useMemo(() => {
    if (!orderCartData) return null;
    if (!Array.isArray(wmoctProduct)) return null;

    const { article: orderArticle, contactInfo, owner } = orderCartData;

    let pallet_sum = 0;
    let pallet_weight = 0;

    const today = new Date();
    const nextMonthDate = new Date(today);
    nextMonthDate.setMonth(today.getMonth() + 1);

    const formattedDate = nextMonthDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const pdfProducts = wmoctProduct
      ?.map((prod) => {
        const article = prod?.article ?? '';

        const type = getTypeByArticle(article);

        // const bd_ship = wmoctProductShippedBD?.find(
        //   (el) => el.article === article && el.order_id === prod.order_id
        // );

        // const shippedNow = Number(prod?.shipped) || 0;
        // const shippedBD = Number(bd_ship?.shipped) || 0;

        const productArr = productMap[type] || [];
        const product = productArr.find((el) => el.article == article);

        const descripcion = product?.name
          ? `BAUBLOCK®${product?.name} `
          : `BAUBLOCK®${product?.tradingMark ?? ''} ${(
              product?.lengths ?? []
            ).toString()}x${product?.width ?? ''}x${product?.height ?? ''}mm ${
              product?.density ?? ''
            }kg/m³`;

        const deltaRow = (wmoctProductDeltaForPdf || []).find(
          (x) => x.article === article,
        );

        const palet = Number(deltaRow?.delta ?? deltaRow?.palet ?? 0) || 0;

        pallet_sum += palet;

        const valuue =
          product?.quantityBlockOnPallet ?? product?.units_per_pallet ?? 1;

        const unidades = (Number(palet) || 0) * (Number(valuue) || 1);

        if (palet === 0) return null;

        pallet_weight += Number(product?.weightDef) || 0;

        return {
          código: article,
          descripcion,
          unidades,
          palet,
        };
      })
      ?.filter(Boolean);

    const carga = 'Avenida Isaac Newton N17, 11500 El Pto. Sta. Maria Cadiz';

    const cliente = {
      facturar: owner?.c_name ?? '',
      domicilio: contactInfo?.address ?? '',
      cif: owner?.cif_vat ?? '',
      telefono: contactInfo?.phone_number_mobile ?? '',
      pedido: orderArticle ?? '',
      referencia: additionalInfoPDF?.referencia ?? '',
    };

    const lugar = {
      domicilio: contactInfo?.address ?? '',
      contacto: `${contactInfo?.first_name ?? ''} ${
        contactInfo?.last_name ?? ''
      }`.trim(),
      telefono: contactInfo?.phone_number_mobile ?? '',
      carga,
    };

    const transporte = {
      agencia: additionalInfoPDF?.agencia ?? '',
      matricula: additionalInfoPDF?.matricula ?? '',
    };

    const peso = (Number(pallet_sum) || 0) * (Number(pallet_weight) || 0);

    return {
      cliente,
      lugar,
      transporte,
      formattedDate: formattedDate || '',
      peso,
      palet: pallet_sum,
      pdfProducts: pdfProducts || [],
    };
  }, [
    orderCartData,
    wmoctProduct,
    wmoctProductShippedBD,
    productMap,
    additionalInfoPDF,
  ]);

  const generatePDF = async () => {
    if (!orderCartData) {
      console.error('❌ Ошибка: orderData не загружено');
      return;
    }
    if (!pdfData) return;

    const doc = new jsPDF('p', 'mm', 'a4');

    try {
      const img = await loadImage();
      const pageWidth = doc.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (imgWidth * img.height) / img.width;

      doc.addImage(img, 'JPEG', 10, 10, imgWidth, imgHeight);

      let yPosition = 10 + imgHeight + 10;

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`DATOS DEL CLIENTE`, 10, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(`FACTURAR A: ${pdfData?.cliente.facturar}`, 10, yPosition + 6);
      doc.text(`DOMICILIO: ${pdfData?.cliente.domicilio}`, 10, yPosition + 12);
      doc.text(`CIF: ${pdfData?.cliente.cif}`, 10, yPosition + 18);
      doc.text(`TELÉFONO: ${pdfData?.cliente.telefono}`, 10, yPosition + 24);
      doc.text(`S/REFERENCIA: ${pdfData?.cliente?.referencia}`, 10, yPosition + 30);
      doc.text(`PEDIDO Nº: ${pdfData?.cliente.pedido}`, 10, yPosition + 36);

      doc.setFont(undefined, `bold`);
      doc.text(`ALBARAN DE SALIDA `, 140, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(`Nº ALBARAN: ${aldabaranNum}`, 140, yPosition + 6);
      doc.text(`FECHA: ${pdfData?.formattedDate}`, 140, yPosition + 20);

      yPosition += 50;

      doc.setFont(undefined, `bold`);
      doc.text(`LUGAR DE ENTREGA`, 10, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(`DOMICILIO: ${pdfData?.lugar.domicilio}`, 10, yPosition + 6);
      doc.text(`CONTACTO: ${pdfData?.lugar.contacto}`, 10, yPosition + 12);
      doc.text(`TELÉFONO: ${pdfData?.lugar.telefono}`, 10, yPosition + 18);
      doc.text(`LUGAR DE CARGA: ${pdfData?.lugar.carga}`, 10, yPosition + 24, {
        maxWidth: 80,
      });

      doc.setFont(undefined, `bold`);
      doc.text(`TRANSPORTE`, 140, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(
        `AGENCIA TRANSPORTE: ${pdfData?.transporte.agencia}`,
        140,
        yPosition + 6,
      );
      doc.text(`MATRÍCULA: ${pdfData?.transporte.matricula}`, 140, yPosition + 12);

      doc.setFont(undefined, `bold`);
      doc.text(`PALET`, 140, yPosition + 20);
      doc.text(`PESO`, 170, yPosition + 20);
      doc.setFont(undefined, `normal`);
      doc.text(`${pdfData?.palet ?? 0}`, 140, yPosition + 26);
      doc.text(`${pdfData?.peso ?? 0}`, 170, yPosition + 26);

      autoTable(doc, {
        startY: yPosition + 40,
        head: [['Código', 'Descripción', 'Unidades', 'Palet']],
        body: (pdfData?.pdfProducts || []).map((item) => [
          item.código,
          item.descripcion,
          item.unidades,
          item.palet,
        ]),
        styles: { fontSize: 10 },
        headStyles: {
          textColor: 'white',
          fillColor: [255, 0, 0],
        },
      });

      const pdfBlob = doc.output('blob');
      const nextUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(nextUrl);

      return doc;
    } catch (error) {
      console.error('❌ Ошибка загрузки изображения:', error);
    }
  };

  useEffect(() => {
    setPdfUrl(null);
    if (!pdfData) return;
    generatePDF();
  }, [pdfData]);

  const downloadPDF = async () => {
    const doc = await generatePDF();
    if (doc) doc.save('presupuesto.pdf');
  };

  return (
    <div className="pdf-preview-container">
      {pdfUrl && (
        <div>
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="PDF Preview"
          ></iframe>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={{ width: '8%' }} onClick={downloadPDF}>
              Download PDF
            </button>
            <button
              style={{ width: '8%' }}
              onClick={async () => {
                await saveHandler();
                toggle();
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WMOPdf;
