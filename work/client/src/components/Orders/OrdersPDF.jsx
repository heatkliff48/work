import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import image from './headerPDF.jpg';
import { useProductsContext } from '#components/contexts/ProductContext.js';
import { useProductsTypeJournalContext } from '#components/contexts/ProductsTypeJournalContext.js';

import '#components/Styles/pdf.css';
import { getApiUrl } from '#utils/getApiUrl.js';
import './ordersView.css';

const loadImage = () => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

const PDFGenerator = ({ orderData, productList, vatValue }) => {
  const { latestProducts } = useProductsContext();
  const { dryMixesJournal, anchor, tool, relatedMaterialsJournal } =
    useProductsTypeJournalContext();

  const [pdfUrl, setPdfUrl] = useState({});
  const [pdfData, setPdfData] = useState({});

  // DEAL_ID и UF_NUMBER_OFFER — заполняются менеджером и хранятся в БД заказа
  const [dealId, setDealId] = useState(orderData?.deal_id ?? '');
  const [ufNumberOffer, setUfNumberOffer] = useState(
    orderData?.uf_number_offer ?? '',
  );

  // Подтягиваем значения, если orderData обновился (например, после загрузки заказа с сервера)
  useEffect(() => {
    if (orderData?.deal_id !== undefined) setDealId(orderData.deal_id);
    if (orderData?.uf_number_offer !== undefined) {
      setUfNumberOffer(orderData.uf_number_offer);
    }
  }, [orderData?.deal_id, orderData?.uf_number_offer]);

  const generatePDF = async () => {
    if (!orderData || !productList) {
      console.error('❌ Ошибка: orderData не загружено');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');

    console.log('pdfData OrdersPDF.jsx line 52', pdfData);
    try {
      const img = await loadImage();
      const pageWidth = doc.internal.pageSize.getWidth(); // Ширина страницы
      const fullTableWidth = pageWidth - 20;

      const baseTableOptions = {
        margin: {
          left: 10,
          right: 10,
        },

        // Таблица занимает ту же ширину,
        // что таблица с клиентом и таблица итогов
        tableWidth: fullTableWidth,

        theme: 'grid',

        // Внешняя рамка таблицы
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.3,

        styles: {
          fontSize: 6,

          // Белый фон и чёрный текст
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],

          // Чёрные границы ячеек
          lineColor: [0, 0, 0],
          lineWidth: 0.2,

          cellPadding: {
            top: 1.2,
            right: 1,
            bottom: 1.2,
            left: 1,
          },

          valign: 'middle',
          overflow: 'linebreak',
        },

        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },

        // Убираем серое чередование строк
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
      };
      const imgWidth = pageWidth - 20; // Отступы 10 мм слева и справа
      const imgHeight = (imgWidth * img.height) / img.width; // Пропорциональная высота

      doc.addImage(img, 'JPEG', 10, 10, imgWidth, imgHeight);

      // Смещаем начало текста на высоту изображения + отступ
      let yPosition = 10 + imgHeight + 10; // 10 мм отступ после картинки

      // Таблица с информацией о заказе и клиенте
      autoTable(doc, {
        startY: 10 + imgHeight + 4,
        margin: {
          left: 10,
          right: 10,
        },

        body: [
          ['Ref.:', pdfData.ref, 'Contacto:', pdfData.contact],
          ['Cliente:', pdfData.client, 'Mail contacto:', pdfData.email],
          ['CIF', pdfData.cif_vat ?? pdfData.cif, 'Teléfono:', pdfData.phone],
          ['Dirección:', pdfData.address, 'Válido hasta:', pdfData.validUntil],
        ],

        theme: 'grid',

        styles: {
          fontSize: 8,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.25,
          cellPadding: {
            top: 1.3,
            right: 1.5,
            bottom: 1.3,
            left: 1.5,
          },
          valign: 'middle',
        },

        columnStyles: {
          0: {
            cellWidth: 18,
            halign: 'left',
            fontStyle: 'normal',
          },
          1: {
            cellWidth: 82,
            halign: 'center',
          },
          2: {
            cellWidth: 24,
            halign: 'left',
            fontStyle: 'normal',
          },
          3: {
            cellWidth: 66,
            halign: 'center',
          },
        },
      });

      const infoTableEndY = doc.lastAutoTable.finalY;
      // Таблица с товарами (начинается ниже текста)
      if (pdfData.pdfProducts?.length) {
        autoTable(doc, {
          ...baseTableOptions,

          startY: infoTableEndY,

          head: [
            [
              'Ref.:',
              'Descripción',
              'Medición de proyecto, m2',
              'Total paletas, Ud',
              'm3/pal',
              'm2/pal',
              'blq/pal, Ud',
              'Total m2',
              'PVP neto € / m2',
              'Total, Ud',
              'PVP neto €/Ud',
              'Subtotal €',
            ],
          ],

          body: pdfData.pdfProducts.map((item) => [
            item.ref,
            item.descripcion,
            item.medición_de_proyecto,
            item.total_paletas,
            item.m3_pal,
            item.m2_pal,
            item.blq_pal,
            item.total_m2,
            item.pvp_neto_m2,
            item.total,
            item.pvp_neto_ud,
            item.subtotal,
          ]),

          headStyles: {
            fillColor: [255, 0, 0],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            halign: 'center',
            valign: 'middle',
          },
        });
      }

      if (pdfData.pdfDryMixes?.length) {
        autoTable(doc, {
          ...baseTableOptions,

          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY : infoTableEndY,

          head: [
            [
              'Ref.:',
              'Descripción',
              'Medición de proyecto, Ud',
              'Total paletas, Ud',
              'sacos/pal',
              'Total sacos, Ud',
              'Total, kg',
              'PVP neto €/Ud',
              'Subtotal €',
            ],
          ],

          body: pdfData.pdfDryMixes.map((item) => [
            item.ref,
            item.descripcion,
            item.medición_de_proyecto,
            item.total_paletas,
            item.sacos,
            item.totalSacos,
            item.totalKg,
            item.pvp_neto_ud,
            item.subtotal,
          ]),

          headStyles: {
            fillColor: [255, 0, 0],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.2,
            halign: 'center',
          },
        });
      }

      if (pdfData.pdfAnchor?.length) {
        autoTable(doc, {
          ...baseTableOptions,

          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPosition + 50, // Отступ от информации о заказе

          head: [
            [
              'Ref.:',
              'Descripción',
              'Medición de proyecto, Ud',
              'Total paletas, Ud',
              'sacos/pal',
              'Total sacos, Ud',
              'Total, kg',
              'PVP neto €/Ud',
              'Subtotal €',
            ],
          ],
          body: pdfData.pdfAnchor?.map((item) => [
            item.ref,
            item.descripcion,
            item.medición_de_proyecto,
            item.total_paletas,
            item.sacos,
            item.totalSacos,
            item.totalKg,
            item.pvp_neto_ud,
            item.subtotal,
          ]),
          styles: { fontSize: 6 },
          headStyles: {
            textColor: 'white',
            fillColor: [255, 0, 0], // ярко-красный фон
          },
        });
      }

      if (pdfData.pdfTools?.length) {
        autoTable(doc, {
          ...baseTableOptions,
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPosition + 50, // Отступ от информации о заказе
          head: [
            ['Ref.:', 'Descripción', 'Total, Ud', 'PVP neto €/Ud', 'Subtotal €'],
          ],
          body: pdfData.pdfTools?.map((item) => [
            item.ref,
            item.descripcion,
            item.total,
            item.pvp_neto_ud,
            item.subtotal,
          ]),
          styles: { fontSize: 6 },
          headStyles: {
            textColor: 'white',
            fillColor: [255, 0, 0], // ярко-красный фон
          },
        });
      }

      if (pdfData.pdfRelMat?.length) {
        autoTable(doc, {
          ...baseTableOptions,
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPosition + 50, // Отступ от информации о заказе
          head: [
            ['Ref.:', 'Descripción', 'Total, Ud', 'PVP neto €/Ud', 'Subtotal €'],
          ],
          body: pdfData.pdfRelMat?.map((item) => [
            item.ref,
            item.descripcion,
            item.total,
            item.pvp_neto_ud,
            item.subtotal,
          ]),
          styles: { fontSize: 6 },
          headStyles: {
            textColor: 'white',
            fillColor: [255, 0, 0], // ярко-красный фон
          },
        });
      }

      // Преобразование значения в число
      const toNumber = (value) => {
        if (value === null || value === undefined || value === '') {
          return 0;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : 0;
      };

      // Форматирование денежного значения
      const formatMoney = (value) => {
        return toNumber(value).toLocaleString('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      };

      const deliveryPrice = toNumber(pdfData.delivery);

      // Считаем, что доставка указана, только если цена больше нуля
      const hasDelivery = deliveryPrice > 0 || pdfData.delivery_m2 > 0;

      // TOTAL — сумма товаров без НДС и без доставки
      const totalWithoutVat = toNumber(vatValue?.vat_euro_origin);

      // BASE — товары + доставка
      const baseDisponible = totalWithoutVat + (hasDelivery ? deliveryPrice : 0);

      // IVA
      const ivaAmount = toNumber(vatValue?.vat_euro);

      // Итоговая сумма
      const totalPresupuesto = baseDisponible + ivaAmount;

      // Показываем только одну из двух жёлтых строк
      const transportText = hasDelivery
        ? 'Transporte incluido (sin descarga) - Trailer con descarga lateral de 13,6m de 24tn'
        : 'Transporte no está incluido en precio';

      const summaryStartY = doc.lastAutoTable
        ? doc.lastAutoTable.finalY + 5
        : yPosition + 50;

      autoTable(doc, {
        ...baseTableOptions,
        startY: summaryStartY,

        margin: {
          left: 10,
          right: 10,
        },

        theme: 'grid',

        body: [
          [
            {
              content: 'TOTAL:',
              colSpan: 3,
              styles: {
                fillColor: [255, 0, 0],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'right',
              },
            },
            {
              content: formatMoney(totalWithoutVat),
              styles: {
                fillColor: [245, 232, 220],
                textColor: [0, 0, 0],
                halign: 'right',
              },
            },
          ],

          [
            {
              content: transportText,
              colSpan: 4,
              styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bolditalic',
                halign: 'left',
              },
            },
          ],

          [
            {
              content: '',
              colSpan: 2,
            },
            {
              content: 'BASE DISPONIBLE:',
              styles: {
                fontStyle: 'bold',
                halign: 'right',
              },
            },
            {
              content: formatMoney(baseDisponible),
              styles: {
                halign: 'right',
              },
            },
          ],

          [
            {
              content: '',
              colSpan: 2,
            },
            {
              content: 'IVA 21%:',
              styles: {
                fontStyle: 'bold',
                halign: 'right',
              },
            },
            {
              content: formatMoney(ivaAmount),
              styles: {
                halign: 'right',
              },
            },
          ],

          [
            {
              content: '',
              colSpan: 2,
            },
            {
              content: 'TOTAL PRESUPUESTO:',
              styles: {
                fontStyle: 'bold',
                halign: 'right',
              },
            },
            {
              content: formatMoney(totalPresupuesto),
              styles: {
                fontStyle: 'bold',
                halign: 'right',
              },
            },
          ],

          [
            {
              content: 'CUENTA CORRIENTE: ES3701823240000201897538',
              colSpan: 4,
              styles: {
                halign: 'left',
              },
            },
          ],
        ],

        styles: {
          fontSize: 8,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          cellPadding: {
            top: 1.4,
            right: 1.5,
            bottom: 1.4,
            left: 1.5,
          },
          valign: 'middle',
        },

        columnStyles: {
          0: {
            cellWidth: 70,
          },
          1: {
            cellWidth: 50,
          },
          2: {
            cellWidth: 45,
          },
          3: {
            cellWidth: 25,
          },
        },
      });

      // Пока оставляем заглушки.
      // Позже подставим сюда конкретные поля из orderData.
      const deliveryTerm = pdfData.address || '[completar]';
      const paymentMethod = pdfData.payment_method || '[completar]';

      const particularConditionsText = [
        'Las partes acuerdan de forma expresa las siguientes condiciones aplicables al presente Presupuesto/Pedido:',
        `Plazo de entrega: ${deliveryTerm}`,
        `Forma de pago: ${paymentMethod}`,
        'Los importes reflejados en este presupuesto se calculan conforme a las condiciones económicas vigentes en la fecha de emisión. Cualquier incremento excepcional y acreditado en el coste del combustible que afecte de forma directa a la ejecución del servicio dará lugar a una revisión del precio, previa notificación.',
        'Otros:',
      ].join('\n');

      const particularConditionsStartY = doc.lastAutoTable
        ? doc.lastAutoTable.finalY
        : yPosition + 50;

      autoTable(doc, {
        ...baseTableOptions,
        startY: particularConditionsStartY,

        margin: {
          left: 10,
          right: 10,
        },

        pageBreak: 'avoid',
        theme: 'grid',

        head: [
          [
            {
              content: 'CONDICIONES PARTICULARES DE VENTA',
              styles: {
                halign: 'center',
              },
            },
          ],
        ],

        body: [
          [
            {
              content: particularConditionsText,
            },
          ],
        ],

        styles: {
          fontSize: 8,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.35,
          cellPadding: {
            top: 1.3,
            right: 1.5,
            bottom: 1.3,
            left: 1.5,
          },
          overflow: 'linebreak',
          valign: 'top',
        },

        headStyles: {
          fillColor: [255, 217, 102],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center',
          valign: 'middle',
          cellPadding: {
            top: 1.5,
            right: 1.5,
            bottom: 1.5,
            left: 1.5,
          },
        },

        bodyStyles: {
          fontStyle: 'bold',
          minCellHeight: 30,
        },
      });

      const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY : yPosition + 50;
      autoTable(doc, {
        ...baseTableOptions,
        startY,

        margin: {
          left: 10,
          right: 10,
          bottom: 35,
        },

        head: [['Condiciones Generales de Compraventa']],
        body: [[pdfData.terms]],

        styles: {
          ...baseTableOptions.styles,
          fontSize: 9,
          cellWidth: 'wrap',
          overflow: 'linebreak',

          cellPadding: {
            top: 2,
            right: 2.5,
            bottom: 2,
            left: 2.5,
          },
        },

        headStyles: {
          textColor: [255, 255, 255],
          fillColor: [255, 216, 102],
        },

        columnStyles: {
          0: {
            cellWidth: 190,
          },
        },
      });

      const addFinalPageFooter = () => {
        const lastPageNumber = doc.getNumberOfPages();

        doc.setPage(lastPageNumber);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const horizontalMargin = 10;
        const bottomMargin = 10;

        const footerWidth = pageWidth - horizontalMargin * 2;
        const footerHeight = 20;

        const footerX = horizontalMargin;
        const footerY = pageHeight - bottomMargin - footerHeight;

        // Белый фон и чёрная рамка
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);

        doc.rect(footerX, footerY, footerWidth, footerHeight, 'FD');

        // Текст футера
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setLineHeightFactor(1.15);

        const footerText = doc.splitTextToSize(pdfData.footer, footerWidth - 8);

        const lineHeight = 3;
        const textHeight = footerText.length * lineHeight;

        const footerTextY = footerY + (footerHeight - textHeight) / 2 + lineHeight;

        doc.text(footerText, pageWidth / 2, footerTextY, {
          align: 'center',
        });
      };

      addFinalPageFooter();
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
    console.log('🔄 Данные заказа обновлены:', orderData);
    const {
      deliveryAddress,
      contactInfo,
      owner,
      article,
      delivery,
      delivery_m2,
      payment_method,
    } = orderData;

    const VALIDITY_DAYS = 30;

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + VALIDITY_DAYS);

    const formattedValidUntil = [
      String(validUntilDate.getDate()).padStart(2, '0'),
      String(validUntilDate.getMonth() + 1).padStart(2, '0'),
      validUntilDate.getFullYear(),
    ].join('.');

    const terms = `Las presentes Condiciones Generales de Compraventa (en adelante, "Condiciones Generales") regulan la compraventa de productos de hormigón celular curado en autoclave (en adelante “HCCA”) por parte de BAUBLOCK a sus Comprador, así como los derechos y obligaciones de ambas partes, tanto a nivel nacional como internacional:
    1.PEDIDOS Y ACEPTACIÓN:
    Los pedidos realizados por el Comprador serán considerados vinculantes para ambas partes una vez que hayan sido aceptados por estas bajo firma del Presupuesto. La suscripción del Presupuesto implica la conformidad del Comprador con las presentes Condiciones.
    2.PRECIOS Y FORMA DE PAGO:
    2.1.Los precios de los productos se indicarán en el Presupuesto manteniéndose inalterables por el plazo máximo de validez del mismo que se establece, como norma general, en un (1) mes, finalizado el cual carecen de validez, debiendo ser revisado y renovado, a solicitud del Comprador y en base a las circunstancias de producción, transporte o generales del mercado, sin previo aviso, salvo pacto en contrario. 
    2.2.Los precios y el número total de bloques se ajustarán a pallet completos.
    2.3.Los precios no incluyen impuestos, tasas o cualquier otro gasto adicional que correrá a cargo del Comprador. El precio podrá incluir el coste de transporte, de forma separada, a solicitud del Comprador y a su costa, en cuyo caso los medios auxiliares para la descarga en destino no estarán incluidos. 
    2.4.Salvo que se acuerden condiciones de pago particulares el pago se realizará a los 30 días desde la fecha de factura emitida por BAUBLOCK y remitida por correo electrónico a la dirección indicada por el Comprador a tal efecto. En todo caso, será requisito necesario y previo el pago por el Comprador de la cantidad acordada como anticipo a cuenta, entre tanto no se produzca dicho pago este presupuesto no se entenderá formalizado. 
    2.5.El Comprador no queda exento de su obligación de pago por el hecho de renunciar a un pedido, no retirar o no recibir la mercancía en el plazo convenido, sino que por el contrario se verá obligado al mismo. BAUBLOCK se reserva el derecho de asignar límites de crédito a cada Comprador, pudiendo, cuando el volumen de operaciones exija rebasar ese límite, exigir garantías. 
    2.6.El medio de pago será el acordado con el Comprador dentro de los aceptados por la legislación vigente. 
    2.7.En caso de demora en el pago de una o varias facturas (según la forma y plazos de pago acordados) emitidas por BAUBLOCK, cuyo abono no sea subsanado en el plazo máximo de quince (15) días desde la fecha de recepción de la misma y sin necesidad de previo requerimiento a dicho efecto, esta quedará facultada para resolver la compraventa y suspender las entregas, y a cobrar los intereses de demora (a un tipo de interés equivalente a Euribor a tres meses más 2 puntos). Los gastos bancarios, aplazamientos notariales, gastos acumulados derivados del incumplimiento de pago serán cargados al Comprador. Asimismo, esto no limita la posible reclamación por los daños y perjuicios pudiera corresponder. 
    2.8.En caso de anulación o modificación de un pedido en el transcurso de su fabricación, la mercancía será puesta a dispersión del Comprador y facturadas por BAUBLOCK. 
    3.TRANSPORTE Y RECEPCIÓN
    3.1.El transporte se efectuará según lo acordado por las Partes. 
    3.2.Los riesgos de daños y perdidas de los productos transportados por BUABLOCK o a cargo de esta, finalizarán en el momento de entrega de la mercancía en el destino pactado con el Comprador, salvo que se haya acorado que el transporte corre a cargo del Comprador, en cuyo caso estos riesgos serán del Comprador desde la puesta a disposición de la mercancía en las instalaciones de Baublock. 
    3.3.En todo caso, la descarga del material es por cuenta, cargo y bajo la entera responsabilidad del Comprador quien deberá contar con todos los medios necesarios para llevar a cabo la misma.
    3.4.Cuando el transporte sea a cargo de BAUBLOCK, se efectuará solo para camiones completos - Tráiler (13,6 m remolque 24Tn) de descarga lateral o trasera. Tiempo máximo descarga 2 horas/camión o contenedor. En caso de incumplimiento de los plazos de descarga, se cobrará un cargo adicional por cada hora de espera del contenedor/camión. El cliente confirmará que el acceso al lugar de descarga es adecuado a la entrada, circulación, maniobrabilidad y salida del tráiler. El cliente será responsable de solicitar, en caso de necesidad, los permisos necesarios para la circulación del tráiler y descarga de la mercancía.         
    4.ENTREGA DE PRODUCTOS
    4.1.Los plazos de entrega serán acordados entre las partes y dependerán de la disponibilidad del producto y de las condiciones logísticas. Los plazos de entrega establecidos en las Condiciones Particulares empezaran a computarse al día siguiente a que BAUBLOCK haya percibido las cantidades de pago, que, en su caso, se hayan establecido como pagos a cuenta (anticipo).
    4.2.BAUBLOCK utiliza su mejor voluntad para cumplir los plazos de entrega. No obstante, los retrasos motivados por caso fortuito o fuera mayor, no darán derecho al Comprador a anular la venta, rechazar la mercancía o reclamar cualquier indemnización, compensación, descuento o penalización por demora. 
    4.3.Es obligación del Comprador revisar la mercancía en el momento de su recepción en el albarán de entrega firmado por el Comprador (nombre, firma, y DNI) que devolverá al chofer que realiza el transporte. La recepción del producto por parte del Comprador implica la aceptación de la conformidad del mismo, salvo reclamación justificada en el plazo de cinco (5) días hábiles establecido en el apartador anterior 3.3. 
    4.4.Para territorios no comprendidos en España, Península Ibérica, las condiciones de entrega deberán ser pactadas por las partes de forma expresa.
    4.5.Reembolso de Palets: El costo de los palets utilizados en la entrega de los materiales se incluye en el presente presupuesto.        Se cobrará un importe de 10 € por cada palet, que será reembolsado íntegramente al cliente siempre y cuando:
    •Los palets sean devueltos en un plazo máximo de 30 días a partir de la entrega.
    •Los palets se devuelvan en buen estado, sin daños estructurales, manchas significativas o elementos adheridos que comprometan su reutilización.
    •El reembolso del importe de los palets se realizará mediante [transferencia bancaria / deducción en factura final / otros métodos], dentro de los 10 días posteriores a la recepción de los palets en las condiciones indicadas.                
    •En caso de que los palets no se devuelvan dentro del plazo establecido o presenten daños significativos, no se efectuará el reembolso del importe correspondiente.
    5. GARANTÍA Y RESPONSABILIDAD 
    5.1.BAUBLOCK garantiza que sus productos cumplen con las especificaciones técnicas indicadas en la ficha técnica correspondiente. El plazo de extensión de la garantía y el alcance de la misma serán los establecidos por la legislación vigente. 
    5.2.Todas las reclamaciones deberán formalizarse por escrito en los cinco (5) días hábiles siguientes a la recepción de la mercancía, siendo el indicado plazo, un plazo de caducidad. Transcurrido el plazo, con carácter general ninguna reclamación será admitida. El material objeto de reclamación se devolverá a BAUBLOCK o permanecerá en posición del Comprador para poder ser objeto de inspección por parte del personal de BAUBLOCK. El análisis de las reclamaciones será efectuado por BUABLOCK en los días posteriores a la fecha de recepción de la reclamación. Tanto para el suministro como para el análisis de la reclamación o entrega de reposiciones quedaran expresamente excluidos los gastos derivados del montaje o desmontaje de la mercancía afectad. No se aceptarán reclamaciones por el uso o aplicación indebida o a una incorrecta colocación o almacenamiento.  La comunicación se enviará por canales establecidos al efecto y aportando las debidas pruebas gráficas y documentales, sin las cuales la reclamación no será atendida.
    5.3.BAUBLOCK no se hace responsable del empleo y uso de la mercancía que presenten un defecto no detallado en el albarán de entrega. BAUBLOCK o será responsable de los perjuicios indirectos, ni perdida de beneficios o ganancias dejadas de obtener, ni tampoco de los daños directos resultantes de una puesta en obra de nuestros productos no conformes a las reglas tanto genéricas del sector como a las indicadas por BAUBLOCK para cada producto. Tampoco a las resultantes de una mala manipulación, condiciones de transporte, almacenaje o mantenimiento defectuoso, no conformes a nuestras prescripciones. La garantía no cubrirá defectos derivados de un uso inadecuado, error en la descarga, almacenamiento incorrecto o modificaciones realizadas por el Comprador.
    5.4.La tonalidad de nuestros bloques puede variar ligeramente según las fabricaciones y las condiciones ambientales. En consecuencia, no se garantiza la reposición de bloques con un color 100 % igual al de la primera entrega. 
    5.5.La sustitución de bloques no varía la fecha de inicio del periodo de garantía del conjunto de pedido. 
    6.COMUNICACIONES 
    Las comunicaciones que el Comprador deba realizar a Baublock, se llevarán cabo mediante correo electrónico en las siguientes direcciones:
    - Contabilidad y facturación: ccarrasco@baublock.com 
    - Reclamaciones/garantía: ol@baublock.com 
    - Logística: sparra@baublock.com 
    7.PROPIEDAD INDUSRTRIAL E INTELECTUAL
    La propiedad industrial y/o intelectual de la oferta, en todos sus términos y la información adjunta a la misma, así como la de los productos/mercancía objetos de venta incorporados o relativos a los mismos, pertenece a BAUBLOCK. 
    BAUBLOCK podrá facilitar el nombre del Comprador como parte de sus referencias comerciales. 
    8.MODIFICACIÓN DE LAS CONDICIONES GENERALES 
    BAUBLOCK se reserva el derecho de modificar las presentes Condiciones en cualquier momento. Las modificaciones serán notificadas a los Comprador y aplicables a los Presupuestos posteriores a su publicación.
    9.DERECHO APLICABLE, SUMINSION A JUIRISDICCION Y COMPETENCIA. 
    Las presentes Condiciones serán regidas e interpretadas por las leyes españolas. Las partes renuncia expresamente a otro fuero que pudiese corresponderle y se someten a la jurisdicción y competencia de los Juzgados y Tribuales de Cádiz. `;

    const footer =
      'BAUBLOCK MATERIALES AVANZADOS DE CONSTRUCCIÓN S.L.U. inscrita en el Registro Mercantil de Cádiz el 21 de septiembre de 2021, en el diario 219, asiento 75, al Tomo 2410, folio 49, inscripción 1 con hoja CA-59071 , con domicilio social en Avneida Isaac Newton, num 17,  C.P. 11500, provincia de Cádiz, con N.I.F.  B-16868028. Actualizacion febrero de 2025. Estas CGV pueden verse modificadas o ampliadas por Condiciones Particulares que se negocien entre las Partes.';

    const pdfProducts = productList?.products?.map((prod) => {
      const product = latestProducts.find(
        (el) => el.article == prod.product_article,
      );

      const descripcion = `BAUBLOCK®${
        product?.tradingMark
      } ${product?.lengths.toString()}x${product?.width}x${product?.height}mm ${
        product?.density
      }kg/m³`;

      const total = (prod.quantity_palet * product?.quantityBlockOnPallet).toFixed(
        0,
      );

      const pvp_neto_ud = (prod.final_price / total).toFixed(2);

      return {
        ref: product.article,
        descripcion,
        medición_de_proyecto: prod.quantity_m2.toFixed(2),
        total_paletas: prod.quantity_palet,
        m3_pal: product.volumeBlockOnPallet.toFixed(2),
        m2_pal: product.m2.toFixed(2),
        blq_pal: product.quantityBlockOnPallet,
        total_m2: prod.quantity_real.toFixed(2),
        pvp_neto_m2: prod.price_m2_with_delivery.toFixed(2),
        total,
        pvp_neto_ud,
        subtotal: prod.final_price.toFixed(2),
      };
    });

    const pdfDryMixes = productList?.dryMixes?.map((prod) => {
      const dryMixes = dryMixesJournal.find((el) => el.id == prod.dry_mixed_id);
      const quantity = prod.quantity_ud;

      const descripcion = `${dryMixes?.name} BAUBLOCK Sacos de ${dryMixes?.pallet_weight}kg`;

      const sacos = dryMixes?.units_per_pallet;

      const totalSacos = (quantity * sacos).toFixed(0);

      const totalKg = (prod.quantity_palet_dry * dryMixes?.pallet_weight).toFixed(0);

      const pvp_neto_ud = (prod.final_price / totalSacos).toFixed(2);

      return {
        ref: dryMixes?.article,
        descripcion,
        medición_de_proyecto: quantity,
        total_paletas: prod?.quantity_palet_dry,
        sacos,
        totalSacos,
        totalKg,
        pvp_neto_ud,
        subtotal: prod?.final_price?.toFixed(2),
      };
    });

    const pdfAnchor = productList?.anchors?.map((prod) => {
      const anchorProd = anchor.find((el) => el.id == prod.anchor_id);
      const quantity = prod.quantity_ud;

      const descripcion = `${anchorProd.name} BAUBLOCK Sacos de ${anchorProd.pallet_weight}kg`;

      const sacos = anchorProd.pieces_per_unit * anchorProd.boxes_on_a_pallet;

      const totalSacos = (quantity * sacos).toFixed(0);

      const totalKg = (
        prod.quantity_palet_anchor * anchorProd.pallet_weight
      ).toFixed(0);

      const pvp_neto_ud = (prod.final_price / totalSacos).toFixed(2);

      return {
        ref: anchorProd.article,
        descripcion,
        medición_de_proyecto: quantity,
        total_paletas: prod.quantity_palet_anchor,
        sacos,
        totalSacos,
        totalKg,
        pvp_neto_ud,
        subtotal: prod.final_price.toFixed(2),
      };
    });

    const pdfTools = productList?.tools?.map((prod) => {
      const pdfTool = tool.find((el) => el.id == prod.tool_id);

      const total = prod.total;

      const pvp_neto_ud = (prod.final_price / total).toFixed(2);

      return {
        ref: pdfTool?.article,
        descripcion: pdfTool?.description,
        total,
        pvp_neto_ud,
        subtotal: prod?.final_price?.toFixed(2),
      };
    });

    const pdfRelMat = productList?.related_materials?.map((prod) => {
      const pdfRelMat = relatedMaterialsJournal.find(
        (el) => el.id == prod.rel_mat_id,
      );

      const total = prod.total;

      const pvp_neto_ud = (prod.final_price / total).toFixed(2);

      return {
        ref: pdfRelMat?.article,
        descripcion: pdfRelMat?.description,
        total,
        pvp_neto_ud,
        subtotal: prod.final_price.toFixed(2),
      };
    });

    setPdfData({
      ref: article || '',
      client: owner?.c_name || '',
      cif: `${owner?.cif_vat ?? owner?.tin ?? owner?.cif}` || '',
      address:
        `${deliveryAddress?.street} ${deliveryAddress?.additional_info}, ${deliveryAddress?.project_name}` ||
        '',
      contact: `${contactInfo?.first_name} ${contactInfo?.last_name}` || '',
      email: contactInfo?.email || '',
      phone: contactInfo?.phone_number_mobile || '',
      validUntil: formattedValidUntil || '',
      pdfProducts,
      pdfDryMixes,
      pdfAnchor,
      pdfTools,
      pdfRelMat,
      tax: vatValue.vat_procent || 0,
      finalTotal: vatValue.vat_result || 0,
      terms,
      delivery,
      delivery_m2,
      footer,
      payment_method,
    });
    setPdfUrl(null);
  }, [orderData, productList]);

  const downloadPDF = async () => {
    const doc = await generatePDF();
    if (doc) doc.save('presupuesto.pdf');
  };

  const sendToBitrix = async () => {
    if (!dealId) {
      alert('Fill in DEAL_ID before sending to Bitrix24');
      return;
    }

    try {
      const doc = await generatePDF();

      if (doc) {
        const pdfBlob = doc.output('blob');
        const formData = new FormData();
        formData.append('file', pdfBlob, 'presupuesto.pdf');
        formData.append('deal_id', dealId);
        formData.append('id', orderData?.id);
        formData.append('vatValue', vatValue?.vat_result_del);

        // Отправляем на СВОЙ бэкенд (аналогично /clients/bitrix-send-offer),
        // а бэкенд уже сам кодирует файл в base64 и пересылает в Bitrix
        // вместе с секретным ключом, который не должен светиться на фронте.
        const baseURL = getApiUrl();
        const response = await fetch(`${baseURL}/clients/bitrix-send-offer`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json().catch(() => null);

        if (response.ok) {
          alert('PDF successfully sent to Bitrix24');
        } else {
          console.error('Ошибка ответа сервера:', result);
          alert(`Error sending to Bitrix24: ${result?.error ?? response.status}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Send error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="ord-field">
        <label className="ord-field__label" htmlFor="deal_id">
          DEAL_ID
        </label>
        <input
          id="deal_id"
          type="number"
          value={dealId}
          onChange={(e) => {
            setDealId(e.target.value);
          }}
          placeholder="Enter DEAL_ID"
        />
      </div>

      <div className="ord-pdf-actions">
        <button
          type="button"
          className="ord-btn ord-btn--primary ord-btn--sm"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
        <button
          type="button"
          className="ord-btn ord-btn--ghost ord-btn--sm"
          onClick={sendToBitrix}
        >
          Send to Bitrix24
        </button>
      </div>
    </div>
  );
};

export default PDFGenerator;
