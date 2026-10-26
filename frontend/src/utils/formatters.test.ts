import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toDevanagariNumerals,
  toGujaratiNumerals,
  formatIndianCurrency,
  formatLocalizedCurrency,
  calculateTaxSaving,
  calculateProgressPercentage,
} from './formatters.ts';

test('converts western digits to devanagari numerals correctly', () => {
  assert.equal(toDevanagariNumerals('0123456789'), '०१२३४५६७८९');
  assert.equal(toDevanagariNumerals(2025), '२०२५');
  assert.equal(toDevanagariNumerals('CVP-7829'), 'CVP-७८२९');
});

test('converts western digits to gujarati numerals correctly', () => {
  assert.equal(toGujaratiNumerals('0123456789'), '૦૧૨૩૪૫૬૭૮૯');
  assert.equal(toGujaratiNumerals(36000), '૩૬૦૦૦');
});

test('formats indian currency correctly', () => {
  assert.equal(formatIndianCurrency(21000), '21,000');
  assert.equal(formatIndianCurrency(125000), '1,25,000');
});

test('formats localized currency for different languages', () => {
  assert.equal(formatLocalizedCurrency(36000, 'en'), '₹ 36,000');
  assert.equal(formatLocalizedCurrency(36000, 'mr'), '₹३६,०००');
  assert.equal(formatLocalizedCurrency(36000, 'hi'), '₹३६,०००');
  assert.equal(formatLocalizedCurrency(36000, 'gu'), '₹૩૬,૦૦૦');
});

test('calculates 80G tax saving correctly', () => {
  // 36000 * 0.312 = 11232
  assert.equal(calculateTaxSaving(36000, 0.312), 11232);
  assert.equal(calculateTaxSaving(0), 0);
  assert.equal(calculateTaxSaving(-500), 0);
});

test('calculates progress percentage correctly', () => {
  assert.equal(calculateProgressPercentage(19000, 125000), 15.2);
  assert.equal(calculateProgressPercentage(4, 12), 33.3);
  assert.equal(calculateProgressPercentage(0, 100), 0);
  assert.equal(calculateProgressPercentage(100, 100), 100);
});
