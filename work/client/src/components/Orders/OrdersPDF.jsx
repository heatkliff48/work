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
    borderWidth: 1,
    borderColor: '#ccc',
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
    padding: 8,
    flexGrow: 1,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
});

const OrderPDF = ({ orderData = {}, productList = [], vatValue = {} }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Order Card: {orderData?.article || 'N/A'}</Text>
      </View>
      <View
        style={[
          styles.section,
          { flexDirection: 'row', justifyContent: 'space-between' },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Client Information</Text>
          {Object.entries(orderData?.owner || {})?.map(([key, value]) => (
            <Text key={`owner-${key}`}>{`${key}: ${value}`}</Text>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Contact Person</Text>
          {Object.entries(orderData?.contactInfo || {})?.map(([key, value]) => (
            <Text key={`contact-${key}`}>{`${key}: ${value}`}</Text>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Delivery Address</Text>
        {Object.entries(orderData?.deliveryAddress || {})?.map(([key, value]) => (
          <Text key={`delivery-${key}`}>{`${key}: ${value}`}</Text>
        ))}
      </View>
      <View style={[styles.section, styles.table]}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Product</Text>
          <Text style={styles.tableCell}>Quantity</Text>
          <Text style={styles.tableCell}>Price</Text>
        </View>
        {Array.isArray(productList) && productList.length > 0 ? (
          productList.map((product, index) => (
            <View
              style={styles.tableRow}
              key={product?.id || product?.product_article || index}
            >
              <Text style={styles.tableCell}>
                {product?.product_article || 'N/A'}
              </Text>
              <Text style={styles.tableCell}>
                {product?.quantity_palet || 'N/A'}
              </Text>
              <Text style={styles.tableCell}>{product?.final_price || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>VAT Information</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>VAT, %: {vatValue?.vat_procent || 'N/A'}</Text>
          </View>
          <View>
            <Text>VAT, EURO: {vatValue?.vat_euro || 'N/A'}</Text>
          </View>
          <View>
            <Text>Result: {vatValue?.vat_result || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const DownloadOrderPDF = ({ orderCartData, updatedProductListOrder, vatValue }) => (
  <div>
    <PDFDownloadLink
      document={
        <OrderPDF
          orderData={orderCartData || {}}
          productList={updatedProductListOrder || []}
          vatValue={vatValue || {}}
        />
      }
      fileName={`order-${orderCartData?.article || 'N/A'}.pdf`}
      className="pdf_button"
    >
      {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
    </PDFDownloadLink>
    <PDFViewer style={{ width: '100%', height: '500px' }}>
      <OrderPDF
        orderData={orderCartData || {}}
        productList={updatedProductListOrder || []}
        vatValue={vatValue || {}}
      />
    </PDFViewer>
  </div>
);

export default DownloadOrderPDF;
