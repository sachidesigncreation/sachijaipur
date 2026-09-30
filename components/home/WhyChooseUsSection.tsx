"use client";
import ScrollReveal from "../ui/ScrollReveal";

export default function WhyChooseUsSection() {
  const reasons = [
    {
      title: "In-House Production",
      desc: "150 craftsmen under one roof, providing complete end-to-end quality control and faster turnaround.",
    },
    {
      title: "Gemstone Expertise",
      desc: "Direct sourcing of precious stones from Jaipur's finest cutters, ensuring vibrancy and match perfection.",
    },
    {
      title: "Sustainability Focus",
      desc: "Ethical material sourcing, safe working conditions, and responsible waste management protocols.",
    },
    {
      title: "CAD Precision",
      desc: "Advanced 3D modeling allows perfect prototyping before physical casting begins.",
    },
    {
      title: "Scalable Manufacturing",
      desc: "Equipped to handle boutique minimums or massive chain-store volume without compromising detail.",
    },
    {
      title: "Trusted Partnerships",
      desc: "Over a decade building reliable B2B wholesale relationships globally.",
    },
  ];

  return (
    <section
      id="why-choose-us"
      className="bg-gold py-32 border-y border-jet/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal className="text-center mb-24 flex flex-col items-center">
          <span className="text-jet text-xs tracking-[0.25em] uppercase font-dm-sans mb-4 block">
            Why Partner With Sachi Jaipur
          </span>
          <h2 className="font-cormorant text-display-md text-jet mb-6">
            The Manufacturer of Choice
          </h2>
          <div className="h-px w-16 bg-jet animate-scaleX-reveal" />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          {reasons.map((reason, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="flex gap-6 group">
                <span className="font-cormorant text-4xl text-jet/40 leading-none group-hover:text-jet transition-colors duration-500">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-jet font-cormorant text-subheading mb-2">
                    {reason.title}
                  </h4>
                  <p className="text-jet/80 text-body">{reason.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
