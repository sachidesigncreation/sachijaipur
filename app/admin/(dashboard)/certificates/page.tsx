import { prisma } from '@/lib/db';
import CertificateAdminCard from '@/components/admin/CertificateAdminCard';
import AddCertificateForm from '@/components/admin/AddCertificateForm';

export const metadata = { title: 'Certificates — Admin' };

export default async function AdminCertificatesPage() {
  const certs = await prisma.certificate.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <h1 className="font-cormorant text-3xl text-charcoal mb-8">Certificates</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {certs.map(cert => (
          <CertificateAdminCard key={cert.id} cert={cert} />
        ))}
      </div>

      <div className="border-t border-black/10 pt-8">
        <h2 className="font-dm-sans text-sm uppercase tracking-widest text-charcoal mb-6">Add Certificate</h2>
        <AddCertificateForm />
      </div>
    </div>
  );
}
