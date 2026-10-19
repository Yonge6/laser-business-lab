export type GuideSection = { id: string; title: string; paragraphs: string[]; bullets?: string[]; table?: { headers: string[]; rows: string[][] }; sources?: string[] };
export type MakerGuide = { slug: string; publishedDate: string; reviewedDate: string; title: string; description: string; answer: string; category: string; image: string; sections: GuideSection[]; sources: { id: string; title: string; url: string }[]; faq: { question: string; answer: string }[]; tool: { href: string; label: string } };
export const makerGuides: MakerGuide[] = [
  {
    slug: "laser-engraving-business-startup-costs", publishedDate: "2026-09-23", reviewedDate: "2026-09-23", title: "Laser Engraving Business Startup Costs in the U.S.", category: "STARTUP BUDGET",
    description: "Build a U.S. laser engraving startup budget with a $5,500 worked example, operating break-even, and equipment payback scenarios in USD.",
    image: "/images/opportunities/laser-leather-patches.webp",
    answer: "Budget for the whole workflow, not just the laser. In our illustrative U.S. workshop plan, $4,250 of setup costs, $450 of opening inventory, and $800 of working cash require $5,500 to launch. These are planning assumptions, not equipment quotes or an industry average. Your required cash depends on the product, workspace, and actual supplier quotes.",
    sections: [
      { id: "budget", title: "What belongs in your startup budget?", paragraphs: ["Separate one-time setup, saleable inventory, and cash held for ongoing bills. This makes it easier to see which purchases can wait until buyers have paid for a small batch. The SBA recommends identifying startup expenses before estimating capital needs.", "The example below assumes you already have a suitable workspace and computer. It excludes rent deposits, delivery, sales tax on purchases, insurance, permits, and any building or electrical changes. Obtain local quotes for those items before treating this as a cash requirement."], table: { headers: ["Planning item", "Assumed USD"], rows: [["Laser", "$3,000"], ["Fixtures and accessories", "$500"], ["Extraction and ventilation", "$600"], ["Initial design software allowance", "$150"], ["Setup subtotal", "$4,250"], ["Opening blanks", "$300"], ["Opening packaging", "$150"], ["Working cash reserve", "$800"], ["Total launch cash", "$5,500"]] }, sources: ["sba"] },
      { id: "quotes", title: "Turn the example into a purchase plan", paragraphs: ["Start with one item you can sell repeatedly: for example, a personalized tumbler for a local organization. Ask for quotes for the blank, fixture, packing material, and delivery together. A low machine price does not resolve a workflow that needs expensive accessories or slow manual alignment.", "Confirm the material and process with the equipment supplier, including extraction requirements and workspace suitability. Replace every allowance above with a quote before ordering. Keep a separate line for items billed each month; a recurring software subscription cannot disappear from operating costs just because its first payment appears in the startup budget."], bullets: ["Time five sample orders from artwork intake through packing.", "Record damaged blanks and remakes as well as successful samples.", "Use paid demand to decide the next purchase; ten paid trial orders are a useful small experiment, not proof of sustainable demand."] },
      { id: "break-even", title: "How many orders cover monthly bills?", paragraphs: ["Operating break-even is monthly fixed costs divided by contribution per order. Contribution means selling revenue after the costs caused by that order: materials, hands-on labor, marketplace fees, packaging, and any shipping you pay. It is not simply price minus the blank.", "Assume $250 in monthly fixed costs and $12 of contribution per order after those variable costs. You need 21 whole orders to cover the monthly bills because $250 ÷ $12 = 20.83. That covers current operations; it has not yet repaid the setup investment."], sources: ["sba"] },
      { id: "payback", title: "Equipment payback changes with actual orders", paragraphs: ["Use the remaining monthly contribution after fixed costs to estimate simple setup payback. We use the $4,250 setup subtotal here, not the $5,500 launch cash total: opening inventory and the cash reserve are tracked separately. This avoids counting the same materials again as both an investment and a per-order cost.", "These scenarios hold price, unit contribution, and fixed costs constant. They exclude financing, income taxes, changes in working capital, and replacement purchases. They are arithmetic scenarios, not sales forecasts."], table: { headers: ["Orders / month", "After $250 fixed costs", "Simple setup payback"], rows: [["20", "−$10 / month", "No payback"], ["40", "$230 / month", "18.5 months"], ["100", "$950 / month", "4.5 months"]] } },
      { id: "next-step", title: "Validate the order before buying capacity", paragraphs: ["Write down a buyer, an offer, a delivery date, and a price. Quote a small batch with the actual personalization and packing work included. If the contribution is too low, test the offer, batch size, or process before assuming a larger machine will fix it.", "Use our ROI calculator for an initial production and payback model, then reconcile its inputs with this full budget. The calculator is a planning tool; use your own order ledger to track fees, returns, overhead, and cash movement. Review the budget after the first paid batch and again before adding a second product."] },
    ],
    sources: [{ id: "sba", title: "U.S. Small Business Administration — Plan your business: startup costs and break-even", url: "https://www.sba.gov/counseling/plan-your-business/" }],
    faq: [{ question: "Is $5,500 enough to start a laser engraving business?", answer: "It covers only the assumptions in this example. It is not a minimum or market average. Add your workspace, delivery, taxes, insurance, and local requirements to actual equipment quotes." }, { question: "Does break-even mean the laser has paid for itself?", answer: "No. Operating break-even covers ongoing costs. Setup payback uses what remains after those costs to recover the original setup investment." }],
    tool: { href: "/calculator/laser-roi", label: "Build your ROI model" },
  },
  {
    slug: "etsy-tumbler-pricing-us", publishedDate: "2026-09-23", reviewedDate: "2026-09-23", title: "How to Price Laser-Engraved Tumblers on Etsy (U.S.)", category: "ETSY PRICING",
    description: "Price a laser-engraved tumbler for U.S. Etsy sales: a $32 example with listing fees, payment processing, labor, shipping, and contribution.",
    image: "/images/opportunities/personalized-tumbler.webp",
    answer: "For a U.S. Etsy seller, price an engraved tumbler after the blank, labor, packaging, shipping, and marketplace fees. Our $32 free-shipping example leaves about $9.48 per order before fixed overhead and income taxes. Price minus the $8.20 blank is $23.80, but that is not take-home profit.",
    sections: [
      { id: "fees", title: "Which Etsy fees enter the calculation?", paragraphs: ["For this single-item example, allocate a $0.20 listing fee and a 6.5% transaction fee on the item price. Etsy also applies the transaction fee to charged shipping and gift wrapping; U.S. sales tax is excluded. Listing renewals and unsold listings can add costs beyond this allocation.", "For a U.S. bank account, Etsy Payments processing is 3% plus $0.25. Its base includes shipping and sales tax. These fee bases differ, so combining them into one flat percentage can miss costs. Check Etsy’s current policies before updating a live price."], sources: ["fees", "payments"] },
      { id: "example", title: "A $32 tumbler: the complete worked example", paragraphs: ["Assume one tumbler sold for $32, with no separate shipping charge or gift wrap. For arithmetic only, assume the buyer pays 8% sales tax ($2.56). That is not a nationwide tax rate: the applicable amount depends on the transaction. Sales tax collected for remittance is not included in the $32 of seller revenue.", "The blank costs $8.20. Ten minutes of hands-on work at an assumed $24 hourly rate costs $4. Machine runtime is not necessarily hands-on time; include actual setup, personalization checks, cleanup, customer communication, and packing in your labor record."], table: { headers: ["Item", "Calculation", "USD"], rows: [["Seller revenue", "Item, shipping included", "$32.00"], ["Blank", "Assumed landed cost", "−$8.20"], ["Hands-on labor", "10 minutes × $24/hour", "−$4.00"], ["Packaging", "Assumed", "−$1.25"], ["Carrier postage", "Assumed", "−$5.50"], ["Listing allocation", "One listing fee", "−$0.20"], ["Transaction fee", "$32 × 6.5%", "−$2.08"], ["Payment processing", "$34.56 × 3% + $0.25", "−$1.29"], ["Contribution", "Before fixed overhead and income taxes", "$9.48"]] } },
      { id: "advertising", title: "Stress-test an order attributed to Offsite Ads", paragraphs: ["Etsy’s Offsite Ads charge can be 15% or 12% on attributed orders, depending on the policy’s sales threshold and participation rules. In this U.S. example, a 15% fee on $32 removes another $4.80, leaving about $4.68. A 12% fee removes $3.84, leaving about $5.64.", "Do not apply that cost to every order unless every order is attributed. Equally, do not ignore it when deciding whether an individual promoted order is worth fulfilling. Keep ordinary Etsy Ads spend separate so it is not confused with the Offsite Ads fee."], sources: ["fees"] },
      { id: "missing-costs", title: "What the $9.48 still needs to cover", paragraphs: ["Contribution is the amount available for fixed workshop expenses and business profit after the modeled order costs. This example excludes rent, insurance, machine depreciation, subscriptions, shop setup fees, extra listing renewals, currency conversion, discounts, returns, and other advertising. Add the items that apply to your shop.", "A remake can consume another blank, another shipping label, and more labor while generating no new revenue. Track actual remake costs over several batches and allocate a reserve per order. Use packed weight and destination quotes for shipping; a single sample postage assumption should not become a promise to ship anywhere at that price."], bullets: ["Quote each personalization tier separately if artwork effort differs.", "Recalculate the contribution after a coupon or bundle discount.", "Set a revision limit and approval deadline in the offer.", "Reconcile the estimate against the order’s actual payment statement."] },
      { id: "test-price", title: "Test willingness to pay, not just your spreadsheet", paragraphs: ["A cost-based price tells you what a sale leaves behind. It does not prove customers will pay that price. Offer one clear design to a specific buyer group and record paid orders, production time, remakes, and delivery costs. Avoid reading views or favorites as purchases.", "Use the tumbler calculator for the initial material and production model, then subtract the channel, labor, and fulfillment costs above where they are not already included. Compare offers on contribution per hands-on hour as well as per item. A higher-priced custom order can earn less per hour when revisions consume the afternoon."] },
    ],
    sources: [{ id: "fees", title: "Etsy — Fees & Payments Policy", url: "https://www.etsy.com/legal/fees/" }, { id: "payments", title: "Etsy Help — Payment processing fees by country", url: "https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy" }],
    faq: [{ question: "Is free shipping actually free for the seller?", answer: "No. The carrier still charges you. Include postage in the cost model even if the buyer sees no separate shipping charge." }, { question: "Is a $32 selling price a recommended market price?", answer: "No. It is an illustrative input. Validate the price with your own buyers and replace every assumed cost with actual records." }],
    tool: { href: "/calculator/tumbler-profit", label: "Start a tumbler cost model" },
  },
  {
    slug: "how-to-price-3d-prints", publishedDate: "2026-09-23", reviewedDate: "2026-09-23", title: "How to Price 3D Prints: A U.S. Seller’s Cost Model", category: "3D PRINTING",
    description: "Price 3D prints beyond filament: a USD worked example including machine wear, electricity, failed prints, labor, fees, and target contribution.",
    image: "/images/opportunities/3d-desk-organizer.webp",
    answer: "Price a 3D print from its cost per successful unit, then allow for sales fees and your target contribution. Our example costs about $11.99 before channel fees and needs a $20.50 rounded-up price for a 30% contribution margin with an assumed 10% plus $0.30 fee. Filament alone costs $2.64 and misses most of the order economics.",
    sections: [
      { id: "production", title: "Calculate the cost of one print attempt", paragraphs: ["Start with sliced material weight and runtime, then replace those estimates with measurements from completed jobs. Prusa’s calculator separates filament, electricity, labor, machine upkeep, and other costs; the same categories are useful for a small commercial quote.", "Here we assume 120 grams of filament at $22 per kilogram and a six-hour print. We assign $0.25 per machine hour for wear and upkeep. Electricity uses an assumed average draw of 120 watts and an assumed $0.18 per kWh. Neither the electricity price nor the wear rate is a U.S. average: use your bill, measurements, and replacement budget."], table: { headers: ["Production input", "Calculation", "USD / attempt"], rows: [["Filament", "0.12 kg × $22", "$2.64"], ["Machine wear", "6 hours × $0.25", "$1.50"], ["Electricity", "0.12 kW × 6 hours × $0.18", "$0.13"], ["Attempt subtotal", "Before failures and hands-on labor", "$4.27"]] }, sources: ["prusa"] },
      { id: "failure", title: "Convert attempts into successful units", paragraphs: ["If 10% of attempts fail and each failure consumes a full attempt’s production cost, the success rate is 90%. Divide the unrounded $4.2696 attempt cost by 0.90: expected production cost is $4.744 per successful unit. Multiplying by 1.10 would understate the repeated attempts needed.", "This is deliberately a simple loss model. Early failures may use less material and energy; cleanup may add more labor. Track actual failed material, occupied machine time, and recovery work. Add 15 minutes of hands-on labor at $24 per hour ($6) and $1.25 packaging per successful item. The modeled unit cost becomes $11.994, or about $11.99 before channel fees. It excludes shipping, design work, fixed overhead, and taxes."] },
      { id: "price", title: "Solve for a price that leaves a contribution", paragraphs: ["For an assumed sales channel charging 10% of revenue plus $0.30 per order, and a target contribution margin of 30%, use: price = (unit cost + fixed order fee) ÷ (1 − percentage fee − target margin). These are hypothetical channel fees, not Etsy’s fee schedule.", "With unrounded inputs, ($11.994 + $0.30) ÷ (1 − 0.10 − 0.30) = $20.49. Rounding up to the next $0.10 gives $20.50. At that price, the model leaves about $6.16 per order before fixed expenses and income taxes. The denominator must be positive; a fee percentage and target margin adding to 100% cannot produce a finite price.", "A 30% markup is different: multiplying cost by 1.30 does not produce a 30% margin, especially after fees. If you pay for shipping, add it to unit cost first. If design work is bespoke, price it separately or allocate its paid time to the actual number of units ordered."] },
      { id: "capacity", title: "Check machine hours and hands-on hours separately", paragraphs: ["A six-hour print does not necessarily require six hours of paid labor. It does occupy a machine for six hours, and that capacity limits how many orders you can promise. Measure setup, support removal, finishing, quality checks, packing, and buyer communication as hands-on work.", "Batch printing can reduce setup time, but a failed plate can affect multiple units. Validate the batch process before assuming every print-bed position is saleable capacity. Leave room for maintenance and reprints when setting delivery dates; theoretical round-the-clock output is not a production commitment."] },
      { id: "offer", title: "Validate the design, sales channel, and offer", paragraphs: ["Before quoting, check that you can commercially use the model and that the item meets the chosen marketplace’s rules. Those are separate questions. Etsy’s creativity standards say items produced with computerized tools such as 3D printers must be based on the seller’s original design; a downloaded model’s commercial license alone does not establish that requirement.", "Choose one use case, make a sample, and quote a small paid batch. Record willingness to pay alongside actual cost per good unit. Use the ROI calculator for initial production economics, then add this guide’s failure, labor, channel, and fulfillment adjustments where the tool does not already include them. Compare the resulting contribution with the hours and cash the order ties up."], sources: ["etsy"] },
    ],
    sources: [{ id: "prusa", title: "Prusa Research — 3D printing price calculator", url: "https://blog.prusa3d.com/3d-printing-price-calculator_38905/" }, { id: "etsy", title: "Etsy — Creativity Standards", url: "https://www.etsy.com/legal/creativity/" }],
    faq: [{ question: "Can I price a print using filament cost times three?", answer: "That shortcut does not account for runtime, labor, failures, fulfillment, or selling fees. Build a cost per successful unit and test the resulting offer with buyers." }, { question: "Does this $20.50 example include shipping?", answer: "No. Add the shipping cost you pay before solving for price, and check which fee bases include any shipping charged to the buyer." }],
    tool: { href: "/calculator/laser-roi?product=3d-desk-organizers", label: "Model a 3D printing product" },
  },
  {
    slug: "how-to-price-acrylic-wedding-signs", publishedDate: "2026-09-29", reviewedDate: "2026-09-29", title: "How to Price Acrylic Wedding Signs on Etsy (U.S.)", category: "WEDDING SIGNS",
    description: "Price acrylic wedding signs for U.S. Etsy orders with a $59.99 cost audit, a $95 target-price model, current Etsy fees, labor, packaging, and ad scenarios.",
    image: "/images/opportunities/acrylic-wedding-sign.webp",
    answer: "A $59.99 acrylic wedding sign can lose about $2.69 before shipping when the modeled material, labor, packaging, and Etsy fees are included. Under the same assumptions, a price near $95 leaves about $28.91, or a 30.4% contribution margin, before shipping, fixed overhead, Offsite Ads, and income taxes. These are planning inputs, not a market-price claim.",
    sections: [
      { id: "cost-stack", title: "Audit the full cost of one personalized sign", paragraphs: ["Start with the current Maker Radar planning inputs: a $59.99 selling price and $32.39 of material. They are an opportunity-model snapshot, not a supplier quote or observed Etsy average. Replace the acrylic, paint or vinyl, masking, hardware, and damaged-stock allowance with your landed costs before publishing a price.", "Assume 45 minutes of hands-on work at $24 per hour ($18) for artwork checks, layout, production setup, cleanup, buyer messages, and packing. Add $6 for protective packaging. Shipping is excluded because packed dimensions, destination, insurance, and carrier service can change the quote materially."], bullets: ["Measure hands-on work separately from unattended machine time.", "Record proofs, revisions, remakes, and rush handling against the order that caused them.", "Quote shipping from the packed sign, not the bare acrylic dimensions."] },
      { id: "etsy-fees", title: "Apply Etsy fees to the correct bases", paragraphs: ["Etsy currently lists a $0.20 listing fee and a 6.5% transaction fee. The transaction fee applies to the order total, including shipping and gift wrapping charged to the buyer. For a U.S. bank account, Etsy Payments processing is 3% plus $0.25, and its base includes shipping and applicable sales tax.", "For the worked example, there is no separate shipping or gift-wrap charge and the buyer pays an illustrative 8% sales tax. That is not a nationwide rate. On a $59.99 item, the transaction fee is about $3.90. Payment processing on $64.79, including $4.80 of sales tax, is about $2.19."], sources: ["fees", "payments"] },
      { id: "audit", title: "Why the $59.99 example is below cost", paragraphs: ["The complete order model below leaves approximately negative $2.69 before seller-paid shipping, fixed overhead, advertising, returns, and income taxes. The $27.60 obtained by subtracting $32.39 of material from $59.99 is a material spread, not order profit."], table: { headers: ["Order item", "Calculation", "USD"], rows: [["Seller revenue", "Item price", "$59.99"], ["Material", "Planning input", "−$32.39"], ["Hands-on labor", "45 minutes × $24/hour", "−$18.00"], ["Protective packaging", "Assumed", "−$6.00"], ["Listing fee", "One listing", "−$0.20"], ["Transaction fee", "$59.99 × 6.5%", "−$3.90"], ["Payment processing", "$64.79 × 3% + $0.25", "−$2.19"], ["Contribution", "Before shipping and fixed costs", "−$2.69"]] } },
      { id: "target-price", title: "Solve for a 30% contribution margin", paragraphs: ["Use price = fixed variable costs ÷ (1 − percentage fees − target margin). Here, fixed variable costs are $32.39 material + $18 labor + $6 packaging + $0.20 listing + $0.25 fixed processing, or $56.84. Percentage fees are 6.5% plus 3% payment processing applied to price plus the illustrative 8% sales tax, or 9.74% of the item price.", "$56.84 ÷ (1 − 0.0974 − 0.30) = $94.32, so this model rounds the working price to $95. At $95, the transaction fee is about $6.18 and payment processing is about $3.33. The order leaves about $28.91, a 30.4% contribution margin, before shipping, fixed overhead, advertising, returns, and income taxes. Add any seller-paid shipping to cost before solving the formula again."], sources: ["sba"] },
      { id: "offsite-ads", title: "Stress-test Offsite Ads and monthly break-even", paragraphs: ["Etsy says an attributed Offsite Ads order may incur a 15% fee for shops below the policy threshold or 12% for shops that meet it, subject to its current participation rules. On a $95 order, those fees are $14.25 or $11.40. The modeled contribution falls from $28.91 to about $14.66 or $17.51 before shipping and fixed overhead.", "With no attributed Offsite Ads fee and an illustrative $250 of monthly fixed costs, nine whole orders cover the monthly amount because $250 ÷ $28.91 = 8.65. That does not repay setup spending or prove nine orders will arrive; it only converts the cost assumptions into an operating threshold."], sources: ["fees", "sba"] },
      { id: "offer", title: "Protect the wedding deadline in the offer", paragraphs: ["A wedding sign has a fixed event date and customized content, so the offer needs more than dimensions and color. State how many digital proofs are included, the buyer’s approval deadline, the production lead time after approval, the rush fee, and what happens when submitted names or dates are wrong. Confirm how the sign will stand, hang, or fit the venue before production.", "Test one format with one buyer segment such as planners, venues, or couples. Quote a small paid batch or one paid event order, then compare estimated and actual hands-on time, packing, remakes, and carrier charges. Record paid orders as demand evidence; views and favorites do not validate the price."] },
    ],
    sources: [
      { id: "fees", title: "Etsy Help — Fees and taxes for selling on Etsy", url: "https://help.etsy.com/hc/en-us/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy" },
      { id: "payments", title: "Etsy Help — Payment processing fees by country", url: "https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy" },
      { id: "sba", title: "U.S. Small Business Administration — Break-even point", url: "https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point" },
    ],
    faq: [{ question: "Is $95 the market price for an acrylic wedding sign?", answer: "No. It is the price produced by this article’s cost and margin assumptions. Compare it with actual buyer responses and replace every assumed cost with your records." }, { question: "Does the $95 example include shipping?", answer: "No. Measure the packed sign, obtain a destination-specific carrier quote, and add seller-paid shipping before solving the price again." }, { question: "Should I include free revisions?", answer: "Include a defined number of proofs or revisions in the priced labor allowance. Charge separately or re-quote when buyer changes exceed that scope." }],
    tool: { href: "/calculator/laser-roi?product=acrylic-wedding-signs", label: "Model an acrylic sign offer" },
  },
  {
    slug: "how-to-price-custom-leather-patches", publishedDate: "2026-10-13", reviewedDate: "2026-10-13", title: "How to Price Custom Leather Patches for Hats (U.S.)", category: "LEATHER PATCHES",
    description: "Price custom laser-engraved leather patches with a 12-piece U.S. batch example covering yield loss, setup labor, per-piece work, packaging, and fees.",
    image: "/images/project-library/product-leather-patch-cap.webp",
    answer: "Price custom leather patches as a batch, because artwork setup and fixture work do not disappear on a one-piece order. In this illustrative 12-patch model, an $11 unit price leaves about $6.32 per patch, or $75.82 for the batch, before shipping, fixed overhead, taxes, and attaching patches to hats. The same $11 price loses about $2.46 on a one-piece order under the stated assumptions, which is why a minimum quantity or separate setup fee matters.",
    sections: [
      { id: "offer", title: "Define whether you are selling patches or finished hats", paragraphs: ["This guide models loose, laser-engraved patches sold in a 12-piece batch to a hat maker, apparel decorator, local brand, club, or event seller. It does not include blank hats, sewing or heat-press application, fulfillment to individual consumers, or shipping. Quote those as separate operations when you provide them.", "Start with one material, shape, size range, backing method, artwork rule, and minimum quantity. A low per-piece price can work for a repeatable batch while failing on a single custom sample. State how many artwork revisions are included and whether a new logo, size, or color resets the setup charge."] },
      { id: "material", title: "Confirm the exact material before it enters the laser", paragraphs: ["A supplier listing may identify a sheet as laser engravable, but the unit cost still depends on sheet price, usable area, nesting, damaged edges, and the number of acceptable patches produced. Johnson Plastics Plus, for example, lists its Saddle Collection faux-leather sheet as 12 by 24 inches, about 0.046 inch thick, laser engravable, and sold without applied adhesive. Use the current product specification and your measured layout rather than assuming every leather-like sheet behaves the same.", "Do not process an unknown vinyl-like or faux-leather material. The University of Illinois laser-cutter safety guidance identifies PVC or vinyl as capable of emitting chlorine gas and damaging equipment. Siser likewise says PVC materials must not be laser cut and recommends test cuts, ventilation, and suitable fire-safety equipment for materials it identifies as laser friendly. Obtain the supplier's current safety data and machine guidance before production."], sources: ["jpplus", "illinois", "siser"] },
      { id: "batch-cost", title: "Build the cost of one acceptable patch", paragraphs: ["The current Maker Radar planning snapshot uses $11 as the selling price and $1.90 as material cost for one patch. Those are planning inputs, not observed market prices or supplier quotes. This example adds $0.30 for adhesive or backing and $0.20 for machine wear and consumables, producing a $2.40 attempt cost.", "Assume 5% of attempts are rejected and consume the full attempt cost. Divide $2.40 by a 95% success rate to get $2.53 per acceptable patch. Add two minutes of hands-on work per patch at an assumed $24 hourly rate, 20 minutes of batch artwork and setup allocated across 12 patches, $4 of batch packaging, and a hypothetical payment charge of 3% plus $0.30 on the $132 order."], table: { headers: ["Batch item", "Calculation", "USD / patch"], rows: [["Acceptable-patch production", "$2.40 ÷ 95% yield", "$2.53"], ["Per-piece hands-on labor", "2 minutes × $24/hour", "$0.80"], ["Batch artwork and setup", "20 minutes × $24/hour ÷ 12", "$0.67"], ["Batch packaging", "$4.00 ÷ 12", "$0.33"], ["Assumed payment charge", "($132 × 3% + $0.30) ÷ 12", "$0.36"], ["Contribution per patch", "$11.00 − modeled order costs", "$6.32"], ["Contribution per 12-piece batch", "$6.3187 × 12", "$75.82"]] } },
      { id: "minimum", title: "Use a minimum order or a visible setup fee", paragraphs: ["On a one-piece order at $11, the full $8 batch setup, $1.50 single-order packaging, and an assumed $0.63 payment charge no longer spread across 12 units. With the same acceptable-patch production and per-piece labor, modeled cost becomes about $13.46, so the order loses about $2.46 before shipping and fixed overhead.", "Under these assumptions, a one-piece order needs about $19.60 to leave a 30% contribution margin: ($2.526 production + $0.80 per-piece labor + $8 setup + $1.50 packaging + $0.30 fixed payment charge) ÷ (1 − 3% payment rate − 30% target margin). This is not a recommended market price. Use it to choose among a higher sample price, a separate setup fee, or a batch minimum, then validate the offer with paid buyers."], bullets: ["Keep artwork setup separate from per-piece production time.", "Recalculate whenever size, material, backing, or artwork changes.", "Record rejected patches and remake labor against the batch that caused them.", "Compare contribution per hands-on hour as well as contribution per patch."] },
      { id: "channel", title: "Check channel rules and logo rights before accepting the order", paragraphs: ["If you sell patches on Etsy, its current policy lists a $0.20 listing fee and a 6.5% transaction fee, while payment processing varies by bank location. Replace the hypothetical fee above with the fees that apply to the actual order. Etsy's creativity standards also require qualifying seller-made or seller-designed work and say the first image for a personalized item must show a finished customized item rather than placeholder text.", "A buyer-supplied logo can function as a trademark. The U.S. Patent and Trademark Office explains that trademarks identify the source of goods or services and can include words, symbols, or designs. Do not treat possession of a logo file as permission to manufacture it. Ask the buyer to confirm authorization, keep that confirmation with the order, and decline designs whose rights are unclear.", "Run a paid 12-piece pilot for one buyer segment. Record artwork minutes, acceptable yield, production time, backing or attachment work, packaging, payment fees, and delivery cost. A paid reorder is stronger demand evidence than views, favorites, or a quote request."], sources: ["etsy-fees", "etsy-creativity", "uspto"] },
    ],
    sources: [
      { id: "jpplus", title: "Johnson Plastics Plus — Saddle Collection leather-like sheet specifications", url: "https://www.jpplus.com/saddle-collection-sheet?sku=SC071-CS" },
      { id: "illinois", title: "University of Illinois Division of Research Safety — Laser cutters: safe use", url: "https://www.drs.illinois.edu/Page/SafetyLibrary/LaserCutters" },
      { id: "siser", title: "Siser — PVC-free laser-friendly heat transfer materials and safety guidance", url: "https://www.siser.com/laser-friendly/" },
      { id: "etsy-fees", title: "Etsy — Fees & Payments Policy", url: "https://www.etsy.com/legal/fees/" },
      { id: "etsy-creativity", title: "Etsy — Creativity Standards", url: "https://www.etsy.com/legal/creativity/" },
      { id: "uspto", title: "U.S. Patent and Trademark Office — What is a trademark?", url: "https://www.uspto.gov/trademarks/basics/what-trademark" },
    ],
    faq: [{ question: "Should I charge a setup fee for custom leather patches?", answer: "Charge enough to cover artwork checks, test engraving, fixture setup, and buyer approval. You can show that amount as a separate setup fee or recover it through a minimum quantity, but do not hide it by treating setup time as free." }, { question: "Is $11 the market price for a custom leather patch?", answer: "No. It is the current Maker Radar planning input used for this worked example. Validate your price with paid buyers and replace every assumed cost with actual records." }, { question: "Does this model include attaching the patch to a hat?", answer: "No. It models loose patches. Add the hat blank, positioning, press or sewing time, attachment consumables, rejected hats, and finished-product packaging when you sell completed caps." }],
    tool: { href: "/calculator/laser-roi?product=laser-leather-patches", label: "Model a leather patch batch" },
  },
  {
  "slug": "how-to-price-personalized-tote-bags",
  "publishedDate": "2026-10-20",
  "reviewedDate": "2026-10-20",
  "title": "How to Price Personalized Tote Bags (U.S.)",
  "description": "Price a ten-bag heat-transfer order with an original USD example covering materials, waste, labor, setup, fees, and a minimum-order decision.",
  "answer": "Quote personalized totes by batch, including setup and failed materials. In this hypothetical ten-bag local-pickup order, $24 per bag leaves about $10.44 contribution after modeled materials, labor, setup, packaging, equipment, and payment costs. A single bag at the same price loses about $1.53. These are planning calculations, not market prices or earnings.",
  "category": "TOTE BAG PRICING",
  "image": "/images/heat-press-tote.png",
  "sections": [
    {
      "id": "offer",
      "title": "Quote one repeatable tote order",
      "paragraphs": [
        "This guide is for a small U.S. maker quoting ten personalized cotton totes for one local event, with one design, one print location, and local pickup. It models heat-transfer decoration, not embroidery, screen-printing equipment, or print-on-demand fulfillment. Extra names, a second side, rush delivery, and shipping require separate cost inputs.",
        "The October 19, 2026 Maker Radar uses a $24 selling price and $7.80 materials allowance. Those are planning inputs, not observed market prices or a supplier quote. Ask for a landed quote covering the blank, transfer, inbound freight, and applicable purchase taxes. Confirm whether ten bags share one artwork file or each needs individual preparation before promising a bulk discount."
      ]
    },
    {
      "id": "process",
      "title": "Test the fabric, transfer, and pressure together",
      "paragraphs": [
        "Siser’s current application sheet lists fabric compatibility and different settings for each transfer material. It recommends testing before production because fabrics vary. Choose the exact transfer and blank first, then follow their current instructions and care requirements. A press cycle is only one part of labor: artwork checks, cutting or ordering transfers, weeding where needed, alignment, inspection, and packing also take time.",
        "Transfer Express explains that tote straps can prevent even pressure across the print area. Check the actual bag geometry and use the press or transfer supplier’s compatible support method. Test a spare blank before a paid batch, then perform the care test specified for that material. Do not reuse cotton settings on an unidentified coated or synthetic bag. Record the blank SKU, transfer type, print size, settings, and result so a reorder is reproducible."
      ],
      "sources": [
        "siser",
        "transfer"
      ]
    },
    {
      "id": "cost",
      "title": "Build a ten-bag cost model in USD",
      "paragraphs": [
        "Assume 5% of attempts consume the full $7.80 material allowance and fail inspection. Materials per accepted tote are $7.80 ÷ 0.95 = $8.2105. This is a planning allowance across repeated production, not permission to order a fractional blank. Buy enough whole spare blanks for your test and delivery plan, and track the actual rejected quantity. If failures also consume extra labor, add it; the six-minute labor allowance here is assumed to cover all production attempts per accepted tote.",
        "Also assume six hands-on minutes per accepted bag at $24/hour, thirty minutes of setup for the whole batch, $6 total packaging, and $0.40 per accepted bag for equipment wear and consumables. The payment example is a hypothetical 3% plus $0.30 per $240 order, not an official processor rate. No sales tax, shipping charge, marketplace fee, advertising, or refund occurs in this simplified transaction. Replace those assumptions with the actual checkout and delivery costs.",
        "The $104.39 batch contribution is money remaining after the modeled order costs. It is not net profit or owner take-home pay. Rent, subscriptions, insurance, fixed overhead, financing, income taxes, additional remakes, and unpaid test samples still need coverage. The model includes paid labor but does not demonstrate buyer demand or any real seller’s earnings."
      ],
      "table": {
        "headers": [
          "Batch item",
          "Calculation",
          "USD per accepted tote"
        ],
        "rows": [
          [
            "Saleable materials",
            "$7.80 ÷ 95% yield",
            "$8.21"
          ],
          [
            "Per-bag labor",
            "6 minutes × $24/hour",
            "$2.40"
          ],
          [
            "Batch setup",
            "30 minutes × $24/hour ÷ 10",
            "$1.20"
          ],
          [
            "Packing",
            "$6.00 per batch ÷ 10",
            "$0.60"
          ],
          [
            "Equipment and consumables",
            "Assumed per accepted bag",
            "$0.40"
          ],
          [
            "Hypothetical payment fee",
            "($240 × 3% + $0.30) ÷ 10",
            "$0.75"
          ],
          [
            "Contribution per bag",
            "$24.00 − modeled order costs",
            "$10.44"
          ],
          [
            "Ten-bag contribution",
            "Unrounded unit result × 10",
            "$104.39"
          ]
        ]
      }
    },
    {
      "id": "minimum",
      "title": "Decide between a minimum quantity and a setup fee",
      "paragraphs": [
        "For one bag at the same $24 price, assume the same $8.2105 materials, $2.40 labor, $0.40 equipment allowance, the full $12 setup, $1.50 single-order packaging, and $1.02 hypothetical payment fee. That leaves a loss of about $1.53 before fixed overhead. A ten-piece price cannot automatically become a one-piece price. Charge for setup, use a minimum order, or offer a higher sample price.",
        "For ten bags, a hypothetical 30% contribution target yields a planning price floor of $19.17 per bag (rounded up to the next cent): ($8.2105 + $2.40 + $1.20 + $0.60 + $0.40 + $0.03 fixed payment allocation) ÷ (1 − 3% payment fee − 30% target). This is a mathematical floor under these assumptions, not a recommended market price. Increasing waste, individual names, shipping, or platform fees raises it. A lower transfer purchase price may be offset by more artwork or weeding time."
      ]
    },
    {
      "id": "validation",
      "title": "Validate one paid event order before adding equipment",
      "paragraphs": [
        "Offer one buyer segment a defined ten-bag package with written artwork approval, print area, due date, pickup arrangement, and price. Confirm that the customer may use the artwork. Keep the approved sample and order record. Quote a second print location or each additional personalization as extra work rather than assuming the original setup covers it.",
        "After delivery, compare estimated and actual material use, acceptable quantity, hands-on time, fees, and contribution. Track paid reorders separately from page visits, quote requests, or favorites. Use the calculator as a first equipment and capacity scenario, then add the batch setup, payment, shipping, and overhead items described here to your order ledger. Invest in more capacity only when measured production constraints and paid orders justify it."
      ]
    }
  ],
  "sources": [
    {
      "id": "siser",
      "title": "Siser North America — HTV application instructions (revision September 17, 2025)",
      "url": "https://www.siserna.com/files/heat-transfer-vinyl-instructions.pdf"
    },
    {
      "id": "transfer",
      "title": "Transfer Express — Heat printing on canvas tote bags",
      "url": "https://blog.transferexpress.com/heat-printing-on-canvas-tote-bags/"
    }
  ],
  "faq": [
    {
      "question": "Is $24 the market price for a personalized tote?",
      "answer": "No. It is the Maker Radar planning input used for this example. Validate the offer with paid buyers and obtain actual landed material quotes."
    },
    {
      "question": "Do ten seconds in the press mean ten seconds of labor?",
      "answer": "No. Include artwork preparation, transfer preparation, alignment, inspection, packing, and any remakes. Measure hands-on time for the whole batch."
    },
    {
      "question": "Can I use this contribution as net profit?",
      "answer": "No. Fixed overhead, financing, income taxes, refunds, and costs excluded from the order model still reduce the amount available to the business."
    }
  ],
  "tool": {
    "href": "/calculator/laser-roi?product=heat-press-tote-bags",
    "label": "Model a tote bag batch"
  }
},
];

export function guidePath(slug: string) { return `/learn/${slug}/`; }
export function guideStructuredData(guide: MakerGuide, base: string, language: "en-US" | "zh-CN" = "en-US") {
  const url = `${base}${guidePath(guide.slug)}`;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", "@id": `${url}#article`, headline: guide.title, description: guide.description, abstract: guide.answer, mainEntityOfPage: url, url, inLanguage: language, datePublished: guide.publishedDate, dateModified: guide.reviewedDate, image: `${base}${guide.image}`, author: { "@type": "Organization", "@id": `${base}/#organization`, name: "Maker Business Lab", url: `${base}/about/` }, publisher: { "@id": `${base}/#organization` }, citation: guide.sources.map(source => source.url) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: language === "zh-CN" ? "首页" : "Home", item: `${base}/` }, { "@type": "ListItem", position: 2, name: language === "zh-CN" ? "学习" : "Learn", item: `${base}/learn/` }, { "@type": "ListItem", position: 3, name: guide.title, item: url }] },
  ] };
}
