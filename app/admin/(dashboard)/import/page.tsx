import CsvImportClient from '@/components/admin/CsvImportClient';

export const metadata = { title: 'CSV Import — Admin' };

export default function AdminImportPage() {
  return (
    <div>
      <h1 className="font-cormorant text-3xl text-charcoal mb-2">CSV Import</h1>
      <p className="text-warm text-sm font-dm-sans mb-8">
        Paste or upload a CSV using the same format as the Products Import Template. Existing products are updated by SKU.
      </p>
      <CsvImportClient />
    </div>
  );
}
