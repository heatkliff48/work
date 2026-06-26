const formatAmount = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return '0.00';
  return number.toFixed(2);
};

const pushLine = (lines, line) => {
  if (!line?.concepto) return;
  lines.push(line);
};

export const buildInvoiceLines = ({
  productLists,
  latestProducts,
  latestDryMix,
  latestAnchors,
  latestTools,
  latestRelatedMaterials,
}) => {
  const lines = [];

  productLists?.products?.forEach((prod) => {
    const product = latestProducts?.find(
      (el) => el.id === prod.product_id || el.article === prod.product_article,
    );

    const quantity = Number(prod.quantity_real ?? prod.quantity_m2 ?? 0);
    const importe = Number(prod.final_price ?? 0);
    const precio = quantity ? importe / quantity : Number(prod.price_m2 ?? 0);

    pushLine(lines, {
      concepto: `Ref. ${product?.article ?? prod.product_article ?? ''}_${product?.description ?? product?.tradingMark ?? 'Producto'}`,
      cantidad: formatAmount(quantity),
      unidad: 'M2',
      precio: formatAmount(precio),
      importe: formatAmount(importe),
    });
  });

  productLists?.dryMixes?.forEach((prod) => {
    const dryMix = latestDryMix?.find((el) => el.id === prod.dry_mixed_id);
    const quantity = Number(prod.quantity_ud ?? prod.total ?? 0);
    const importe = Number(prod.final_price_dry ?? prod.final_price ?? 0);
    const precio = quantity ? importe / quantity : 0;

    pushLine(lines, {
      concepto: `Ref. ${dryMix?.article ?? ''}_${dryMix?.name ?? 'Mortero'} - SACO ${dryMix?.pallet_weight ?? 25}kg`,
      cantidad: formatAmount(quantity),
      unidad: 'Uds',
      precio: formatAmount(precio),
      importe: formatAmount(importe),
    });
  });

  productLists?.anchors?.forEach((prod) => {
    const anchor = latestAnchors?.find((el) => el.id === prod.anchor_id);
    const quantity = Number(prod.quantity_ud ?? prod.total ?? 0);
    const importe = Number(prod.final_price_anchor ?? prod.final_price ?? 0);
    const precio = quantity ? importe / quantity : 0;

    pushLine(lines, {
      concepto: `Ref. ${anchor?.article ?? ''}_${anchor?.name ?? 'Anclaje'}`,
      cantidad: formatAmount(quantity),
      unidad: 'Uds',
      precio: formatAmount(precio),
      importe: formatAmount(importe),
    });
  });

  productLists?.tools?.forEach((prod) => {
    const tool = latestTools?.find((el) => el.id === prod.tool_id);
    const quantity = Number(prod.total ?? prod.quantity_ud ?? 0);
    const importe = Number(prod.final_price_tool ?? prod.final_price ?? 0);
    const precio = quantity ? importe / quantity : 0;

    pushLine(lines, {
      concepto: `Ref. ${tool?.article ?? ''}_${tool?.description ?? tool?.name ?? 'Herramienta'}`,
      cantidad: formatAmount(quantity),
      unidad: 'Uds',
      precio: formatAmount(precio),
      importe: formatAmount(importe),
    });
  });

  productLists?.related_materials?.forEach((prod) => {
    const relMat = latestRelatedMaterials?.find((el) => el.id === prod.rel_mat_id);
    const quantity = Number(prod.total ?? prod.quantity_ud ?? 0);
    const importe = Number(prod.final_price_rel_mat ?? prod.final_price ?? 0);
    const precio = quantity ? importe / quantity : 0;

    pushLine(lines, {
      concepto: `Ref. ${relMat?.article ?? ''}_${relMat?.description ?? relMat?.name ?? 'Material relacionado'}`,
      cantidad: formatAmount(quantity),
      unidad: 'Uds',
      precio: formatAmount(precio),
      importe: formatAmount(importe),
    });
  });

  return lines.map((line, index) => ({
    numero: index + 1,
    ...line,
  }));
};
