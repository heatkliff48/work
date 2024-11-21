import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: '1 solid #ccc',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flexGrow: 1,
    padding: 5,
    borderRight: '1 solid #ccc',
    borderBottom: '1 solid #ccc',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  input: {
    fontSize: 12,
    padding: 5,
    border: '1 solid #ccc',
  },
});

const OrderPDF = ({ orderData, productList, vatValue }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Заголовок заказа */}
      <View style={styles.section}>
        <Text style={styles.header}>Order Card: {orderData?.article}</Text>
      </View>

      {/* Клиентская информация */}
      <View
        style={[
          styles.section,
          { flexDirection: 'row', justifyContent: 'space-between' },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Client Information</Text>
          {Object.entries(orderData?.owner || {}).map(([key, value]) => (
            <Text key={key}>{`${key}: ${value}`}</Text>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Contact Person</Text>
          {Object.entries(orderData?.contactInfo || {}).map(([key, value]) => (
            <Text key={key}>{`${key}: ${value}`}</Text>
          ))}
        </View>
      </View>

      {/* Адрес доставки */}
      <View style={styles.section}>
        <Text style={styles.header}>Delivery Address</Text>
        {Object.entries(orderData?.deliveryAddress || {}).map(([key, value]) => (
          <Text key={key}>{`${key}: ${value}`}</Text>
        ))}
      </View>

      {/* Таблица продуктов */}
      <View style={[styles.section, styles.table]}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Product</Text>
          <Text style={styles.tableCell}>Quantity</Text>
          <Text style={styles.tableCell}>Price</Text>
        </View>
        {productList.map((product, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{product?.name || 'N/A'}</Text>
            <Text style={styles.tableCell}>{product?.quantity_palet || 'N/A'}</Text>
            <Text style={styles.tableCell}>{product?.final_price || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Данные VAT */}
      <View style={styles.section}>
        <Text style={styles.header}>VAT Information</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>VAT, %: {vatValue?.vat_procent || 'N/A'}</Text>
          </View>
          <View>
            <Text>Result: {vatValue?.vat_result || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export const PrintContent = ({
  orderCartData,
  updatedProductListOrder,
  vatValue,
}) => {
  return (
    <>
      <PDFDownloadLink
        document={
          <OrderPDF
            orderData={orderCartData}
            productList={updatedProductListOrder || []}
            vatValue={vatValue}
          />
        }
        fileName={`order_${orderCartData?.article}.pdf`}
        style={{ marginTop: '20px', textDecoration: 'none', color: 'blue' }}
      >
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink>
      <PDFViewer style={{ width: '100%', height: '500px' }}>
        <OrderPDF
          orderData={orderCartData}
          productList={updatedProductListOrder || []}
          vatValue={vatValue}
        />
      </PDFViewer>
    </>
  );
};

export default PrintContent;

/* <div ref={componentRef} className="page-container">
  <h4>Order Card: {orderCartData?.article}</h4>

  <div className="header-container">
    <div className="owner-info">
      <h4>Client Information</h4>
      {filterAndMapData(orderCartData?.owner, filterKeys)}
    </div>
    <div className="contact-info">
      <div className="contact-text">
        <h4>Contact Person</h4>
        {filterAndMapData(orderCartData?.contactInfo, filterKeys)}
      </div>
    </div>
  </div>

  <div className="delivery-address">
    <h4>Delivery Address</h4>
    {filterAndMapData(orderCartData?.deliveryAddress, filterKeys)}
  </div>

  <table className="product-table">
    <thead>
      <tr>
        <td>Products</td>
      </tr>
    </thead>
    <tbody>
      {updatedProductListOrder?.map((product) => (
        <tr key={product?.id} className="product-row">
          <td>{filterAndMapData(product, filterKeys)}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className="footer_data">
    <div className="vat_container">
      <div className="vat_procent">
        <p>VAT, %</p>
        <input
          type="text"
          id="vat_procent"
          name="vat_procent"
          value={vatValue.vat_procent}
          onChange={handleInputChange}
        />
      </div>
      <div className="vat_result">
        <p>Result</p>
        <p>{vatValue.vat_result}</p>
      </div>
    </div>
  </div>
</div>
 */
