'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  type: z.enum(['INQUIRY', 'QUOTATION']),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().min(7, 'Phone number is required'),
  message: z.string().min(10, 'Please provide more details'),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'INQUIRY' | 'QUOTATION'>('INQUIRY');
  const [siteInfo, setSiteInfo] = useState({
    address: 'Sitapura Industrial Area, Jaipur, Rajasthan 302022, India',
    email: 'contact@sachijewellery.com',
    phone: '+91 89469 31404',
    whatsapp: '918946931404',
    gst: '08ACSFS4747G1ZI',
    hours1: 'Monday - Saturday: 10:00 AM - 7:00 PM (IST)',
    hours2: 'Sunday: Closed',
  });

  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then(d => {
        if (d?.company) {
          setSiteInfo(s => ({
            address: d.company.address || s.address,
            email: d.company.email || s.email,
            phone: d.company.phone || s.phone,
            whatsapp: d.company.whatsapp || s.whatsapp,
            gst: d.company.gst || s.gst,
            hours1: d.company.hours1 || s.hours1,
            hours2: d.company.hours2 || s.hours2,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: 'INQUIRY' }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ ...data, type: activeTab }),
      });
      if (res.ok) {
        setSuccess(true);
        reset();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-24 min-h-[50vh] grid grid-cols-1 lg:grid-cols-2 gap-20">
      {/* Info Column */}
      <div>
        <h2 className="font-cormorant text-heading text-charcoal mb-8">Get in Touch</h2>

        <div className="space-y-8 font-dm-sans text-charcoal-light">
          <div>
            <h3 className="text-sm font-medium tracking-widest text-gold uppercase mb-2">Registered Office & Factory</h3>
            {siteInfo.address.split(/\r?\n/).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-widest text-gold uppercase mb-2">Contact Details</h3>
            <p className="hover:text-charcoal transition-colors">
              <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>
            </p>
            <p className="hover:text-charcoal transition-colors">
              <a href={`tel:+${siteInfo.phone.replace(/\D/g, '')}`}>{siteInfo.phone}</a>
            </p>
            <p className="hover:text-charcoal transition-colors mt-1">
              <a href={`https://wa.me/${siteInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp: {siteInfo.phone}
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-widest text-gold uppercase mb-2">GST Registration</h3>
            <p className="font-mono tracking-wider">{siteInfo.gst}</p>
          </div>

            <div>
              <h3 className="text-sm font-medium tracking-widest text-gold uppercase mb-2">Business Hours</h3>
              <p>{siteInfo.hours1}</p>
              <p>{siteInfo.hours2}</p>
            </div>
        </div>
      </div>

      {/* Form Column */}
      <div id="quote">
        <div className="bg-pearl border border-gold/20 p-8 lg:p-12">
          <div className="flex gap-4 mb-8 border-b border-black/10 pb-4">
            <button
              onClick={() => setActiveTab('INQUIRY')}
              className={`font-dm-sans text-sm uppercase tracking-widest pb-4 -mb-[17px] border-b-2 transition-colors ${activeTab === 'INQUIRY' ? 'border-gold text-charcoal' : 'border-transparent text-warm hover:text-charcoal'}`}
            >
              Inquiry
            </button>
            <button
              onClick={() => setActiveTab('QUOTATION')}
              className={`font-dm-sans text-sm uppercase tracking-widest pb-4 -mb-[17px] border-b-2 transition-colors ${activeTab === 'QUOTATION' ? 'border-gold text-charcoal' : 'border-transparent text-warm hover:text-charcoal'}`}
            >
              Formal Quotation
            </button>
          </div>

          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <h3 className="font-cormorant text-2xl text-charcoal mb-2">Message Received</h3>
              <p className="text-charcoal-light font-dm-sans">Our team will get back to you within 24 business hours.</p>
              <button onClick={() => setSuccess(false)} className="mt-8 text-xs text-gold uppercase tracking-widest border-b border-gold pb-1 hover:text-charcoal transition-colors">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input {...register('name')} placeholder="Full Name *" className={`w-full bg-ivory border ${errors.name ? 'border-red-500' : 'border-gold/30'} px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold`} />
                  {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                </div>
                <div>
                  <input {...register('email')} placeholder="Email Address *" className={`w-full bg-ivory border ${errors.email ? 'border-red-500' : 'border-gold/30'} px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold`} />
                  {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input {...register('company')} placeholder="Company Name" className="w-full bg-ivory border border-gold/30 px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <input {...register('phone')} placeholder="Phone Number *" className={`w-full bg-ivory border ${errors.phone ? 'border-red-500' : 'border-gold/30'} px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold`} />
                  {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                </div>
              </div>

              <div>
                <textarea {...register('message')} placeholder={activeTab === 'QUOTATION' ? 'Please paste your quotation details here or provide a link to the generated Quote PDF.' : 'How can we help you? *'} rows={5} className={`w-full bg-ivory border ${errors.message ? 'border-red-500' : 'border-gold/30'} px-4 py-3 placeholder:text-warm focus:outline-none focus:border-gold resize-none`} />
                {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message.message}</span>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
