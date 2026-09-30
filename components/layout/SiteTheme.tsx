import { getSiteSettingsMap } from '@/lib/siteSettings';
import { themeFromMap, THEME_DEFAULTS, sanitizeHex } from '@/lib/siteConfig';

const VAR_FOR_KEY: Record<string, string> = {
  theme_gold: '--color-gold',
  theme_gold_deep: '--color-gold-deep',
  theme_gold_light: '--color-gold-light',
  theme_ivory: '--color-ivory',
  theme_pearl: '--color-pearl',
  theme_charcoal: '--color-charcoal',
  theme_charcoal_light: '--color-charcoal-light',
  theme_warm: '--color-warm',
  theme_jet: '--color-jet',
};

/**
 * Injects the admin-chosen color theme as CSS variable overrides.
 * Rendered in <head> from the root layout. Falls back to globals.css defaults.
 *
 * `html:root` (not plain `:root`) so the admin values always win over the
 * Tailwind defaults regardless of stylesheet order, and every value is
 * hex-sanitized so a bad input can never break the site stylesheet.
 */
export default async function SiteTheme() {
  const map = await getSiteSettingsMap();
  const theme = themeFromMap(map);
  const css = `html:root{${Object.entries(theme)
    .map(([key, value]) => {
      const cssVar = VAR_FOR_KEY[key];
      if (!cssVar) return '';
      return `${cssVar}:${sanitizeHex(value, THEME_DEFAULTS[key])};`;
    })
    .join('')}}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
