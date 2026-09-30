import CmsPageSettingsForm from '@/components/admin/cms/CmsPageSettingsForm';

export const metadata = { title: 'New Page — Admin' };

export default function NewCmsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-cormorant text-3xl text-charcoal mb-2">New Page</h1>
      <p className="text-warm text-sm font-dm-sans mb-8">
        Create the page first — you’ll add sections on the next screen.
      </p>
      <CmsPageSettingsForm />
    </div>
  );
}
