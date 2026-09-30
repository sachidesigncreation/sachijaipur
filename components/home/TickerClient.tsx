"use client";

export default function TickerClient({
  items,
}: {
  items: string[];
  updatedAt: string | null;
}) {
  return (
    <div className="bg-gold h-[52px] flex items-center overflow-hidden whitespace-nowrap relative border-b border-jet/10">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-jet/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-jet/20 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gold to-transparent z-10 hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gold to-transparent z-10 hidden md:block" />

      <div className="inline-block animate-marquee-scroll">
        {[...items, ...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className="inline-block mx-8 text-jet font-dm-sans text-sm tracking-[0.2em] font-medium uppercase"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
