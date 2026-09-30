import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { QuoteItem, MetalPrices } from '@/types';
import { calculateItemPrice, calculateQuoteTotal, getItemBreakdown } from './quotation';
import { currencyContext, formatMoneyAscii } from './currency';

export function generateQuotePDF(
  items: QuoteItem[],
  prices: MetalPrices,
  companyInfo: { name: string; address: string; email: string; phone: string; gst?: string }
): void {
  const doc      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const now      = new Date();
  const quoteRef = `SJ-Q-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const wastage  = prices.settings?.wastageFactor     ?? 1.07;

  // jsPDF's built-in helvetica is WinAnsi-encoded and has no ₹ glyph, so the
  // money columns use the ASCII "INR 1,234" / "USD 15" form instead.
  const currency = currencyContext(prices);
  const code     = currency.currency;
  const fmtMoney = (n: number) => formatMoneyAscii(n, currency);

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(companyInfo.address, 14, 29);
  doc.text(`${companyInfo.email}  |  ${companyInfo.phone}`, 14, 34);
  if (companyInfo.gst) doc.text(`GST: ${companyInfo.gst}`, 14, 38.5);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', 150, 22);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref: ${quoteRef}`, 150, 29);
  doc.text(`Date: ${now.toLocaleDateString('en-IN')}`, 150, 34);

  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // ── Product table (all prices in the site display currency) ──────────────────
  autoTable(doc, {
    startY: 48,
    head: [['#', 'Product', 'SKU', 'Metal · Karat', 'Primary Stone', 'Secondary Stone', 'Wt (g)', 'Qty', `Unit (${code})`, `Total (${code})`]],
    body: items.map((item, i) => {
      const bd       = getItemBreakdown(item, prices);
      const unitINR  = bd.P;
      const totalINR = calculateItemPrice(item, prices);
      const metal    = item.product.baseMetal ?? 'silver';
      const stone1   = item.selectedStone && item.selectedStone !== 'None'
        ? `${bd.N1}× ${item.selectedStone}` : '—';
      const stone2   = item.selectedSecondaryStone && item.selectedSecondaryStone !== 'None'
        ? `${bd.N2}× ${item.selectedSecondaryStone}` : '—';
      const weight   = item.product.weightGrams?.toFixed(2) ?? '—';
      return [
        i + 1,
        item.product.name,
        item.product.sku ?? '—',
        `${metal.charAt(0).toUpperCase() + metal.slice(1)} ${item.selectedKarat}`,
        stone1,
        stone2,
        weight,
        item.quantity,
        fmtMoney(unitINR),
        fmtMoney(totalINR),
      ];
    }),
    foot: [[
      '', '', '', '', '', '', '', 'TOTAL',
      '',
      fmtMoney(calculateQuoteTotal(items, prices)),
    ]],
    headStyles: { fillColor: [201, 146, 42], textColor: [17, 16, 16], fontStyle: 'bold' },
    footStyles: { fillColor: [249, 246, 239], textColor: [44, 42, 39], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // ── Pricing formula footnote ────────────────────────────────────────────────
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.text(`Pricing: P = w × m × ${wastage}  +  N1 × (s1 + st1)  +  N2 × (s2 + st2)  +  L × w`, 14, finalY);
  doc.text(`w = Weight (g)  |  m = Metal ${code}/g (karat-adjusted, live IBJA/MCX)  |  wastage = ` + wastage, 14, finalY + 4.5);
  doc.text(`N1/N2 = Primary/Secondary stone count  |  s = Stone cost (${code})  |  st = Setting cost (${code})  |  L = Labour (${code}/g)`, 14, finalY + 9);
  doc.text(
    `All prices in ${code}` +
      (code === 'USD' ? ` (converted at 1 USD = INR ${currency.usdToInrRate})` : '') +
      `  |  Rates sourced from IBJA/MCX as of ${now.toLocaleString('en-IN')}`,
    14, finalY + 13.5,
  );
  doc.text('This is an indicative quotation only. Final prices subject to written confirmation from Sachi Jaipur.', 14, finalY + 18);

  doc.save(`SachiJaipur_Quote_${quoteRef}.pdf`);
}
