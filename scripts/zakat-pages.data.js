/* Content for the /zakat-calculator/ landing pages.
 *
 * This is the only file to edit when page copy changes. Run
 * `node scripts/build-zakat-pages.js` afterwards to regenerate the HTML.
 *
 * Plain text only — no HTML entities. The generator escapes for HTML and
 * JSON.stringify escapes for JSON-LD. Typographic characters (’ — “ ”) are
 * written as real Unicode; every page declares UTF-8.
 *
 * FIQH DATA IS GROUND TRUTH SUPPLIED BY THE PRODUCT OWNER. Do not re-derive
 * or "correct" the madhhab table below without asking.
 */

/* Nisab figures below are pre-rendered fallbacks so the page is never blank
 * before JavaScript runs. assets/zakat-landing.js replaces them with live
 * spot values when the price feed answers. Derived from the app's own
 * fallback constants (gold 561.42 AED/g, silver 8.75 AED/g) at 30 Aug 2026.
 * Non-pegged FX rates are approximations — see the build report. */

const RATE_NOTE =
  'Zakat is 2.5% of qualifying wealth held for one lunar (Hijri) year. If you anchor your Zakat year to a Gregorian date instead, the rate rises to 2.577% because a solar year runs about eleven days longer, which keeps your lifetime obligation whole.';

const NOT_FATWA =
  'BarakahFlow states scholarly positions and attributes them. It does not issue fatwa. For a binding ruling on your own circumstances, speak to a qualified scholar.';

const madhhabPages = [
  {
    slug: 'aaoifi',
    kind: 'madhhab',
    label: 'AAOIFI Standard',
    navLabel: 'AAOIFI standard',
    currency: 'USD',
    title: 'AAOIFI Zakat Calculator — The Contemporary Standard Explained',
    description:
      'Calculate Zakat on the AAOIFI standard: the lower of the gold or silver threshold, worn jewellery exempt, short-term debts deducted, nisab checked at both ends of the year.',
    keywords:
      'aaoifi zakat calculator, aaoifi nisab, contemporary zakat standard, islamic finance zakat, zakat 2.5 percent',
    h1: 'Zakat on the AAOIFI standard',
    lede:
      'AAOIFI is the standards body most Islamic banks and finance houses follow, and its Zakah standard is BarakahFlow’s default. It is not a fifth school. It is a contemporary synthesis that picks, from the classical positions, the ones most workable for people whose wealth sits in bank accounts and funds rather than livestock and crops.',
    nisabBasis: 'lower',
    nisabNote:
      'AAOIFI takes the lower of the two thresholds, which in practice means silver. A lower threshold means more people cross it and become liable, which is the cautious position on an obligation.',
    conventionKey: 'AAOIFI',
    rules: [
      { k: 'Nisab basis', v: 'The lower of the gold or silver threshold — silver, in practice' },
      { k: 'Worn jewellery', v: 'Exempt' },
      { k: 'Debt deduction', v: 'Short-term and near-term debts deducted' },
      { k: 'Nisab timing', v: 'Checked at the start and the end of the year' },
    ],
    body: [
      {
        h: 'Why the lower threshold, and why it matters',
        p: [
          'Gold and silver were roughly interchangeable as thresholds in the Prophet’s ﷺ time. They are not now. Silver has fallen so far against gold that the two thresholds differ by roughly nine to one, and which one you use decides whether many ordinary savers owe anything at all.',
          'AAOIFI resolves this by taking the lower figure. The reasoning is that Zakat is a right of the poor, and where two defensible thresholds exist, the one that brings more wealth into the obligation is the safer side of the dispute. Most large charity bodies reach the same conclusion independently.',
        ],
      },
      {
        h: 'What AAOIFI does with debt',
        p: [
          'Debts falling due within the coming year are deducted from your wealth before the 2.5% is applied. Debts that stretch far beyond that — most obviously a mortgage — are not deducted wholesale.',
          'This is the middle position. Deducting nothing ignores that a debt due next month is not really your wealth. Deducting an entire mortgage balance would wipe out the Zakat of almost every homeowner, which no school permits and which AAOIFI explicitly rejects.',
        ],
      },
      {
        h: 'Checking the threshold at both ends',
        p: [
          'AAOIFI requires your wealth to be above nisab when your Zakat year opens and again when it closes. What happens in between does not break the year.',
          'This is the Hanafi position on timing rather than the majority one, and it is the practical choice: someone paid monthly will dip below the threshold most months, and a rule requiring continuous possession would excuse almost everyone.',
        ],
      },
    ],
    example: {
      title: 'A worked example on the AAOIFI standard',
      currency: 'USD',
      rows: [
        { k: 'Cash across current and savings accounts', v: '$6,000' },
        { k: 'Shares and funds at market value', v: '$4,000' },
        { k: 'Gold jewellery worn regularly, 25g', v: 'Exempt' },
        { k: 'Less: credit card and bills due within the year', v: '− $1,500' },
        { k: 'Zakatable base', v: '$8,500', total: true },
        { k: 'Zakat due at 2.5%', v: '$213', total: true, final: true },
      ],
      note:
        'The threshold here is the silver figure, around $1,418, so this person is comfortably liable. Had the gold threshold of roughly $12,994 been used instead, the same person would owe nothing at all. That single choice is the difference between a Zakat bill and none, which is why BarakahFlow asks rather than assumes.',
    },
    faqs: [
      {
        q: 'Is AAOIFI a fifth school of thought?',
        a: [
          'No. AAOIFI is the Accounting and Auditing Organisation for Islamic Financial Institutions, a standards body based in Bahrain whose Sharia board is drawn from scholars across the four Sunni schools.',
          'Its Zakah standard does not invent rulings. It selects among existing classical positions and states which one it has taken and why, so that banks and funds in different countries produce comparable numbers. Following it is following classical fiqh, filtered through a contemporary committee.',
        ],
      },
      {
        q: 'Why does BarakahFlow default to AAOIFI rather than my own madhhab?',
        a: [
          'Because a default has to be something, and AAOIFI is the position with the broadest cross-school acceptance among people whose wealth is in modern financial instruments.',
          'It is only a starting point. Every contested question is a switch you can move, and if you tell the app you follow the Hanafi, Maliki, Shafi’i or Hanbali school it will apply that school’s positions instead.',
        ],
      },
      {
        q: 'Does the AAOIFI standard exempt gold jewellery I wear?',
        a: [
          'Yes. AAOIFI follows the majority of the schools in exempting jewellery that is genuinely in personal use, on the reasoning that it is a possession in service rather than wealth being stored.',
          'The Hanafi school disagrees and counts it whether worn or not. If you follow the Hanafi position, switch to it in the app and the same holdings will produce a different and higher figure.',
        ],
      },
      {
        q: 'Can I deduct my mortgage under AAOIFI?',
        a: [
          'Not the balance, no. Only the portion of principal actually falling due within your Zakat year can reduce your base, and BarakahFlow defaults to deducting nothing from a mortgage at all as the safest position.',
          'You can change that to one month or twelve lunar months of principal. The interest element of any repayment is never deductible under any setting.',
        ],
      },
      {
        q: 'What rate does AAOIFI apply?',
        a: [RATE_NOTE],
      },
    ],
    related: ['gulf', 'uk-europe', 'north-america-australia'],
  },

  {
    slug: 'hanafi',
    kind: 'madhhab',
    label: 'Hanafi',
    navLabel: 'Hanafi',
    currency: 'USD',
    title: 'Hanafi Zakat Calculator — Silver Nisab and Jewellery Included',
    description:
      'Zakat the Hanafi way: the silver threshold of 595g, gold jewellery counted whether you wear it or not, near-term debts deducted, and the year judged at its two ends.',
    keywords:
      'hanafi zakat calculator, hanafi nisab, silver nisab 595g, zakat on gold jewellery hanafi, deobandi zakat calculator',
    h1: 'Zakat according to the Hanafi school',
    lede:
      'The Hanafi school produces a higher Zakat bill than the other three, for two reasons that compound: it sets the threshold by silver rather than gold, and it counts the gold you wear. If you follow the Hanafi school and your calculator has not asked you about your jewellery, it has given you the wrong number.',
    nisabBasis: 'silver',
    nisabNote:
      'The Hanafi school sets the threshold by silver, 595 grams of it. That is a far lower bar than the gold figure, so many people who owe nothing on a gold threshold are liable on this one.',
    conventionKey: 'AAOIFI',
    rules: [
      { k: 'Nisab basis', v: 'Silver, 595 grams' },
      { k: 'Worn jewellery', v: 'Counted, whether worn or not' },
      { k: 'Debt deduction', v: 'Near-term debts deducted' },
      { k: 'Nisab timing', v: 'Checked at the start and the end of the year' },
    ],
    body: [
      {
        h: 'The jewellery question, which is the one that matters',
        p: [
          'This is the single largest practical difference between the Hanafi school and the other three. Imam Abu Hanifa held that gold and silver are zakatable by their nature as wealth, not by the use their owner puts them to. A bracelet is gold. That it is on a wrist does not stop it being gold.',
          'The majority — Maliki, Shafi’i and Hanbali — hold the opposite: jewellery in genuine personal use is exempt, in the same way that a house you live in is exempt.',
          'For a family with a normal amount of gold in the household, this is not a rounding difference. It routinely doubles the bill. BarakahFlow tracks gold at 24, 22, 21 and 18 karat and lets you record how much of each you actually wear, which is exactly what makes the two positions produce different answers from the same drawer.',
        ],
      },
      {
        h: 'Why the silver threshold',
        p: [
          'The Hanafi position is that where someone holds a mixture of assets — some cash, some gold, some silver — the lower of the two thresholds applies. In today’s prices that is always silver.',
          'The practical effect is a threshold in the region of a thousand US dollars rather than thirteen thousand. Far more people are liable, and that is the intended result rather than a side effect.',
        ],
      },
      {
        h: 'How the Hanafi year is judged',
        p: [
          'Your wealth must be above the threshold on the day your Zakat year opens and on the day it closes. Dips in between do not reset the clock.',
          'The majority position is stricter and requires the threshold to be held throughout. The Hanafi rule is the more forgiving of the two here, which offsets some of the severity of the silver threshold and the jewellery rule.',
        ],
      },
    ],
    example: {
      title: 'A worked example on the Hanafi method',
      currency: 'USD',
      rows: [
        { k: 'Cash and savings', v: '$8,000' },
        { k: 'Gold jewellery worn regularly, 40g at 22 karat', v: '$5,600' },
        { k: 'Less: near-term debts due within the year', v: '− $2,000' },
        { k: 'Zakatable base', v: '$11,600', total: true },
        { k: 'Zakat due at 2.5%', v: '$290', total: true, final: true },
      ],
      note:
        'The same person calculating on the Shafi’i method would exempt the jewellery entirely and deduct nothing for the debt, giving a base of $8,000 and a bill of $200. The Hanafi answer is 45% higher, and both are correct within their own school. This is the difference a calculator hides when it offers only one answer.',
    },
    faqs: [
      {
        q: 'Do I pay Zakat on gold jewellery I wear every day under the Hanafi school?',
        a: [
          'Yes. This is the settled Hanafi position and the school’s best-known divergence from the other three. Gold and silver are treated as zakatable in themselves, so ornaments in daily use are included at their gold content.',
          'Only the pure metal counts. Stones, settings and alloy are excluded, which is why BarakahFlow values each karat separately rather than weighing the whole piece as if it were 24 karat.',
        ],
      },
      {
        q: 'Which nisab do Hanafis use, gold or silver?',
        a: [
          'Silver, at 595 grams. Where a person holds a mixture of asset types the school applies the lower threshold, and silver has been the lower one for well over a century.',
          'South Asian Hanafi practice often uses the classical Tola conversion instead, which puts silver nisab at 612.36 grams. The difference is about 2.8% and BarakahFlow supports both.',
        ],
      },
      {
        q: 'What debts can I deduct on the Hanafi method?',
        a: [
          'Debts you are obliged to settle in the near term reduce your zakatable wealth. Rent, bills, credit card balances and instalments falling due within the year all qualify.',
          'A mortgage does not qualify in full. No school permits deducting an entire housing balance, and doing so would erase the obligation for most homeowners. BarakahFlow deducts nothing from a mortgage by default and lets you add one month or twelve lunar months of principal if you hold that view.',
        ],
      },
      {
        q: 'If my wealth dropped below nisab mid-year, do I still owe Zakat?',
        a: [
          'Under the Hanafi school, yes, provided you were above the threshold when your year opened and above it again when the year closed. The school judges the two ends of the year, not every day in between.',
          'This matters for anyone paid monthly, whose balance falls near the end of each month. Under the Maliki, Shafi’i and Hanbali position the same dip would break the year and nothing would be due.',
        ],
      },
      {
        q: 'Is the Hanafi rate different?',
        a: [RATE_NOTE],
      },
    ],
    related: ['south-asia', 'uk-europe', 'aaoifi'],
  },

  {
    slug: 'maliki',
    kind: 'madhhab',
    label: 'Maliki',
    navLabel: 'Maliki',
    currency: 'USD',
    title: 'Maliki Zakat Calculator — Gold Nisab and Full Debt Deduction',
    description:
      'Zakat on the Maliki method: the 85g gold threshold, worn jewellery exempt, debts deducted in full, and nisab that must be held for the whole lunar year.',
    keywords:
      'maliki zakat calculator, maliki nisab, gold nisab 85g, maliki debt deduction zakat, zakat maliki madhhab',
    h1: 'Zakat according to the Maliki school',
    lede:
      'The Maliki school is the most generous of the four on debt: what you owe comes off in full, not merely the part falling due this year. It is also among the stricter schools on timing, because the threshold has to be held for the entire year rather than checked at its two ends.',
    nisabBasis: 'gold',
    nisabNote:
      'The Maliki school sets the threshold by gold, 85 grams of it. That is a materially higher bar than the silver figure, so fewer people are liable than under the Hanafi rule.',
    conventionKey: 'AAOIFI',
    rules: [
      { k: 'Nisab basis', v: 'Gold, 85 grams' },
      { k: 'Worn jewellery', v: 'Exempt' },
      { k: 'Debt deduction', v: 'Debts deducted in full' },
      { k: 'Nisab timing', v: 'The threshold must be held for the whole year' },
    ],
    body: [
      {
        h: 'Debt deducted in full, and what that actually means',
        p: [
          'The Maliki position is that Zakat falls on wealth you genuinely own, and wealth encumbered by a debt is not fully yours. So the debt is subtracted, not merely the portion maturing inside the year.',
          'This is the widest deduction any of the four schools allows, and it is why the Maliki method often produces the lowest bill of the four for someone carrying real liabilities.',
          'It still does not license deducting a whole mortgage against a small savings balance to reach zero. BarakahFlow keeps the mortgage handling explicit and conservative by default, and asks rather than assuming, precisely because this is the setting most often abused.',
        ],
      },
      {
        h: 'Holding the threshold for the whole year',
        p: [
          'The Maliki school sits with the majority on timing: your wealth must remain at or above the threshold across the entire lunar year. If it falls below at any point the year is broken and the count restarts from the day you next cross the threshold.',
          'In practice this is harder to satisfy than it sounds. A large planned outlay part-way through the year can extinguish the obligation entirely under this rule while leaving it fully intact under the Hanafi one.',
        ],
      },
      {
        h: 'Jewellery, and where Maliki sits',
        p: [
          'Jewellery in genuine personal use is exempt, in line with the Shafi’i and Hanbali schools and against the Hanafi position. The reasoning is that an ornament in service is a used possession rather than stored wealth.',
          'Gold held as bullion, coins or investment is a different matter and is fully zakatable under every school.',
        ],
      },
    ],
    example: {
      title: 'A worked example on the Maliki method',
      currency: 'USD',
      rows: [
        { k: 'Cash and savings', v: '$30,000' },
        { k: 'Money owed to you and expected', v: '$5,000' },
        { k: 'Gold jewellery worn regularly', v: 'Exempt' },
        { k: 'Less: debts, deducted in full', v: '− $8,000' },
        { k: 'Zakatable base', v: '$27,000', total: true },
        { k: 'Zakat due at 2.5%', v: '$675', total: true, final: true },
      ],
      note:
        'The same person on the Shafi’i method deducts no debt at all, giving a base of $35,000 and a bill of $875 — two hundred dollars more from identical holdings. And under the Maliki timing rule, if this person’s wealth had fallen below the roughly $12,994 gold threshold at any point during the year, nothing would be due at all.',
    },
    faqs: [
      {
        q: 'Can I really deduct all my debts under the Maliki school?',
        a: [
          'Debts genuinely owed are deducted, and the Maliki school does not restrict this to liabilities maturing within the year as the other schools do. That is the school’s distinctive position.',
          'It is not a licence to net a thirty-year mortgage against a modest savings balance and declare nothing due. BarakahFlow defaults to deducting no mortgage principal at all and makes any wider treatment an explicit choice you make knowingly.',
        ],
      },
      {
        q: 'Which nisab does the Maliki school use?',
        a: [
          'Gold, at 85 grams, following the AAOIFI and majority weight conversion. At the time of writing that is roughly $12,994.',
          'Because the gold threshold is around nine times the silver one, a person can owe nothing under the Maliki rule and owe a substantial amount under the Hanafi rule on precisely the same wealth.',
        ],
      },
      {
        q: 'What happens if my wealth dips below nisab during the year?',
        a: [
          'The year is broken. The Maliki school, with the Shafi’i and Hanbali, requires the threshold to be maintained throughout the lunar year rather than merely at its two ends.',
          'Your count then restarts from the date you next rise above the threshold. BarakahFlow tracks this against the Hijri calendar and will tell you when a reported dip has reset your Hawl rather than silently carrying the old date forward.',
        ],
      },
      {
        q: 'Is jewellery zakatable in the Maliki school?',
        a: [
          'Not if it is in genuine personal use. The Maliki school exempts worn ornaments, agreeing with the Shafi’i and Hanbali schools and differing from the Hanafi one.',
          'Gold kept as an investment, as bullion or as coin is zakatable in full regardless of school.',
        ],
      },
    ],
    related: ['uk-europe', 'gulf', 'aaoifi'],
  },

  {
    slug: 'shafii',
    kind: 'madhhab',
    label: "Shafi'i",
    navLabel: 'Shafi’i',
    currency: 'USD',
    title: 'Shafi’i Zakat Calculator — Gold Nisab, No Debt Deduction',
    description:
      'Zakat on the Shafi’i method: the 85g gold threshold, worn jewellery exempt, no deduction for debts, and nisab held across the full lunar year.',
    keywords:
      'shafii zakat calculator, shafi i nisab, gold nisab 85g, zakat without debt deduction, shafii madhhab zakat',
    h1: 'Zakat according to the Shafi’i school',
    lede:
      'The Shafi’i school takes the strictest line of the four on debt: it does not come off at all. Zakat attaches to the wealth in your hand, and what you happen to owe someone else does not change what you are holding. For anyone carrying liabilities, this produces the highest bill of the four schools.',
    nisabBasis: 'gold',
    nisabNote:
      'The Shafi’i school sets the threshold by gold, 85 grams. Fewer people cross this bar than cross the silver one used by the Hanafi school.',
    conventionKey: 'AAOIFI',
    rules: [
      { k: 'Nisab basis', v: 'Gold, 85 grams' },
      { k: 'Worn jewellery', v: 'Exempt' },
      { k: 'Debt deduction', v: 'None' },
      { k: 'Nisab timing', v: 'The threshold must be held for the whole year' },
    ],
    body: [
      {
        h: 'Why no deduction for debt',
        p: [
          'The dominant Shafi’i position is that Zakat is a charge on wealth actually possessed. A debt is an obligation running alongside that wealth, not a reduction of it. The money is in your account on the day the year closes, so it is counted.',
          'This is the clearest of the four positions and the easiest to apply consistently, which is part of its appeal. It is also the most demanding, and someone with significant short-term liabilities will pay noticeably more here than under any other school.',
          'If that outcome sits badly with your circumstances, the answer is not to quietly borrow another school’s deduction rule while claiming to follow this one. Speak to a scholar about which position you should be following.',
        ],
      },
      {
        h: 'Holding the threshold across the year',
        p: [
          'With the Maliki and Hanbali schools, the Shafi’i school requires your wealth to remain at or above the threshold for the entire lunar year. A dip below breaks the year and the count restarts.',
          'Paired with the higher gold threshold, this means the Shafi’i method excuses more people entirely — but charges those it does capture more than the other schools would.',
        ],
      },
      {
        h: 'Jewellery and personal use',
        p: [
          'Ornaments in genuine personal use are exempt. The Shafi’i school joins the Maliki and Hanbali schools here against the Hanafi position.',
          'Some Shafi’i scholars qualify this where the quantity held goes well beyond what could reasonably be described as personal use. If that is your situation it is worth asking rather than assuming.',
        ],
      },
    ],
    example: {
      title: 'A worked example on the Shafi’i method',
      currency: 'USD',
      rows: [
        { k: 'Cash and savings', v: '$20,000' },
        { k: 'Gold jewellery worn regularly, 30g', v: 'Exempt' },
        { k: 'Credit card balance outstanding', v: 'Not deducted' },
        { k: 'Zakatable base', v: '$20,000', total: true },
        { k: 'Zakat due at 2.5%', v: '$500', total: true, final: true },
      ],
      note:
        'The same holdings on the Hanafi method would add the jewellery to the base and take the $3,000 card balance off it, giving roughly $21,204 and a bill of $530. Two schools, two defensible answers, one set of holdings. The difference is not an error in either calculation.',
    },
    faqs: [
      {
        q: 'Why can’t I deduct my debts under the Shafi’i school?',
        a: [
          'Because the dominant Shafi’i position treats Zakat as a charge on wealth in your possession at the close of the year. A debt is a separate obligation you carry; it does not reduce what you are holding.',
          'The other three schools allow some deduction, and the Maliki school allows the most. If you follow the Shafi’i school on everything else, switching schools solely to reduce this year’s bill is not a decision to make on your own.',
        ],
      },
      {
        q: 'Which nisab applies in the Shafi’i school?',
        a: [
          'Gold, at 85 grams, which at the time of writing is around $12,994. This is the higher of the two thresholds.',
          'The combination of a high threshold and no debt deduction means the Shafi’i method captures fewer people than the Hanafi method but charges those it captures more.',
        ],
      },
      {
        q: 'Is my wife’s gold jewellery zakatable in the Shafi’i school?',
        a: [
          'Not if it is in genuine personal use. The Shafi’i school exempts worn ornaments, in agreement with the Maliki and Hanbali schools.',
          'Gold held as an investment or store of value is zakatable under every school. The test is use, not who owns it. Note also that Zakat is an individual obligation: each person calculates on their own wealth, and a wife’s gold is hers to account for.',
        ],
      },
      {
        q: 'What if my wealth fell below nisab partway through the year?',
        a: [
          'The year is broken and the count restarts from the day you next cross the threshold. The Shafi’i school requires continuous possession of the nisab across the lunar year.',
          'BarakahFlow tracks this properly against the Hijri calendar. If you record a dip, it resets the Hawl rather than carrying the old anniversary forward and quietly overcharging you.',
        ],
      },
    ],
    related: ['singapore', 'malaysia-indonesia', 'aaoifi'],
  },

  {
    slug: 'hanbali',
    kind: 'madhhab',
    label: 'Hanbali',
    navLabel: 'Hanbali',
    currency: 'USD',
    title: 'Hanbali Zakat Calculator — Gold Nisab and Immediate Debts',
    description:
      'Zakat on the Hanbali method: the 85g gold threshold, worn jewellery exempt, immediate debts deducted, and nisab held across the whole lunar year.',
    keywords:
      'hanbali zakat calculator, hanbali nisab, gold nisab 85g, hanbali debt deduction, zakat hanbali madhhab',
    h1: 'Zakat according to the Hanbali school',
    lede:
      'The Hanbali school sits between the Maliki and Shafi’i positions on debt. What is due now comes off; what is merely owed in the abstract does not. It is the narrowest of the deduction rules that actually allows a deduction, and it is the school followed across much of the Arabian peninsula.',
    nisabBasis: 'gold',
    nisabNote:
      'The Hanbali school sets the threshold by gold, 85 grams — the higher of the two thresholds, shared with the Maliki and Shafi’i schools.',
    conventionKey: 'AAOIFI',
    rules: [
      { k: 'Nisab basis', v: 'Gold, 85 grams' },
      { k: 'Worn jewellery', v: 'Exempt' },
      { k: 'Debt deduction', v: 'Immediate debts deducted' },
      { k: 'Nisab timing', v: 'The threshold must be held for the whole year' },
    ],
    body: [
      {
        h: 'Immediate debts, and where the line falls',
        p: [
          'The Hanbali position deducts what is presently demandable. Rent due this month, an invoice payable now, an instalment that has already fallen due — these reduce your zakatable wealth because the money is already spoken for.',
          'A liability that will not be demanded until later does not, even though you know it is coming. The test is whether the creditor could ask for it today.',
          'This is narrower than the Maliki rule, which subtracts the whole debt, and wider than the Shafi’i rule, which subtracts nothing. In practice it produces a figure between the two.',
        ],
      },
      {
        h: 'The gold threshold and the full year',
        p: [
          'The Hanbali school uses the 85 gram gold threshold and, with the Maliki and Shafi’i schools, requires it to be held continuously across the lunar year.',
          'A dip below the threshold breaks the year. Your count restarts from the day you next rise above it, and BarakahFlow resets the Hijri anniversary accordingly rather than carrying the old date forward.',
        ],
      },
      {
        h: 'Jewellery',
        p: [
          'Exempt where in genuine personal use, in agreement with the Maliki and Shafi’i schools. Gold held as bullion, coin or investment remains zakatable in full.',
        ],
      },
    ],
    example: {
      title: 'A worked example on the Hanbali method',
      currency: 'USD',
      rows: [
        { k: 'Cash and savings', v: '$25,000' },
        { k: 'Gold bullion, 50g, held as investment', v: '$7,640' },
        { k: 'Less: rent and invoices payable now', v: '− $1,500' },
        { k: 'Instalments not yet fallen due', v: 'Not deducted' },
        { k: 'Zakatable base', v: '$31,140', total: true },
        { k: 'Zakat due at 2.5%', v: '$779', total: true, final: true },
      ],
      note:
        'The Maliki method would subtract the $6,000 of future instalments as well, bringing the base to $25,140 and the bill to $629. The Shafi’i method would deduct neither and charge $816. The Hanbali answer sits between them, which is characteristic of the school on this question.',
    },
    faqs: [
      {
        q: 'What counts as an immediate debt in the Hanbali school?',
        a: [
          'A liability that is presently demandable — rent for the current month, a bill already issued, an instalment whose due date has arrived. The test is whether the creditor could require payment today.',
          'A loan repayable over several years is not immediate in its entirety. Only the part currently due qualifies, which is why BarakahFlow asks you to separate the principal outstanding from the principal actually falling due.',
        ],
      },
      {
        q: 'How does the Hanbali position differ from the Maliki one on debt?',
        a: [
          'The Maliki school deducts the debt in full regardless of when it matures. The Hanbali school deducts only what is presently demandable.',
          'For someone carrying a long-dated liability the gap is large. On a $6,000 instalment plan not yet due, the Maliki base is $6,000 lower and the bill $150 lower on the same holdings.',
        ],
      },
      {
        q: 'Which nisab does the Hanbali school use?',
        a: [
          'Gold, at 85 grams — roughly $12,994 at the time of writing. This is shared with the Maliki and Shafi’i schools and stands against the Hanafi silver threshold.',
        ],
      },
      {
        q: 'Is the Hanbali school the one followed in Saudi Arabia?',
        a: [
          'It is the school with the deepest historical roots in the Arabian peninsula and remains dominant in Saudi Arabia and Qatar.',
          'Contemporary Gulf practice on Zakat, particularly for banks and companies, more often follows the AAOIFI standard, which draws across all four schools. Individuals frequently follow one and encounter the other in their bank statements.',
        ],
      },
    ],
    related: ['gulf', 'north-america-australia', 'aaoifi'],
  },
];

const regionalPages = [
  {
    slug: 'gulf',
    kind: 'region',
    label: 'Gulf & Arab States',
    navLabel: 'Gulf & Arab states',
    currency: 'AED',
    title: 'Zakat Calculator UAE & Gulf — AED and SAR Nisab',
    description:
      'Zakat calculator for the UAE, Saudi Arabia and the wider Gulf. Nisab in AED and SAR on the AAOIFI standard, with live gold and silver spot prices.',
    keywords:
      'zakat calculator uae, zakat calculator dubai, nisab in aed, zakat calculator saudi arabia, nisab sar, gulf zakat calculator',
    h1: 'Zakat calculator for the Gulf and Arab states',
    lede:
      'Across the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman, the reference point for Zakat is the AAOIFI standard — the same standard the region’s Islamic banks are audited against. Nisab here is shown in dirhams, and because the dirham and riyal are pegged to the dollar, the threshold moves only with the metal price.',
    conventionKey: 'AAOIFI',
    conventionWhy:
      'The Gulf follows the AAOIFI and majority weight conversion: 85 grams of gold, 595 grams of silver. AAOIFI is headquartered in Bahrain and its Sharia Standard on Zakah is the reference document for Islamic financial institutions across the region.',
    nisabBasis: 'lower',
    authorities: 'AAOIFI · OIC International Islamic Fiqh Academy · UAE Council for Fatwa',
    currencies: [
      { code: 'AED', name: 'UAE dirham', note: 'pegged at 3.6725 to the US dollar' },
      { code: 'SAR', name: 'Saudi riyal', note: 'pegged at 3.75 to the US dollar' },
      { code: 'QAR', name: 'Qatari riyal' },
      { code: 'KWD', name: 'Kuwaiti dinar' },
      { code: 'BHD', name: 'Bahraini dinar' },
      { code: 'OMR', name: 'Omani rial' },
    ],
    body: [
      {
        h: 'Why the peg makes the Gulf threshold unusually stable',
        p: [
          'The dirham and the riyal are pegged to the US dollar, so the only thing moving your nisab figure is the gold or silver price itself. Muslims in the UK, Pakistan or Turkey watch their threshold move on two axes at once — the metal price and their own currency against the dollar. In the Gulf there is only one.',
          'That does not make the figure static. Silver in particular can move several percent in a week, and a threshold you checked last Ramadan may be materially wrong this one.',
        ],
      },
      {
        h: 'Which threshold applies here',
        p: [
          'The AAOIFI standard takes the lower of the two thresholds, which in current prices is always silver. That is the BarakahFlow default for Gulf users.',
          'If you personally follow the Hanbali school, dominant in Saudi Arabia and Qatar, or the Shafi’i school, widely followed in Oman’s Sunni communities and among South Asian and East African residents of the region, the gold threshold may be the one that applies to you. The app will switch to it and you can compare the two figures side by side before deciding.',
        ],
      },
      {
        h: 'Gold, and how much of it is counted',
        p: [
          'Gold holdings in Gulf households are typically larger than the global average, and typically at 22 or 21 karat rather than 24. Valuing an entire piece at the 24 karat price overstates it by roughly a tenth.',
          'BarakahFlow prices 24, 22, 21 and 18 karat separately, and excludes stones, settings and alloy. It also lets you record which pieces are actually worn, because that is the input the Hanafi and majority positions on jewellery disagree about.',
        ],
      },
    ],
    example: {
      title: 'A worked example in dirhams',
      currency: 'AED',
      rows: [
        { k: 'Cash across current and savings accounts', v: 'AED 60,000' },
        { k: 'Gold bullion and investment pieces, 60g at 22 karat', v: 'AED 30,900' },
        { k: 'Less: credit card and bills due within the year', v: '− AED 10,000' },
        { k: 'Zakatable base', v: 'AED 80,900', total: true },
        { k: 'Zakat due at 2.5%', v: 'AED 2,023', total: true, final: true },
      ],
      note:
        'The silver threshold applied here is roughly AED 5,206, so this person is well clear of it. Note that the gold in this example is held as investment rather than worn — worn jewellery would be exempt on the AAOIFI default, and counted in full if you follow the Hanafi school.',
    },
    faqs: [
      {
        q: 'What is the nisab in AED right now?',
        a: [
          'On the AAOIFI standard the threshold is the lower of the two metals, which is silver at 595 grams. At the gold and silver prices current at the time of writing that is roughly AED 5,206, against roughly AED 47,721 for the 85 gram gold threshold.',
          'These figures move with the metal price. BarakahFlow refreshes them from live international spot prices roughly every thirty seconds while the calculator is open, so you are not working from a number someone published last year.',
        ],
      },
      {
        q: 'Is Zakat compulsory by law in the UAE?',
        a: [
          'No. Zakat in the UAE is a personal religious obligation rather than a state-collected tax, and there is no government assessment or filing. The UAE Zakat Fund exists to receive and distribute it, but paying through it is voluntary.',
          'Saudi Arabia is the exception in the region: it levies Zakat on Saudi and GCC-owned businesses through ZATCA. That is a corporate assessment and is separate from the personal Zakat al-Mal this calculator deals with.',
        ],
      },
      {
        q: 'I am an expatriate in Dubai sending money home. Where do I pay?',
        a: [
          'Zakat is calculated on your wealth wherever it is held, so money in a UAE account and money in an account back home both count towards the same total. Convert everything into one currency to test against nisab.',
          'On where to pay it, the majority position favours the poor of the place where the wealth is located, but transferring it to relatives or a needy community elsewhere is widely permitted and in some cases preferred. This is a question worth putting to a scholar rather than settling from a calculator.',
        ],
      },
      {
        q: 'Does BarakahFlow support Gulf currencies other than the dirham?',
        a: [
          'Yes. The Saudi riyal, Qatari riyal, Kuwaiti dinar, Bahraini dinar and Omani rial are all supported, alongside twenty currencies in total. Pegged rates are applied exactly rather than being pulled from a floating feed, so the pegged currencies do not drift.',
        ],
      },
    ],
    related: ['aaoifi', 'hanbali', 'shafii'],
  },

  {
    slug: 'south-asia',
    kind: 'region',
    label: 'South Asia',
    navLabel: 'South Asia',
    currency: 'PKR',
    title: 'Zakat Calculator Pakistan & India — Tola Nisab in PKR and INR',
    description:
      'Zakat calculator for Pakistan, India and Bangladesh. Nisab on the classical Tola convention — 7.5 tola gold, 52.5 tola silver — with the Hanafi rules applied.',
    keywords:
      'zakat calculator pakistan, nisab in pkr, zakat calculator india, nisab in inr, tola nisab, 52.5 tola silver, zakat calculator bangladesh',
    h1: 'Zakat calculator for South Asia',
    lede:
      'South Asia calculates nisab in tolas, not grams, and the tola conversion gives slightly heavier thresholds than the international standard. Combined with the Hanafi rules that predominate across Pakistan, India and Bangladesh — silver threshold, jewellery counted — this region’s numbers differ from the global default in two ways at once.',
    conventionKey: 'TOLA',
    conventionWhy:
      'The classical Tola convention puts nisab at 7.5 tola of gold (87.48 grams) and 52.5 tola of silver (612.36 grams), a tola being 11.664 grams. These are the figures used in Pakistan’s official annual nisab notifications and by the major South Asian darul iftas. They run about 2.8% heavier than the AAOIFI conversion.',
    nisabBasis: 'silver',
    authorities: 'Classical Hanafi · Darul Uloom Deoband · Jamia Binoria',
    currencies: [
      { code: 'PKR', name: 'Pakistani rupee' },
      { code: 'INR', name: 'Indian rupee' },
      { code: 'BDT', name: 'Bangladeshi taka' },
    ],
    body: [
      {
        h: 'Why the tola figure is different, and whether it matters',
        p: [
          'The prophetic weights were specified in dirhams and dinars, and converting those into modern units can be done more than one way. The AAOIFI conversion gives 85 grams of gold and 595 of silver. The classical tola conversion used across South Asia gives 87.48 and 612.36.',
          'The gap is about 2.8%. On a threshold that is immaterial — it will rarely be the thing that decides whether you are liable. On a large holding it is not immaterial at all, and using the wrong convention will put your figure out by the same proportion.',
          'BarakahFlow supports both and defaults South Asian users to the tola convention.',
        ],
      },
      {
        h: 'The Hanafi rules that come with it',
        p: [
          'Pakistan, India and Bangladesh are overwhelmingly Hanafi, and two Hanafi positions change the arithmetic substantially.',
          'First, the threshold is set by silver, which is the lower figure by a wide margin. Second, gold jewellery is counted whether it is worn or not — which in households where gold is a primary form of family savings is usually the largest single line in the calculation.',
          'A calculator that exempts worn jewellery is giving you the majority answer, not the Hanafi one. If you follow Deoband, Binoria or any mainstream South Asian darul ifta, that is the wrong answer for you.',
        ],
      },
      {
        h: 'Pakistan’s statutory deduction is not your Zakat calculation',
        p: [
          'Pakistan deducts Zakat at source from certain bank accounts each Ramadan under the Zakat and Ushr Ordinance, against a nisab figure the State Bank notifies annually.',
          'That deduction covers a narrow band of assets and is not a complete assessment of what you owe. Gold, cash held outside those accounts, business stock and receivables are all outside it. Treat anything deducted at source as a payment on account, not as the finished calculation.',
        ],
      },
    ],
    example: {
      title: 'A worked example in Pakistani rupees',
      currency: 'PKR',
      rows: [
        { k: 'Cash and bank balances', v: 'PKR 1,200,000' },
        { k: 'Gold jewellery, 3 tola at 22 karat, worn — counted under Hanafi', v: 'PKR 1,373,000' },
        { k: 'Less: near-term debts due within the year', v: '− PKR 200,000' },
        { k: 'Zakatable base', v: 'PKR 2,373,000', total: true },
        { k: 'Zakat due at 2.5%', v: 'PKR 59,325', total: true, final: true },
      ],
      note:
        'The silver threshold on the tola convention is roughly PKR 408,518, so this household is well above it. Had the jewellery been exempted on the majority position, the base would have been PKR 1,000,000 and the bill PKR 25,000 — well under half. The jewellery rule is the whole story in South Asian households.',
    },
    faqs: [
      {
        q: 'What is the nisab in Pakistani rupees?',
        a: [
          'On the Hanafi and tola basis the threshold is 52.5 tola of silver, which is 612.36 grams. At the metal prices current at the time of writing that is roughly PKR 408,518. The gold threshold of 7.5 tola, 87.48 grams, is roughly PKR 3,744,492.',
          'The State Bank of Pakistan notifies a nisab figure each Ramadan for the purposes of the statutory bank deduction. That figure governs the deduction; it does not govern the wider calculation of what you personally owe.',
        ],
      },
      {
        q: 'How many tola is nisab?',
        a: [
          'Seven and a half tola of gold, or fifty-two and a half tola of silver. A tola is 11.664 grams, which puts these at 87.48 and 612.36 grams respectively.',
          'Under the Hanafi school, which predominates across South Asia, the silver figure is the one that applies where you hold a mixture of assets.',
        ],
      },
      {
        q: 'Is my wife’s gold jewellery zakatable in India and Pakistan?',
        a: [
          'Under the Hanafi school, yes — worn or not. This is the settled position of the South Asian darul iftas and it is the single biggest difference between a Hanafi calculation and the majority one.',
          'Only the gold content counts. Stones, settings and alloy are excluded, and 22 karat is valued at 22 karat rather than at the 24 karat price. Note also that Zakat is individual: a wife calculates on her own gold, not her husband’s.',
        ],
      },
      {
        q: 'Does the Zakat deducted from my Pakistani bank account cover my obligation?',
        a: [
          'Almost certainly not. The statutory deduction reaches only certain categories of account and applies only to the balance in them on the deduction date.',
          'Gold, cash outside those accounts, business inventory, receivables and investments are untouched by it. Calculate your full obligation and treat what was deducted as a credit against it.',
        ],
      },
      {
        q: 'Which convention should I use if I live abroad but my family is in Pakistan?',
        a: [
          'Follow the school and convention you actually follow, not the one where the money happens to sit. If you are Hanafi and use the tola convention, that remains correct whether your account is in Karachi or Manchester.',
          'Convert all your holdings into a single currency to test against nisab. BarakahFlow supports twenty currencies and will hold your convention setting steady while you switch the display currency.',
        ],
      },
    ],
    related: ['hanafi', 'uk-europe', 'aaoifi'],
  },

  {
    slug: 'singapore',
    kind: 'region',
    label: 'Singapore',
    navLabel: 'Singapore',
    currency: 'SGD',
    title: 'Zakat Calculator Singapore — MUIS Nisab in SGD',
    description:
      'Zakat calculator for Singapore using the MUIS convention: 86 grams of gold, the figure the Singapore Fatwa Committee sets its annual nisab against.',
    keywords:
      'zakat calculator singapore, muis nisab, nisab singapore sgd, zakat harta singapore, singapore fatwa committee zakat',
    h1: 'Zakat calculator for Singapore',
    lede:
      'Singapore is the one jurisdiction with its own weight convention. MUIS sets nisab against 86 grams of gold rather than the 85 used almost everywhere else — a small difference, but a deliberate one, and using the international figure will put your threshold out by roughly a percent.',
    conventionKey: 'MUIS',
    conventionWhy:
      'MUIS, the Islamic Religious Council of Singapore, sets nisab against 86 grams of gold. The Singapore Fatwa Committee publishes the resulting figure and revises it as the gold price moves. Singapore is predominantly Shafi’i, and the Shafi’i school uses the gold threshold rather than the silver one.',
    nisabBasis: 'gold',
    authorities: 'MUIS · Singapore Fatwa Committee',
    currencies: [{ code: 'SGD', name: 'Singapore dollar' }],
    body: [
      {
        h: 'Why 86 grams',
        p: [
          'The prophetic threshold of twenty dinars converts into modern grams differently depending on the weight taken for the dinar. AAOIFI arrives at 85 grams; the classical tola conversion arrives at 87.48; MUIS settles on 86.',
          'None of these is wrong. They are different resolutions of the same historical question, and the spread across all three is under three percent. What matters is applying one consistently rather than mixing them.',
          'For Singapore, MUIS is the local authority and 86 grams is the figure to use. BarakahFlow defaults Singapore users to it.',
        ],
      },
      {
        h: 'Gold, not silver',
        p: [
          'Singapore’s Muslim community is predominantly Shafi’i, and the Shafi’i school sets the threshold by gold. That is a materially higher bar than the silver figure used by the Hanafi school and by AAOIFI.',
          'The practical consequence is that a Singaporean with modest savings may be below the threshold and owe nothing, where the same person following the Hanafi school would be liable. This is not an inconsistency to be resolved by picking the cheaper answer; it is a question of which school you follow.',
        ],
      },
      {
        h: 'What to include, and one local question',
        p: [
          'Cash, savings, shares, unit trusts, gold and business assets are all counted. Debts falling due within the year reduce the base under the AAOIFI treatment, though the Shafi’i school itself allows no deduction at all — BarakahFlow will apply whichever you have selected.',
          'CPF is the question Singaporean Muslims ask most, and scholars have not spoken with one voice on it. The considerations are whether the funds are accessible, and whether an inaccessible balance can be said to be fully owned. BarakahFlow handles restricted retirement savings by letting you count them net of the penalty and tax that would apply on withdrawal, which is a mainstream treatment — but it does not claim to settle the question, and MUIS is the right place to take it.',
        ],
      },
    ],
    example: {
      title: 'A worked example in Singapore dollars',
      currency: 'SGD',
      rows: [
        { k: 'Cash and savings accounts', v: 'SGD 40,000' },
        { k: 'Shares and unit trusts at market value', v: 'SGD 15,000' },
        { k: 'Less: bills and card balances due within the year', v: '− SGD 5,000' },
        { k: 'Zakatable base', v: 'SGD 50,000', total: true },
        { k: 'Zakat due at 2.5%', v: 'SGD 1,250', total: true, final: true },
      ],
      note:
        'The MUIS gold threshold of 86 grams is roughly SGD 16,960 at the time of writing, so this person is comfortably liable. Someone with SGD 12,000 in total would be below the threshold and owe nothing — while the same person on the Hanafi silver threshold of roughly SGD 1,829 would be well above it and owe SGD 300.',
    },
    faqs: [
      {
        q: 'What is the nisab in Singapore?',
        a: [
          'MUIS sets nisab against 86 grams of gold. At the gold price current at the time of writing that is roughly SGD 16,960. MUIS publishes the official figure and updates it as the price moves, so check theirs before you pay.',
          'BarakahFlow uses the 86 gram MUIS convention for Singapore by default and prices it from live international spot rates.',
        ],
      },
      {
        q: 'Why is Singapore’s nisab 86 grams when everyone else uses 85?',
        a: [
          'Because converting the prophetic weight of twenty dinars into grams admits more than one defensible answer, and the Singapore Fatwa Committee arrived at 86.',
          'The three conventions in common use — AAOIFI at 85, MUIS at 86, and the classical tola at 87.48 — span less than three percent. Consistency matters more than which one you pick, but within Singapore the local authority is MUIS.',
        ],
      },
      {
        q: 'Is Zakat on CPF payable in Singapore?',
        a: [
          'Scholars differ, and BarakahFlow does not claim to settle it. The debate turns on accessibility: whether wealth you cannot presently withdraw is wealth you fully own for Zakat purposes.',
          'The app’s treatment for restricted retirement savings is to count them net of the penalty and tax that withdrawal would attract, which is a mainstream contemporary position. If you want a ruling rather than a treatment, MUIS is the authority to ask.',
        ],
      },
      {
        q: 'Can I pay my Zakat through MUIS using this calculator?',
        a: [
          'BarakahFlow calculates and records; it does not collect or disburse. Once you have your figure, pay it through MUIS or any channel you trust.',
          'The app keeps the full record of how the figure was reached — the method, the metal prices on the day, the exchange rates and the Hijri dates at both ends of your year — so a calculation from three years ago can still be reproduced and explained.',
        ],
      },
    ],
    related: ['shafii', 'malaysia-indonesia', 'aaoifi'],
  },

  {
    slug: 'malaysia-indonesia',
    kind: 'region',
    label: 'Malaysia & Indonesia',
    navLabel: 'Malaysia & Indonesia',
    currency: 'MYR',
    title: 'Zakat Calculator Malaysia & Indonesia — Nisab in MYR and IDR',
    description:
      'Zakat calculator for Malaysia and Indonesia. Nisab on the 85 gram gold threshold used by the state zakat bodies, in ringgit and rupiah, with Shafi’i rules applied.',
    keywords:
      'kalkulator zakat malaysia, nisab zakat malaysia, zakat calculator indonesia, nisab emas 85 gram, baznas nisab, lembaga zakat selangor',
    h1: 'Zakat calculator for Malaysia and Indonesia',
    lede:
      'Malaysia and Indonesia both set nisab against gold rather than silver, at 85 grams, and both are predominantly Shafi’i. The institutional landscape is unusually developed here — Malaysia collects through state-level bodies, Indonesia through BAZNAS — and their published figures are the ones to reconcile against.',
    conventionKey: 'AAOIFI',
    conventionWhy:
      'The state zakat institutions across Malaysia and Indonesia set nisab against 85 grams of gold, matching the AAOIFI weight conversion. Note that they apply it to gold specifically rather than taking the lower of gold and silver as AAOIFI itself does — the weight is shared, the metal choice is not.',
    nisabBasis: 'gold',
    authorities: 'PPZ-MAIWP · Lembaga Zakat Selangor · BAZNAS Indonesia',
    currencies: [
      { code: 'MYR', name: 'Malaysian ringgit' },
      { code: 'IDR', name: 'Indonesian rupiah' },
    ],
    body: [
      {
        h: 'Gold at 85 grams, and one thing to watch',
        p: [
          'Both countries use the 85 gram gold weight, which is the AAOIFI conversion. But there is a distinction worth understanding: AAOIFI itself takes the lower of the gold and silver thresholds, which in current prices means silver. The Malaysian and Indonesian bodies apply the gold figure directly.',
          'So selecting "AAOIFI" and selecting "Malaysia" will give you the same weight but potentially a different threshold. BarakahFlow’s regional preset for Malaysia and Indonesia follows local practice and uses gold.',
          'Some Malaysian states also publish a nisab based on local uruf — prevailing local custom on the gold price — rather than the international spot rate. Where that applies, your state body’s published figure takes precedence over anything a calculator derives from a global feed.',
        ],
      },
      {
        h: 'The Shafi’i rules underneath',
        p: [
          'Both countries are overwhelmingly Shafi’i. That means worn jewellery is exempt, and in the strict Shafi’i position debts are not deducted at all.',
          'In practice the state bodies often apply a more accommodating treatment on debt than the classical Shafi’i position, closer to the AAOIFI approach of deducting near-term liabilities. BarakahFlow lets you pick either and tells you which you have chosen.',
        ],
      },
      {
        h: 'Zakat pendapatan, and why it is not in this calculator',
        p: [
          'Malaysia has an unusually well-established practice of zakat pendapatan — Zakat on income, assessed and often paid monthly through salary deduction. Indonesia has an analogous zakat penghasilan.',
          'This is a contemporary ijtihad rather than a classical category, and it interacts with Zakat al-Mal rather than replacing it. What this calculator produces is Zakat al-Mal on accumulated wealth. If you already pay zakat pendapatan by monthly deduction, treat those payments as a credit and speak to your state body about how the two fit together, rather than paying twice on the same money.',
        ],
      },
    ],
    example: {
      title: 'A worked example in Malaysian ringgit',
      currency: 'MYR',
      rows: [
        { k: 'Cash, savings and ASB holdings', v: 'MYR 80,000' },
        { k: 'Gold bullion, 100g, held as investment', v: 'MYR 64,200' },
        { k: 'Less: bills and instalments due within the year', v: '− MYR 14,000' },
        { k: 'Zakatable base', v: 'MYR 130,200', total: true },
        { k: 'Zakat due at 2.5%', v: 'MYR 3,255', total: true, final: true },
      ],
      note:
        'The gold threshold of 85 grams is roughly MYR 54,575 at the time of writing. Bullion held as an investment is zakatable under every school; had this been jewellery in regular use it would have been exempt on the Shafi’i position that predominates locally, dropping the base to MYR 66,000 and the bill to MYR 1,650.',
    },
    faqs: [
      {
        q: 'What is the nisab in Malaysia?',
        a: [
          'The state zakat bodies set nisab against 85 grams of gold, which at the gold price current at the time of writing is roughly MYR 54,575.',
          'Your own state institution — Lembaga Zakat Selangor, PPZ-MAIWP or your state equivalent — publishes the official figure, and some use a local uruf gold price rather than the international spot rate. Where the two differ, follow your state body.',
        ],
      },
      {
        q: 'What is the nisab in Indonesian rupiah?',
        a: [
          'BAZNAS sets nisab at the equivalent of 85 grams of gold, which at the time of writing is in the region of IDR 211.8 million. BAZNAS publishes an updated figure periodically and that is the one to reconcile against.',
          'BarakahFlow supports the rupiah and prices the threshold from live international gold spot rates.',
        ],
      },
      {
        q: 'Does zakat pendapatan replace Zakat on my savings?',
        a: [
          'No. Zakat pendapatan is assessed on income as it is earned; Zakat al-Mal is assessed on wealth held for a full lunar year. They address different things and both can apply.',
          'What they should not do is charge you twice on the same money — income already zakated on receipt, then zakated again a year later as savings. How your state body reconciles this varies, so ask them. This calculator produces Zakat al-Mal only.',
        ],
      },
      {
        q: 'Is ASB or ASNB zakatable?',
        a: [
          'Unit holdings of this kind are generally treated as zakatable wealth at their redeemable value, in the same way as other investment funds.',
          'The finer questions — how to treat undistributed income, and the underlying screening of the fund itself — are matters your state body has published positions on. BarakahFlow counts shares and funds at market value and leaves the fund-level rulings to the scholars who issue them.',
        ],
      },
    ],
    related: ['shafii', 'singapore', 'aaoifi'],
  },

  {
    slug: 'uk-europe',
    kind: 'region',
    label: 'UK & Europe',
    navLabel: 'UK & Europe',
    currency: 'GBP',
    title: 'Zakat Calculator UK — Nisab in Pounds and Euros',
    description:
      'Zakat calculator for the UK and Europe. Silver nisab in GBP and EUR following National Zakat Foundation practice, with live gold and silver spot prices.',
    keywords:
      'zakat calculator uk, nisab uk, nisab in pounds, zakat calculator europe, nisab in euros, national zakat foundation nisab, zakat on isa',
    h1: 'Zakat calculator for the UK and Europe',
    lede:
      'British and European Muslim institutions have largely settled on the silver threshold — a low bar, deliberately chosen so that more people are captured by the obligation rather than fewer. It is the position the National Zakat Foundation uses, and it is the BarakahFlow default here.',
    conventionKey: 'AAOIFI',
    conventionWhy:
      'The UK and Europe use the AAOIFI and majority weight conversion of 85 grams of gold and 595 grams of silver, with the silver threshold applied as the operative one. The National Zakat Foundation, the European Council for Fatwa and Research, and the major British Muslim charities converge on this.',
    nisabBasis: 'silver',
    authorities: 'National Zakat Foundation UK · ECFR · Islamic Relief',
    currencies: [
      { code: 'GBP', name: 'Pound sterling' },
      { code: 'EUR', name: 'Euro' },
    ],
    body: [
      {
        h: 'Why British institutions chose silver',
        p: [
          'The silver threshold sits around a thousand pounds; the gold threshold sits around ten thousand. Which you pick decides whether a large part of the British Muslim community is liable at all.',
          'The National Zakat Foundation and most UK charities take silver, on the reasoning that Zakat is a right of the poor and the cautious side of a genuine scholarly difference is the side that brings more wealth into the obligation. The same logic AAOIFI applies.',
          'If you follow the Maliki, Shafi’i or Hanbali school personally, the gold threshold is your school’s position and BarakahFlow will apply it. The app shows you both figures so you can see exactly what the choice costs.',
        ],
      },
      {
        h: 'ISAs, pensions and the assets Britain actually holds',
        p: [
          'A cash ISA is cash and is zakatable in full. A stocks and shares ISA is an investment holding and is counted at market value.',
          'Workplace and personal pensions are harder. A defined contribution pot you cannot access until fifty-five is not wealth you can presently dispose of, and scholars differ on whether that changes its status. BarakahFlow’s treatment is to count restricted retirement savings net of the tax and penalty that would apply on access — a mainstream contemporary position, not a ruling. A defined benefit pension, having no capital value you own, is generally excluded until it pays out.',
          'Help to Buy and Lifetime ISA balances are accessible with a penalty and are treated the same way as other restricted savings.',
        ],
      },
      {
        h: 'Two currencies, one threshold',
        p: [
          'Sterling and the euro both float against the dollar, and gold and silver are priced in dollars. Your nisab therefore moves on two axes at once — the metal price, and your currency against the dollar. A threshold figure someone published eight months ago can be materially wrong today.',
          'BarakahFlow prices from live international spot rates in your own currency and timestamps what it used, so the figure you paid on is reproducible later.',
        ],
      },
    ],
    example: {
      title: 'A worked example in pounds',
      currency: 'GBP',
      rows: [
        { k: 'Current account and cash ISA', v: '£12,000' },
        { k: 'Stocks and shares ISA at market value', v: '£8,000' },
        { k: 'Gold jewellery worn regularly', v: 'Exempt' },
        { k: 'Less: card balances and bills due within the year', v: '− £2,500' },
        { k: 'Zakatable base', v: '£17,500', total: true },
        { k: 'Zakat due at 2.5%', v: '£438', total: true, final: true },
      ],
      note:
        'The silver threshold applied here is roughly £1,106. Had the gold threshold of about £10,135 been used instead, this person would still be liable — but someone with £5,000 in total would owe £125 on silver and nothing at all on gold. That is the choice British institutions have made on the community’s behalf, and it is worth understanding rather than inheriting.',
    },
    faqs: [
      {
        q: 'What is the nisab in the UK right now?',
        a: [
          'On the silver threshold of 595 grams, roughly £1,106 at the metal prices current at the time of writing. The gold threshold of 85 grams is roughly £10,135.',
          'The National Zakat Foundation publishes an updated figure and most UK Muslims follow it. BarakahFlow prices the same thresholds from live spot rates in sterling, refreshing while the calculator is open.',
        ],
      },
      {
        q: 'Do I pay Zakat on my ISA?',
        a: [
          'Yes. A cash ISA is cash and counts in full. A stocks and shares ISA counts at its market value on the day your Zakat year closes.',
          'The ISA wrapper is a tax status under British law and has no bearing on the Sharia position. Money that is yours and accessible is zakatable whatever wrapper it sits in.',
        ],
      },
      {
        q: 'Is my UK pension zakatable?',
        a: [
          'It depends on the type and on which position you follow. A defined contribution pot is wealth you own but cannot yet access, and scholars differ on how that affects its status.',
          'BarakahFlow counts restricted retirement savings net of the penalty and tax that access would attract, which is a mainstream contemporary treatment. A defined benefit pension is generally excluded until it starts paying, since you own no capital sum. Neither of these is a fatwa — if the amounts are significant, ask a scholar.',
        ],
      },
      {
        q: 'Can I deduct my UK mortgage from my Zakat?',
        a: [
          'Not the balance. No school permits netting an entire housing debt against your savings, and calculators that allow it produce figures that are simply wrong.',
          'Only principal actually falling due within your Zakat year can reduce the base, and BarakahFlow deducts nothing from a mortgage by default. You can add one month or twelve lunar months of principal if you hold that view. The interest element is never deductible.',
        ],
      },
      {
        q: 'Which school should I follow in the UK?',
        a: [
          'Most British Muslims follow the school of their family’s background — commonly Hanafi for those with South Asian heritage, Maliki for many with North and West African heritage, Shafi’i for many with East African, Levantine or Southeast Asian heritage.',
          'The institutional default in the UK is closer to the AAOIFI position, which is why BarakahFlow starts there and then asks. If you know your school, set it and the app applies that school’s rules throughout.',
        ],
      },
    ],
    related: ['hanafi', 'maliki', 'aaoifi'],
  },

  {
    slug: 'north-america-australia',
    kind: 'region',
    label: 'North America & Australia',
    navLabel: 'North America & Australia',
    currency: 'USD',
    title: 'Zakat Calculator USA, Canada & Australia — Nisab in USD',
    description:
      'Zakat calculator for the USA, Canada and Australia. Silver nisab in USD, CAD and AUD following FCNA and AMJA practice, with 401(k) and RRSP guidance.',
    keywords:
      'zakat calculator usa, nisab in usd, zakat calculator canada, zakat calculator australia, fcna nisab, amja zakat, zakat on 401k',
    h1: 'Zakat calculator for North America and Australia',
    lede:
      'The Fiqh Council of North America and AMJA both work from the silver threshold, and the National Zakat Foundation’s US and Australian arms follow suit. The distinctive problem in these countries is not the threshold — it is retirement accounts, which hold a large share of household wealth and sit behind access penalties.',
    conventionKey: 'AAOIFI',
    conventionWhy:
      'North America and Australia use the AAOIFI and majority weight conversion — 85 grams of gold, 595 grams of silver — with silver applied as the operative threshold. The Fiqh Council of North America, the Assembly of Muslim Jurists of America and the National Zakat Foundation converge on this.',
    nisabBasis: 'silver',
    authorities: 'FCNA · AMJA · National Zakat Foundation',
    currencies: [
      { code: 'USD', name: 'US dollar' },
      { code: 'CAD', name: 'Canadian dollar' },
      { code: 'AUD', name: 'Australian dollar' },
    ],
    body: [
      {
        h: 'Retirement accounts, the question that actually matters here',
        p: [
          'A 401(k), an IRA, an RRSP or Australian superannuation will often be the largest single asset a Muslim household in these countries holds. Getting its treatment wrong changes the Zakat figure by more than every other input combined.',
          'The scholarly discussion turns on access. Wealth you cannot reach without penalty, or cannot reach at all until a set age, may not be wealth you presently possess in the sense Zakat requires.',
          'The mainstream contemporary position, and the one BarakahFlow implements, is to count the accessible value — the balance net of the early withdrawal penalty and the tax that would fall due. Superannuation, which is generally locked until preservation age, raises the same question more sharply. AMJA and the FCNA have both published on this and they are the right authorities to consult if the sums are large.',
        ],
      },
      {
        h: 'Why silver, and what it costs',
        p: [
          'The silver threshold sits near fourteen hundred dollars against roughly thirteen thousand for gold. The North American bodies take silver for the same reason their British counterparts do: where two defensible thresholds exist, the lower one serves the poor.',
          'This means many students, young professionals and households of modest means are liable in the US and Canada who would not be under a gold threshold. That is the intended result of the position, not an accident of it.',
        ],
      },
      {
        h: 'Deductibility, and the American mortgage',
        p: [
          'Only liabilities falling due within your Zakat year reduce the base. American mortgages run for thirty years and their balances are large; netting one against a savings account would eliminate almost every homeowner’s obligation, which no school permits.',
          'BarakahFlow deducts nothing from a mortgage by default and makes anything wider an explicit, informed choice. Interest is never deductible under any setting — and where interest has been received rather than paid, the app strips it out of your wealth base entirely and tells you plainly that it must be given away separately rather than purified by paying Zakat on it.',
        ],
      },
    ],
    example: {
      title: 'A worked example in US dollars',
      currency: 'USD',
      rows: [
        { k: 'Checking and savings accounts', v: '$18,000' },
        { k: '401(k), net of early withdrawal penalty and tax', v: '$22,000' },
        { k: 'Less: card balances and bills due within the year', v: '− $4,000' },
        { k: 'Zakatable base', v: '$36,000', total: true },
        { k: 'Zakat due at 2.5%', v: '$900', total: true, final: true },
      ],
      note:
        'The silver threshold here is roughly $1,418. Note how much the retirement account drives the outcome: excluded entirely, the base falls to $14,000 and the bill to $350. That single treatment decision is worth more than every other line in this calculation put together, which is why it deserves a scholar’s answer rather than a default.',
    },
    faqs: [
      {
        q: 'What is the nisab in US dollars?',
        a: [
          'On the silver threshold of 595 grams, roughly $1,418 at the metal prices current at the time of writing. The gold threshold of 85 grams is roughly $12,994.',
          'FCNA and AMJA both work from silver, so that is the figure most American Muslims use. BarakahFlow prices it from live international spot rates and refreshes while the calculator is open.',
        ],
      },
      {
        q: 'Do I pay Zakat on my 401(k)?',
        a: [
          'The mainstream contemporary position is yes, on the accessible value — the balance net of the early withdrawal penalty and the income tax that would fall due if you took it out today.',
          'A minority position defers Zakat until the funds actually become accessible. BarakahFlow implements the net-accessible treatment and states that it is doing so. Given how much of American Muslim household wealth sits in these accounts, this is worth raising with AMJA or your local scholar rather than accepting a default.',
        ],
      },
      {
        q: 'How is an RRSP or Australian superannuation treated?',
        a: [
          'The same reasoning applies. An RRSP is accessible with a withholding tax and is counted net of it. Australian superannuation is generally locked until preservation age, which strengthens the argument for deferring Zakat until access.',
          'BarakahFlow applies the net-accessible treatment across all three by default and lets you exclude a locked balance if that is the position you follow.',
        ],
      },
      {
        q: 'Is Zakat tax-deductible in the United States?',
        a: [
          'Zakat paid to a registered 501(c)(3) organisation is deductible as a charitable contribution under US tax law, and Canadian and Australian equivalents work similarly through their own registered charity regimes.',
          'The tax treatment has no bearing on the Sharia calculation. Calculate what you owe, pay it, and handle the deduction separately with your accountant.',
        ],
      },
      {
        q: 'Can I pay my Zakat monthly instead of annually?',
        a: [
          'Paying in advance of the due date is permitted by the majority of scholars, so spreading the year’s obligation across twelve payments is generally acceptable provided you reconcile at year end.',
          'What matters is that the full amount actually owed is paid. BarakahFlow records what you have paid against the year and shows the remaining balance, and paying in full restarts your Hawl from the date of payment.',
        ],
      },
    ],
    related: ['aaoifi', 'hanbali', 'uk-europe'],
  },
];

/* Static nisab fallbacks, per weight convention, per currency.
 * Replaced client-side by live spot values when the feed answers. */
const nisabFallbacks = {
  AAOIFI: {
    gold: 85,
    silver: 595,
    values: {
      USD: { gold: '$12,994', silver: '$1,418' },
      AED: { gold: 'AED 47,721', silver: 'AED 5,206' },
      PKR: { gold: 'PKR 3,638,338', silver: 'PKR 396,937' },
      SGD: { gold: 'SGD 16,762', silver: 'SGD 1,829' },
      MYR: { gold: 'MYR 54,575', silver: 'MYR 5,954' },
      GBP: { gold: '£10,135', silver: '£1,106' },
    },
  },
  TOLA: {
    gold: 87.48,
    silver: 612.36,
    values: {
      PKR: { gold: 'PKR 3,744,492', silver: 'PKR 408,518' },
      USD: { gold: '$13,373', silver: '$1,459' },
    },
  },
  MUIS: {
    gold: 86,
    silver: 595,
    values: {
      SGD: { gold: 'SGD 16,960', silver: 'SGD 1,829' },
      USD: { gold: '$13,147', silver: '$1,418' },
    },
  },
};

const conventionLabels = {
  AAOIFI: 'AAOIFI / majority convention',
  TOLA: 'Classical Tola convention',
  MUIS: 'MUIS Singapore convention',
};

module.exports = {
  madhhabPages,
  regionalPages,
  nisabFallbacks,
  conventionLabels,
  NOT_FATWA,
  RATE_NOTE,
};
