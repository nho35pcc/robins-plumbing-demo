# Adjustment Requests

## Open


## Done

- [x] DR-Pressure-The-Power-Washing-Experts-03-26-2026_12_25_PM.png — ALL "Get A Free Quote" /
"Get Free Quote" / "Start With A Free Quote" / "Get A Quote In Your Area" buttons site-wide
should open the popup modal (data-quote-modal), NOT redirect to /contact. "Leave A Review"
button should link to /review (review gate page). Service areas empty box should render
Google Maps embed using business.googleMapsApiKey.
- [x] DR-Pressure-The-Power-Washing-Experts-03-26-2026_11_14_AM.png — contact page: replace GHL iframe with native fetch() form posting to ghlWebhookUrl (see Layout.astro modal as reference for the pattern)
- [x] Services-On-Hover.png — rebuild service grid as 2x2 full-bleed photo cards with service name in dark pill at bottom; on hover description slides up from below pill; clicking card goes to /services/[slug]; see docs/reference/Services-On-Hover.png + Services-On-Hover1.png + Services-On-Hover2.png + Services-On-Hover3.png
- [x] Glassperts-Review-Widget.png — build /review.astro: clickable stars, 4-5 stars opens business.googleReviewUrl in new tab immediately, 1-3 stars shows internal feedback form posting to ghlWebhookUrl; see docs/reference/1_2_3_star_review_internal_form.png + 4_5_review_goes_immediately_to_gmb.png + After_filling_out_internal_form.png
- [x] Glassperts-services-page.png — build /services/[slug].astro dynamic detail pages using getStaticPaths() from business.services[]; each page: hero with service name, longDescription, serviceImages grid, FAQ accordion, CTA modal trigger; see docs/reference/Glassperts_services_page.png
- [x] Glassperts-Home-Annotated.png — add social links widget to About section, maps over business.socialLinks[]; only renders if array has entries


<!-- Completed items move here -->