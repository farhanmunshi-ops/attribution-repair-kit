/**
 * AttributionRepair — Cross-Iframe Click-ID Bridge for Chili Piper, Calendly & Typeform
 * Prevents demo booking widgets from landing in HubSpot/Salesforce as Direct Traffic.
 * Blueprints:
 * - https://attributionrepair.com/guides/salesforce-chili-piper-gclid-attribution/
 * - https://attributionrepair.com/guides/webflow-calendly-hubspot-gclid-tracking/
 */
export function readCookie(name) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}

export function hydrateHiddenFields(formEl, fieldMap) {
  Object.entries(fieldMap).forEach(([inputName, cookieKey]) => {
    const val = readCookie(cookieKey);
    const el = formEl.querySelector(`input[name="${inputName}"]`);
    if (el && val) el.value = val;
  });
}

export function decorateTypeform(selector = "[data-tf-live]") {
  const el = document.querySelector(selector);
  if (!el) return;
  const hidden = [
    "gclid=" + readCookie("ar_gclid"),
    "gbraid=" + readCookie("ar_gbraid"),
    "fbclid=" + readCookie("ar_fbclid"),
    "utm_campaign=" + readCookie("ar_utm_campaign")
  ].join(",");
  el.setAttribute("data-tf-hidden", hidden);
}
