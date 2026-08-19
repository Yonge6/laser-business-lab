# OneLaser conversion funnel design

## Goal

Help a maker move from a product opportunity to a justified equipment decision, then send qualified laser shoppers to the most relevant page on `1laser.com` without turning Maker Business Lab into a generic sales site.

## Approaches considered

1. **Site-wide OneLaser promotion** — high visibility, but weakens trust and incorrectly promotes laser equipment inside 3D-printing and heat-press paths.
2. **Contextual recommendation funnel (selected)** — keeps product and ROI validation first, then introduces OneLaser only when the user has selected a laser path and has enough context to understand the recommendation.
3. **Footer or learning-page links only** — easy to implement, but too far from the moment when the user is ready to choose equipment.

## Selected path

1. **Opportunity selected** — the primary action remains ROI validation. Laser opportunities also offer an internal “match laser equipment” action.
2. **ROI report** — the report keeps the equipment finder as the main next step. A compact OneLaser checkpoint lets users who are already ready browse the official laser lineup.
3. **Equipment match result** — the strongest conversion point. The matched laser category is paired with a relevant OneLaser product or lineup, an explicit reason for the fit, a primary product-page link, and a secondary free-consultation link.
4. **OneLaser landing page** — open the exact official product page in a new tab with consistent UTM parameters.

## Guardrails

- Show OneLaser only for laser paths. Never send 3D-printing or heat-press users to a laser storefront.
- Keep recommendation logic visible and preserve the “not a paid ranking or earnings promise” disclosure.
- Do not copy live prices into Maker Business Lab; OneLaser owns current pricing, specifications, and availability.
- Track outbound placements and destinations with `recommendation_view` and `recommendation_click` events.
- Use `utm_source=maker_business_lab`, `utm_medium=referral`, a placement-specific campaign, and profile-specific content.
- Open external destinations in a new tab and clearly label them as the official OneLaser site.

## Acceptance checks

- A personalized-tumbler laser path recommends the OneLaser VertiGo destination.
- Desktop CO2, entry-upgrade, and production laser profiles receive relevant OneLaser destinations.
- ROI, opportunity selection, and equipment result copy exists in English and Chinese.
- The full site remains usable at desktop and mobile widths.
- Unit tests verify official-host enforcement, UTM output, and recommendation mappings.
