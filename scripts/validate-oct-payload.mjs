#!/usr/bin/env node
/**
 * AttributionRepair — Google Ads Offline Conversion & Enhanced Conversions Validator
 * Enforces single-click-ID mutual exclusion (gclid vs gbraid/wbraid), 90-day GCLID expiration,
 * ISO timezone offset checks, order_id deduplication, and SHA-256 normalization.
 * Interactive web tool: https://attributionrepair.com/tools/payload-validator/
 */
import crypto from "node:crypto";

export function validateOctRow(row) {
  const errors = [];
  const clickIds = ["gclid", "gbraid", "wbraid"].filter((k) => row[k] && String(row[k]).trim());
  if (clickIds.length > 1) errors.push(`CONFLICTING_CLICK_IDENTIFIERS: found ${clickIds.join(" + ")}`);
  if (!row.order_id) errors.push("MISSING_ORDER_ID: required for deterministic deduplication");
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(String(row.conversion_time || ""))) {
    errors.push("MISSING_TIMEZONE_OFFSET: conversion_time must include explicit ISO offset");
  }
  if (row.click_time && row.conversion_time) {
    const lagDays = (Date.parse(row.conversion_time) - Date.parse(row.click_time)) / 86_400_000;
    if (lagDays > 90) errors.push(`EXPIRED_EVENT: ${Math.round(lagDays)} days exceeds Google 90-day GCLID limit`);
    if (lagDays < 0) errors.push("CONVERSION_PRECEDES_EVENT: conversion_time earlier than click_time");
  }
  const cleanEmail = String(row.email || "").trim().toLowerCase();
  const hashedEmail = cleanEmail.includes("@") ? crypto.createHash("sha256").update(cleanEmail).digest("hex") : null;
  return { ok: errors.length === 0, errors, hashedEmail };
}

// CLI: npx attribution-repair-kit rows.json   (a JSON array of OCT rows, or one row object; "-" reads stdin)
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
const isMain = process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
if (isMain) {
  const src = process.argv[2];
  if (!src) {
    console.error("usage: ar-validate-oct <rows.json | ->\n  rows: [{gclid, order_id, click_time, conversion_time, email}, ...]");
    process.exit(2);
  }
  const parsed = JSON.parse(readFileSync(src === "-" ? 0 : src, "utf8"));
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  let bad = 0;
  rows.forEach((row, i) => {
    const r = validateOctRow(row);
    if (!r.ok) bad++;
    console.log(`${r.ok ? "OK  " : "FAIL"} row ${i + 1}${row.order_id ? ` (${row.order_id})` : ""}${r.ok ? "" : ": " + r.errors.join("; ")}`);
  });
  console.log(`${rows.length - bad}/${rows.length} rows pass. Interactive validator: https://attributionrepair.com/tools/payload-validator/`);
  process.exit(bad ? 1 : 0);
}
