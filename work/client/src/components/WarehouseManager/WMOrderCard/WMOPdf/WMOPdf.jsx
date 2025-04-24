import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import image from './headerPDF.jpg';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useWarehouseContext } from '#components/contexts/WarehouseContext.js';

const loadImage = () => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

const WMOPdf = ({ orderCartData, toggle }) => {
  const { wmoctProduct, wmoctProductShippedBD, saveHandler } = useWarehouseContext();
  const { latestProducts } = useProductsContext();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfData, setPdfData] = useState({});

  const generatePDF = async () => {
    if (!orderCartData) {
      console.error('❌ Ошибка: orderData не загружено');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');

    try {
      const img = await loadImage();
      const pageWidth = doc.internal.pageSize.getWidth(); // Ширина страницы
      const imgWidth = pageWidth - 20; // Отступы 10 мм слева и справа
      const imgHeight = (imgWidth * img.height) / img.width; // Пропорциональная высота

      doc.addImage(img, 'JPEG', 10, 10, imgWidth, imgHeight);

      // Смещаем начало текста на высоту изображения + отступ
      let yPosition = 10 + imgHeight + 10; // 10 мм отступ после картинки

      // Основные данные заказа
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`DATOS DEL CLIENTE`, 10, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(`FACTURAR A: ${pdfData?.cliente.facturar}`, 10, yPosition + 6);
      doc.text(`DOMICILIO: ${pdfData?.cliente.domicilio}`, 10, yPosition + 12);
      doc.text(`CIF: ${pdfData?.cliente.cif}`, 10, yPosition + 18);
      doc.text(`TELÉFONO: ${pdfData?.cliente.telefono}`, 10, yPosition + 24);
      doc.text(`S/REFERENCIA: ${pdfData?.facturar}`, 10, yPosition + 30);
      doc.text(`PEDIDO Nº: ${pdfData?.cliente.pedido}`, 10, yPosition + 36);

      // Правая часть: ALBARAN DE SALIDA + FECHA
      doc.setFont(undefined, `bold`);
      doc.text(`ALBARAN DE SALIDA `, 140, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(`Nº ALBARAN: ${pdfData?.facturar}`, 140, yPosition + 6);
      doc.text(`FECHA: ${pdfData?.formattedDate}`, 140, yPosition + 20);

      // Сдвигаем y для следующего блока
      yPosition += 50;

      // Блок "LUGAR DE ENTREGA"
      doc.setFont(undefined, `bold`);
      doc.text(`LUGAR DE ENTREGA`, 10, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(`DOMICILIO: ${pdfData?.lugar.domicilio}`, 10, yPosition + 6);
      doc.text(`CONTACTO: ${pdfData?.lugar.contacto}`, 10, yPosition + 12);
      doc.text(`TELÉFONO: ${pdfData?.lugar.telefono}`, 10, yPosition + 18);
      doc.text(`LUGAR DE CARGA: ${pdfData?.facturar}`, 10, yPosition + 24);

      // Правая часть: TRANSPORTE
      doc.setFont(undefined, `bold`);
      doc.text(`TRANSPORTE`, 140, yPosition);
      doc.setFont(undefined, `normal`);
      doc.text(`AGENCIA TRANSPORTE: ${pdfData?.facturar}`, 140, yPosition + 6);
      doc.text(`MATRÍCULA: ${pdfData?.facturar}`, 140, yPosition + 12);

      doc.setFont(undefined, `bold`);
      doc.text(`PALET`, 140, yPosition + 20);
      doc.text(`PESO`, 170, yPosition + 20);
      doc.setFont(undefined, `normal`);
      doc.text(`${pdfData?.palet}`, 140, yPosition + 26);
      doc.text(`${pdfData?.peso}`, 170, yPosition + 26);

      // Таблица с товарами (начинается ниже текста)
      autoTable(doc, {
        startY: yPosition + 40, // Отступ от информации о заказе
        head: [['Código', 'Descripción', 'Unidades', 'Palet']],
        body: pdfData.pdfProducts?.map((item) => [
          item.código,
          item.descripcion,
          item.unidades,
          item.palet,
        ]),
        styles: {
          fontSize: 10,
        },
        headStyles: {
          textColor: 'white',
          fillColor: [255, 0, 0], // ярко-красный фон
        },
      });

      // Генерация PDF URL
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

      return doc;
    } catch (error) {
      console.error('❌ Ошибка загрузки изображения:', error);
    }
  };

  useEffect(() => {
    console.log('🔄 Данные заказа обновлены:', orderCartData);
    const { article, contactInfo, owner } = orderCartData;

    let pallet_sum = 0;

    const today = new Date();
    const nextMonthDate = new Date(today);
    nextMonthDate.setMonth(today.getMonth() + 1);
    const formattedDate = nextMonthDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const pdfProducts = wmoctProduct?.map((prod) => {
      const { article, shipped } = prod;
      const bd_ship = wmoctProductShippedBD.find((el) => el.article == article);
      const product = latestProducts.find((el) => el.article == article);

      const descripcion = `BAUBLOCK®${
        product.tradingMark
      } ${product.lengths.toString()}x${product.width}x${product.height}mm ${
        product.density
      }kg/m³`;

      pallet_sum += shipped - bd_ship.shipped;

      const palet = shipped - bd_ship.shipped;

      const unidades = palet * product.quantityBlockOnPallet;

      if (palet == 0) return {};
      return {
        código: article,
        descripcion,
        unidades,
        palet: palet,
      };
    });

    const cliente = {
      facturar: owner?.c_name,
      domicilio: contactInfo?.address,
      cif: owner?.cif_vat,
      telefono: contactInfo?.phone_number_mobile,
      pedido: article,
    };

    const lugar = {
      domicilio: contactInfo.address,
      contacto: `${contactInfo.first_name} ${contactInfo.last_name}`,
      telefono: contactInfo?.phone_number_mobile,
    };

    setPdfData({
      cliente,
      lugar,
      formattedDate: formattedDate || '',
      peso: 0,
      palet: pallet_sum,
      pdfProducts,
    });

    setPdfUrl(null); // Сбрасываем предыдущий PDF
  }, []);

  useEffect(() => {
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
              Скачать PDF
            </button>
            <button
              style={{ width: '8%' }}
              onClick={() => {
                saveHandler();
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
