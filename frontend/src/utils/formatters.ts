import type { Language } from '../types/index.ts';

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const GUJARATI_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

/**
 * Converts Western digits to Devanagari numerals
 */
export function toDevanagariNumerals(input: number | string): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Converts Western digits to Gujarati numerals
 */
export function toGujaratiNumerals(input: number | string): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => GUJARATI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Formats digits and numbers according to selected language
 */
export function formatLocalizedNumber(input: number | string, lang: Language = 'en'): string {
  if (lang === 'mr' || lang === 'hi') {
    return toDevanagariNumerals(input);
  }
  if (lang === 'gu') {
    return toGujaratiNumerals(input);
  }
  return String(input);
}

/**
 * Formats a currency amount according to Indian numbering format
 */
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats currency with currency symbol and localized numerals
 */
export function formatLocalizedCurrency(amount: number, lang: Language = 'en'): string {
  const formattedStandard = formatIndianCurrency(amount);
  if (lang === 'mr' || lang === 'hi') {
    return '₹' + toDevanagariNumerals(formattedStandard);
  }
  if (lang === 'gu') {
    return '₹' + toGujaratiNumerals(formattedStandard);
  }
  return '₹ ' + formattedStandard;
}

/**
 * Calculates estimated tax savings under 80G for a 30% + cess slab (approx 31.2%)
 */
export function calculateTaxSaving(donationAmount: number, taxRate: number = 0.312): number {
  if (donationAmount <= 0) return 0;
  return Math.round(donationAmount * taxRate);
}

/**
 * Calculates Japa completion percentage
 */
export function calculateProgressPercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  const pct = (current / target) * 100;
  return Math.min(100, Math.max(0, parseFloat(pct.toFixed(1))));
}

/**
 * Formats a Date or ISO date string according to the selected language
 */
export function formatLocalizedDate(dateInput: string | Date, lang: Language = 'en'): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    const locale = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-IN';
    const formatted = d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
    if (lang === 'mr' || lang === 'hi') {
      return toDevanagariNumerals(formatted);
    }
    if (lang === 'gu') {
      return toGujaratiNumerals(formatted);
    }
    return formatted;
  } catch {
    return String(dateInput);
  }
}
