"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuoteCart } from "@/store/quoteCart";
import { currencyContext, formatMoney } from "@/lib/currency";
import type { Product, MetalPrices } from "@/types";

const KARAT_PURITY: Record<string, number> = {
  "9K":  0.375,
  "10K": 0.4167,
  "14K": 0.5833,
  "18K": 0.75,
  "22K": 0.9167,
  "24K": 1.0,
  "925": 0.925,
  "999": 0.999,
};

function computeEstimate(
  mp: MetalPrices,
  product: Product,
  karat: string,
  primaryStone: string,
  primaryCount: number,
  secondaryStone: string,
  secondaryCount: number,
): number {
  const w = product.weightGrams ?? 0;
  const raw = mp.raw;

  let baseSpot = raw?.silverUSDPerGram ?? 0.9;
  if (product.baseMetal === "gold")  baseSpot = raw?.goldUSDPerGram  ?? 75;
  if (product.baseMetal === "brass") baseSpot = raw?.brassUSDPerGram ?? 0.08;

  const m         = baseSpot * (KARAT_PURITY[karat] ?? 1);
  const s         = mp.settings;
  const metalCost = w * m * (s.wastageFactor ?? 1.07);

  const stone1    = primaryStone && primaryStone !== "None" ? primaryStone : "None";
  const e1        = mp.stonePrices?.[stone1] ?? { priceD: 0, satinCost: 0 };
  const stoneCost1 = primaryCount * (e1.priceD + e1.satinCost);

  const stone2    = secondaryStone && secondaryStone !== "None" ? secondaryStone : "None";
  const e2        = mp.stonePrices?.[stone2] ?? { priceD: 0, satinCost: 0 };
  const stoneCost2 = secondaryCount * (e2.priceD + e2.satinCost);

  const L          = product.makingChargeC > 0 ? product.makingChargeC : (s.labourCostPerGram ?? 0);
  const platingCost = (s.platingCostFactor ?? 0) * w * m;

  return metalCost + stoneCost1 + stoneCost2 + (L * w) + platingCost;
}

// Stepper used for both gem count fields
function CountStepper({
  label,
  sublabel,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-3">
        {label}
      </label>
      <div className="inline-flex items-center border border-black/10">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-gold/10 transition-colors font-dm-sans text-lg leading-none"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="w-10 text-center font-dm-sans text-sm text-charcoal select-none">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-gold/10 transition-colors font-dm-sans text-lg leading-none"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
      {sublabel && (
        <p className="text-[10px] text-warm font-dm-sans mt-1.5 max-w-xs">{sublabel}</p>
      )}
    </div>
  );
}

export default function ProductActions({ product }: { product: Product }) {
  const addItem = useQuoteCart((s) => s.addItem);

  // ── Option lists ─────────────────────────────────────────────────────────────
  const metalOptions  = product.metalColorOptions?.length ? product.metalColorOptions : ["Yellow Gold"];
  const purityOptions = product.purityOptions?.length     ? product.purityOptions     : ["925"];

  // Primary stones from primaryGemstone (comma-separated) + always "None"
  const primaryStoneOptions = useMemo(() => {
    const parsed = product.primaryGemstone
      ? product.primaryGemstone.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    return parsed.length > 0 ? ["None", ...parsed] : ["None"];
  }, [product.primaryGemstone]);

  // Secondary stones from availableStones, filtering "None" entries
  const secondaryStoneOptions = useMemo(() => {
    const filtered = (product.availableStones ?? []).filter((s) => s !== "None" && s.trim() !== "");
    return filtered.length > 0 ? ["None", ...filtered] : ["None"];
  }, [product.availableStones]);

  // ── Selection state ───────────────────────────────────────────────────────────
  const [selectedKarat,         setSelectedKarat]         = useState(purityOptions[0]);
  const [selectedMetal,         setSelectedMetal]         = useState(metalOptions[0]);
  const [primaryStone,          setPrimaryStone]          = useState(primaryStoneOptions[0]);
  const [primaryCount,          setPrimaryCount]          = useState(product.gemstoneCount ?? 1);
  const [secondaryStone,        setSecondaryStone]        = useState(secondaryStoneOptions[0]);
  const [secondaryCount,        setSecondaryCount]        = useState(0);

  // When primary stone changes to None, zero the count; restore on re-select
  const handlePrimaryStoneChange = (stone: string) => {
    setPrimaryStone(stone);
    if (stone === "None") setPrimaryCount(0);
    else if (primaryCount === 0) setPrimaryCount(product.gemstoneCount ?? 1);
  };

  // When secondary stone changes to None, zero the count; restore on re-select
  const handleSecondaryStoneChange = (stone: string) => {
    setSecondaryStone(stone);
    if (stone === "None") setSecondaryCount(0);
    else if (secondaryCount === 0) setSecondaryCount(1);
  };

  // ── Live price estimate ───────────────────────────────────────────────────────
  const [metalPrices,  setMetalPrices]  = useState<MetalPrices | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    fetch("/api/metal-prices")
      .then((r) => r.json())
      .then((data) => { setMetalPrices(data); setPriceLoading(false); })
      .catch(() => setPriceLoading(false));
  }, []);

  const estimatedINR = useMemo(() => {
    if (!metalPrices) return null;
    return computeEstimate(
      metalPrices, product,
      selectedKarat,
      primaryStone,   primaryCount,
      secondaryStone, secondaryCount,
    );
  }, [metalPrices, product, selectedKarat, primaryStone, primaryCount, secondaryStone, secondaryCount]);

  // Display currency comes from the same payload (admin-controlled, INR default)
  const currency = useMemo(() => currencyContext(metalPrices), [metalPrices]);

  const primarySelected   = primaryStone   !== "None";
  const secondarySelected = secondaryStone !== "None";
  const hasSecondaryChoice = secondaryStoneOptions.length > 1;

  // ── Add to cart ───────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    // Bake the selected primary count into the product so cart formula uses it
    const productForCart: Product = { ...product, gemstoneCount: primaryCount };
    addItem(
      productForCart,
      selectedKarat,
      selectedMetal,
      primaryStone,
      1,
      secondarySelected ? secondaryStone : undefined,
      secondarySelected ? secondaryCount : undefined,
    );
  };

  // ── Build estimate label ──────────────────────────────────────────────────────
  const estimateLabel = [
    selectedKarat,
    primarySelected   ? `${primaryCount}× ${primaryStone}`     : null,
    secondarySelected ? `${secondaryCount}× ${secondaryStone}` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-8">

      {/* Metal + Primary stone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-3">
            Metal Preference
          </label>
          <select
            value={selectedMetal}
            onChange={(e) => setSelectedMetal(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-black/10 text-charcoal font-dm-sans text-sm focus:outline-none focus:border-charcoal transition-colors"
          >
            {metalOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-3">
            Primary Stone
          </label>
          <select
            value={primaryStone}
            onChange={(e) => handlePrimaryStoneChange(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-black/10 text-charcoal font-dm-sans text-sm focus:outline-none focus:border-charcoal transition-colors"
          >
            {primaryStoneOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Primary stone count — visible when a real stone is selected */}
      {primarySelected && (
        <CountStepper
          label="Primary Stone Count (N1)"
          sublabel={`Number of ${primaryStone} stones — drives N1×(s+st) in the estimate.`}
          value={primaryCount}
          onChange={setPrimaryCount}
          min={1}
        />
      )}

      {/* Secondary stone row — shown when the product has secondary stone choices */}
      {hasSecondaryChoice && (
        <div className="border-t border-gold/10 pt-6 flex flex-col gap-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-1">
              Secondary Stone
            </label>
            <p className="text-[10px] text-warm/60 font-dm-sans mb-3">Optional accent stone set alongside the primary.</p>
            <select
              value={secondaryStone}
              onChange={(e) => handleSecondaryStoneChange(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-3 bg-transparent border border-black/10 text-charcoal font-dm-sans text-sm focus:outline-none focus:border-charcoal transition-colors"
            >
              {secondaryStoneOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {secondarySelected && (
            <CountStepper
              label="Secondary Stone Count (N2)"
              sublabel={`Number of ${secondaryStone} accent stones — drives N2×(s+st) in the estimate.`}
              value={secondaryCount}
              onChange={setSecondaryCount}
              min={1}
            />
          )}
        </div>
      )}

      {/* Karat / Purity chips */}
      <div>
        <span className="block text-xs uppercase tracking-[0.2em] text-warm font-dm-sans mb-3">
          {product.baseMetal === "gold" ? "Karat" : "Purity"}
        </span>
        <div className="flex flex-wrap gap-3">
          {purityOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedKarat(opt)}
              className={`px-6 py-2 text-sm font-dm-sans tracking-widest uppercase transition-all ${
                selectedKarat === opt
                  ? "bg-charcoal text-ivory border border-charcoal"
                  : "bg-transparent border border-black/10 text-charcoal hover:border-black/30"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Live price estimate */}
      <div className="border-t border-gold/20 pt-6">
        {priceLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gold/40 animate-pulse" />
            <span className="font-dm-sans text-xs text-warm/60 uppercase tracking-widest">
              Calculating estimate…
            </span>
          </div>
        ) : estimatedINR !== null && estimatedINR > 0 ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-warm font-dm-sans">
              Estimated price per piece
            </span>
            <p className="font-cormorant text-3xl text-charcoal font-medium">
              {formatMoney(estimatedINR, currency)}
            </p>
            <p className="text-[10px] text-warm/60 font-dm-sans mt-0.5">
              {estimateLabel} · indicative only, based on live IBJA/MCX rates
            </p>
          </div>
        ) : null}
      </div>

      {/* Add to Quotation */}
      <button
        onClick={handleAddToCart}
        className="btn-primary w-full md:w-auto self-start text-center"
      >
        Add to Quotation
      </button>
    </div>
  );
}
