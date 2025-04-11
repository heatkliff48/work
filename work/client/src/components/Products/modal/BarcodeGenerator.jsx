import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const BarcodeGenerator = ({ productCode }) => {
  const barcodeRef = useRef(null);

  // Функция для вычисления контрольной суммы EAN13
  const calculateEAN13Checksum = (barcode) => {
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      const digit = parseInt(barcode[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3; // Нечетные позиции умножаем на 1, четные на 3
    }

    const checksum = (10 - (sum % 10)) % 10; // Вычисляем контрольную сумму
    return checksum;
  };

  useEffect(() => {
    if (!productCode || !/^\d+$/.test(productCode)) {
      console.error('Ошибка: productCode должен содержать только цифры.');
      return;
    }

    // Формируем основную часть штрих-кода (12 символов)
    const barcode = '84' + '36626' + productCode.padStart(5, '0').slice(0, 5);
    const checksum = calculateEAN13Checksum(barcode); // Вычисляем контрольную сумму
    const fullBarcode = barcode + checksum; // Полный штрих-код (13 символов)

    // Генерация штрих-кода
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, fullBarcode, {
        format: 'EAN13',
        displayValue: true,
        fontSize: 16,
        lineColor: '#000',
        width: 2,
        height: 100,
      });
    }
  }, [productCode]);

  return <svg ref={barcodeRef}></svg>;
};

export default BarcodeGenerator;
