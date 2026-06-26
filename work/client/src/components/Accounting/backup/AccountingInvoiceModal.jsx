import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
  getDefaultIdType,
  ID_TYPE_OPTIONS,
  resolveOwnerIdValue,
} from './invoiceConstants.js';
import { buildInvoiceLines } from './buildInvoiceLines.js';
import { generateAccountingInvoicePdf } from './generateAccountingInvoicePdf.js';

const AccountingInvoiceModal = ({
  isOpen,
  toggle,
  orderCartData,
  productLists,
  vatValue,
  latestProducts,
  latestDryMix,
  latestAnchors,
  latestTools,
  latestRelatedMaterials,
}) => {
  const owner = orderCartData?.owner;
  const [idType, setIdType] = useState(getDefaultIdType(owner));
  const [clientReference, setClientReference] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIdType(getDefaultIdType(owner));
      setClientReference('');
    }
  }, [isOpen, owner]);

  const idValue = useMemo(
    () => resolveOwnerIdValue(owner, idType),
    [owner, idType],
  );

  const idTypeSelectOptions = useMemo(
    () =>
      ID_TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    [],
  );

  const selectedIdType = useMemo(
    () => idTypeSelectOptions.find((option) => option.value === idType) || null,
    [idType, idTypeSelectOptions],
  );

  const handleGenerate = async () => {
    if (!clientReference.trim()) {
      alert('Introduzca la referencia del cliente');
      return;
    }

    if (!idValue) {
      alert('No hay valor disponible para el documento seleccionado');
      return;
    }

    setIsGenerating(true);

    try {
      const invoiceLines = buildInvoiceLines({
        productLists,
        latestProducts,
        latestDryMix,
        latestAnchors,
        latestTools,
        latestRelatedMaterials,
      });

      const doc = await generateAccountingInvoicePdf({
        orderCartData,
        invoiceLines,
        vatValue,
        idType,
        idValue,
        clientReference: clientReference.trim(),
        invoiceNumber: orderCartData?.article,
      });

      if (!doc) {
        alert('No se pudo generar la factura PDF');
        return;
      }

      const safeReference = clientReference.trim().replace(/[^\w.-]+/g, '_');
      doc.save(`factura_${orderCartData?.article || 'pedido'}_${safeReference}.pdf`);
      toggle();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Generar factura PDF</ModalHeader>
      <ModalBody>
        <div className="item_topic" style={{ marginBottom: '16px' }}>
          <label htmlFor="invoice-id-type">NIF</label>
          <Select
            inputId="invoice-id-type"
            value={selectedIdType}
            options={idTypeSelectOptions}
            onChange={(option) => setIdType(option?.value || 'CIF')}
          />
          <p style={{ marginTop: '8px', marginBottom: 0 }}>
            Valor: {idValue || '—'}
          </p>
        </div>

        <div className="item_topic">
          <label htmlFor="invoice-client-reference">Referencia cliente</label>
          <input
            id="invoice-client-reference"
            type="text"
            value={clientReference}
            onChange={(event) => setClientReference(event.target.value)}
            placeholder="Introduzca la referencia del cliente"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={isGenerating}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generando...' : 'Confirmar y generar PDF'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AccountingInvoiceModal;
