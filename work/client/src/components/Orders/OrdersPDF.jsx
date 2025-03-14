import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import image from './headerPDF.jpg';
import { useProductsContext } from '#components/contexts/ProductContext.js';

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
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfData, setPdfData] = useState({});

  useEffect(() => {
    console.log('🔄 Данные заказа обновлены:', orderData);
    const { deliveryAddress, contactInfo, owner, article } = orderData;

    const today = new Date();
    const nextMonthDate = new Date(today);
    nextMonthDate.setMonth(today.getMonth() + 1);
    const formattedDate = nextMonthDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

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

    const items = productList.map((prod) => {
      const product = latestProducts.find(
        (el) => el.article == prod.product_article
      );

      const descripcion = `BAUBLOCK®${product.tradingMark} ${product.lengths}x${product.width}x${product.height}mm ${product.density}kg/м³`;

      const total = (prod.quantity_palet * product.quantityBlockOnPallet).toFixed(0);

      const pvp_neto_ud = (prod.final_price / total).toFixed(0);

      return {
        ref: product.article,
        descripcion,
        medición_de_proyecto: prod.quantity_m2,
        total_paletas: prod.quantity_palet,
        m3_pal: product.volumeBlockOnPallet,
        m2_pal: product.m2,
        blq_pal: product.quantityBlockOnPallet,
        total_m2: prod.quantity_real,
        pvp_neto_m2: prod.price_m2,
        total,
        pvp_neto_ud,
        subtotal: prod.final_price,
      };
    });

    setPdfData({
      ref: article || '',
      client: owner?.c_name || '',
      cif: `${owner?.cif ?? owner?.tin}` || '',
      address:
        `${deliveryAddress?.street} ${deliveryAddress?.additional_info}, ${deliveryAddress?.project_name}` ||
        '',
      contact: `${contactInfo?.first_name} ${contactInfo?.last_name}` || '',
      email: contactInfo?.email || '',
      phone: contactInfo?.phone_number_mobile || '',
      validUntil: formattedDate || '',
      items,
      // base: orderData.base || 0,
      tax: vatValue.vat_procent || 0,
      finalTotal: vatValue.vat_result || 0,
      terms,
      footer,
    });

    setPdfUrl(null); // Сбрасываем предыдущий PDF
  }, [orderData]);

  const generatePDF = async () => {
    if (!orderData || !productList) {
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
      doc.text(`Ref.: ${pdfData.ref}`, 10, yPosition);
      doc.text(`Cliente: ${pdfData.client}`, 10, yPosition + 10);
      doc.text(`CIF: ${pdfData.cif}`, 10, yPosition + 20);
      doc.text(`Dirección: ${pdfData.address}`, 10, yPosition + 30);

      doc.text(`Contacto: ${pdfData.contact}`, 120, yPosition);
      doc.text(`Email: ${pdfData.email}`, 120, yPosition + 10);
      doc.text(`Teléfono: ${pdfData.phone}`, 120, yPosition + 20);
      doc.text(`Válido hasta: ${pdfData.validUntil}`, 120, yPosition + 30);

      // Таблица с товарами (начинается ниже текста)
      autoTable(doc, {
        startY: yPosition + 40, // Отступ от информации о заказе
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
        body: pdfData.items?.map((item) => [
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
        styles: { fontSize: 6 }
      });

      const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPosition + 50;

      autoTable(doc, {
        startY,
        head: [['Condiciones Generales de Compraventa']],
        body: [[pdfData.terms]],
        styles: { fontSize: 9, cellWidth: 'wrap' },
        columnStyles: { 0: { cellWidth: 180 } },
      });

      // Добавляем футер внизу страницы
      doc.setFontSize(8);
      doc.text(pdfData.footer, 10, doc.internal.pageSize.getHeight() - 10, {
        maxWidth: 190,
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

  const downloadPDF = async () => {
    const doc = await generatePDF();
    if (doc) doc.save('presupuesto.pdf');
  };

  return (
    <div>
      <button onClick={generatePDF}>Предпросмотр PDF</button>
      {pdfUrl && (
        <div>
          <iframe
            src={pdfUrl}
            width="100%"
            height="500px"
            title="PDF Preview"
          ></iframe>
          <button onClick={downloadPDF}>Скачать PDF</button>
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;
