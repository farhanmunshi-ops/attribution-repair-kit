/**
 * AttributionRepair — First-Party Click-ID Persistence (MIT License)
 * Captures gclid, gbraid, wbraid, fbclid, and li_fat_id on landing and persists
 * in first-party cookies (90-day TTL) alongside click timestamp and UTMs.
 * Docs & live scanner: https://attributionrepair.com/tools/funnel-inspector/
 */
(function persistAttributionClickIds() {
  var params = new URLSearchParams(window.location.search);
  var keys = ["gclid", "gbraid", "wbraid", "fbclid", "li_fat_id", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var maxAge = 60 * 60 * 24 * 90;
  var capturedClick = false;

  keys.forEach(function (key) {
    var raw = params.get(key);
    if (!raw) return;
    var clean = raw.trim().split(/[&\s#?]/)[0];
    if (!clean) return;
    document.cookie = "ar_" + key + "=" + encodeURIComponent(clean) + "; Max-Age=" + maxAge + "; Path=/; SameSite=Lax; Secure";
    if (key === "gclid" || key === "gbraid" || key === "wbraid" || key === "fbclid" || key === "li_fat_id") {
      capturedClick = true;
    }
  });

  if (capturedClick) {
    document.cookie = "ar_click_ts=" + encodeURIComponent(new Date().toISOString()) + "; Max-Age=" + maxAge + "; Path=/; SameSite=Lax; Secure";
  }
})();
