/**
 * Seed the database with products from the CSV template.
 *
 * Usage:
 *   npx tsx scripts/seed-products.ts
 *
 * The script is idempotent — it upserts by SKU.
 * Products without a SKU are inserted with a generated one.
 */

import { createReadStream } from 'fs';
import { resolve } from 'path';
import { parse } from 'csv-parse';
import { prisma } from '../lib/db';

const CSV_PATH = resolve(
  process.cwd(),
  'Sachi_Products_Import_Template - Sachi_Products_Import_Template.csv'
);

interface CsvRow {
  SKU: string;
  'Thumbnail for Reference': string;
  Name: string;
  'Category (rings/earrings/pendants/bracelets/bangles/necklaces)': string;
  Description: string;
  'BaseMetal (gold/silver/brass)': string;
  'PurityOptions (Comma separated, e.g. 14K, 18K or 925)': string;
  'MetalColorOptions (Dropdown choices, e.g. Yellow Gold, White Gold)': string;
  'AvailableStones (Dropdown choices, e.g. Diamond, Ruby, None)': string;
  PrimaryGemstone: string;
  'ImageURLs (Comma separated Drive/Dropbox links)': string;
  'Featured (TRUE/FALSE)': string;
  'Net Weight': string;
}

function splitAndTrim(value: string): string[] {
  if (!value || !value.trim()) return [];
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

function normalizeCategory(raw: string): string {
  const val = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    ring: 'rings', rings: 'rings',
    earring: 'earrings', earrings: 'earrings',
    pendant: 'pendants', pendants: 'pendants',
    bracelet: 'bracelets', bracelets: 'bracelets',
    bangle: 'bangles', bangles: 'bangles',
    necklace: 'necklaces', necklaces: 'necklaces',
  };
  return map[val] ?? val;
}

function normalizeBaseMetal(raw: string): string {
  const val = raw.trim().toLowerCase();
  if (val.startsWith('gold')) return 'gold';
  if (val.startsWith('silver') || val.includes('925')) return 'silver';
  if (val.startsWith('brass')) return 'brass';
  return 'silver'; // default
}

async function run() {
  const rows: CsvRow[] = await new Promise((resolve, reject) => {
    const records: CsvRow[] = [];
    createReadStream(CSV_PATH)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          relax_column_count: true,
          trim: true,
        })
      )
      .on('data', (row: CsvRow) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });

  console.log(`\nParsed ${rows.length} rows from CSV\n`);

  let inserted = 0;
  let updated = 0;
  let errored = 0;

  for (const row of rows) {
    const sku = row.SKU?.trim() || null;
    const name = row.Name?.trim();
    if (!name) continue;

    // Generate a stable SKU for rows missing one
    const effectiveSku = sku || `SJ-AUTO-${name.replace(/\s+/g, '-').toUpperCase().slice(0, 20)}`;

    const category = normalizeCategory(
      row['Category (rings/earrings/pendants/bracelets/bangles/necklaces)'] || ''
    );
    const baseMetal = normalizeBaseMetal(row['BaseMetal (gold/silver/brass)'] || '');
    const purityOptions = splitAndTrim(
      row['PurityOptions (Comma separated, e.g. 14K, 18K or 925)'] || ''
    );
    const metalColorOptions = (row['MetalColorOptions (Dropdown choices, e.g. Yellow Gold, White Gold)'] || '')
      .split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    const availableStones = splitAndTrim(
      row['AvailableStones (Dropdown choices, e.g. Diamond, Ruby, None)'] || ''
    );
    const primaryGemstone = row.PrimaryGemstone?.trim() || null;
    const featured = row['Featured (TRUE/FALSE)']?.trim().toUpperCase() === 'TRUE';
    const weightRaw = row['Net Weight']?.trim();
    const weightGrams = weightRaw ? parseFloat(weightRaw) : null;

    // Image URLs left empty for now — will be populated via admin or upload script
    const images: string[] = [];

    try {
      const existing = await prisma.product.findUnique({ where: { sku: effectiveSku } });

      if (existing) {
        await prisma.product.update({
          where: { sku: effectiveSku },
          data: {
            name,
            category,
            description: row.Description?.trim() || '',
            baseMetal,
            purityOptions,
            metalColorOptions,
            availableStones,
            primaryGemstone,
            featured,
            weightGrams: weightGrams ?? undefined,
          },
        });
        updated++;
        console.log(`  ~ Updated: ${effectiveSku} — ${name}`);
      } else {
        await prisma.product.create({
          data: {
            sku: effectiveSku,
            name,
            category,
            description: row.Description?.trim() || '',
            baseMetal,
            purityOptions,
            metalColorOptions,
            availableStones,
            primaryGemstone,
            images,
            featured,
            weightGrams: weightGrams ?? undefined,
            makingChargeC: 0,
          },
        });
        inserted++;
        console.log(`  + Inserted: ${effectiveSku} — ${name}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed: ${effectiveSku} — ${err}`);
      errored++;
    }
  }

  console.log(`\nDone: ${inserted} inserted, ${updated} updated, ${errored} errors.\n`);
  await prisma.$disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
