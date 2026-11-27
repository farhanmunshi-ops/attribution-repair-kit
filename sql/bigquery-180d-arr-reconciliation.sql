-- AttributionRepair: 180-Day Enterprise B2B ARR Reconciliation (Beyond Google 90-Day GCLID Cliff)
-- Full guide: https://attributionrepair.com/guides/90-day-gclid-expiration-b2b/
SELECT
  c.utm_campaign,
  COUNT(DISTINCT d.deal_id) AS closed_won_deals,
  SUM(d.amount_usd) AS actual_closed_won_arr,
  COUNTIF(DATE_DIFF(d.close_date, c.first_click_date, DAY) > 90) AS deals_past_90d_cliff,
  ROUND(AVG(DATE_DIFF(d.close_date, c.first_click_date, DAY)), 1) AS avg_days_to_close
FROM `analytics.crm_deals` d
JOIN `analytics.crm_contacts` c ON d.primary_contact_id = c.contact_id
WHERE d.deal_stage = "closedwon"
  AND (c.ar_gclid IS NOT NULL OR c.utm_source = "google")
  AND d.close_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY)
GROUP BY 1
ORDER BY actual_closed_won_arr DESC;
