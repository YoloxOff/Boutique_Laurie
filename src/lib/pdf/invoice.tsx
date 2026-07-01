import "server-only";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { put } from "@vercel/blob";
import { env } from "@/env";
import { getOrderByNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  total: { marginTop: 12, fontSize: 14 },
});

function InvoiceDocument({
  orderNumber,
  email,
  items,
  subtotal,
  discountAmount,
  shippingAmount,
  total,
}: {
  orderNumber: string;
  email: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Facture {orderNumber}</Text>
        <Text>Laurie Coiffure — {email}</Text>
        <View style={{ marginTop: 20 }}>
          {items.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text>
                {item.name} x{item.quantity}
              </Text>
              <Text>{formatPrice(item.unitPrice * item.quantity)}</Text>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={styles.row}>
            <Text>Sous-total</Text>
            <Text>{formatPrice(subtotal)}</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.row}>
              <Text>Réduction</Text>
              <Text>-{formatPrice(discountAmount)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text>Livraison</Text>
            <Text>{formatPrice(shippingAmount)}</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text>Total</Text>
            <Text>{formatPrice(total)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Génère la facture PDF et la téléverse sur Vercel Blob si configuré.
 * En mode démo (BLOB_READ_WRITE_TOKEN absent), retourne null : la facture
 * n'est pas persistée mais le flux de commande reste fonctionnel.
 */
export async function generateInvoicePdf(orderNumber: string): Promise<string | null> {
  const order = await getOrderByNumber(orderNumber);
  if (!order) return null;

  const buffer = await renderToBuffer(
    <InvoiceDocument
      orderNumber={order.orderNumber}
      email={order.email}
      items={order.items.map((i) => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice }))}
      subtotal={order.subtotal}
      discountAmount={order.discountAmount}
      shippingAmount={order.shippingAmount}
      total={order.total}
    />
  );

  if (!env.BLOB_READ_WRITE_TOKEN) {
    console.log(`[invoice:mock] facture générée en mémoire pour ${orderNumber} (${buffer.length} octets, non persistée)`);
    return null;
  }

  const blob = await put(`invoices/${orderNumber}.pdf`, buffer, {
    access: "public",
    contentType: "application/pdf",
  });
  return blob.url;
}
