import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const BarcodeGenerator = ({ productCode, chosenBarcodeType }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (!productCode || !/^\d+$/.test(productCode)) {
      console.error('Ошибка: productCode должен содержать только цифры.');
      return;
    }

    // Формируем основную часть штрих-кода (12 символов)
    // const barcode = '84' + '36626' + productCode.padStart(5, '0').slice(0, 5);
    // const checksum = calculateEAN13Checksum(barcode); // Вычисляем контрольную сумму
    // const fullBarcode = barcode + checksum; // Полный штрих-код (13 символов)

    // Генерация штрих-кода

    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, productCode, {
        format: chosenBarcodeType === 1 ? 'EAN13' : 'ITF14',
        displayValue: true,
        fontSize: 16,
        lineColor: '#000',
        width: 2,
        height: 100,
      });
    }
  }, [productCode, chosenBarcodeType]);

  return <svg ref={barcodeRef}></svg>;
};

export default BarcodeGenerator;
