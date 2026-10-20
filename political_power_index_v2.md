# PPI v2: weighted institutional representation

Design specification | 2026-10-17

Use an additive index for ribbon width, a component breakdown for institutional composition, and separate indicators for voting thresholds. Label the number **PPI points out of 100**. The index describes weighted officeholding; it does not establish an empirical percentage of all political power.

**1. Scoring model**

For party i at date t:

\[
PPI_{i,t}=W_Pp_{i,t}+W_Gg_{i,t}+W_S\frac{S_{i,t}}{N_S(t)}+W_D\frac{D_{i,t}}{N_D(t)}
\]

\[
g_{i,t}=\alpha\frac{G_{i,t}}{N_G(t)}+(1-\alpha)\sum_{k\in K_t}\frac{Pop_{k,t_0}}{\sum_{j\in K_t}Pop_{j,t_0}}\,\mathbf{1}[k\text{ is governed by }i]
\]

| Parameter | Default | Interpretation |
| --- | ---: | --- |
| W_P | 30 | Presidency allocation |
| W_G | 20 | State executive allocation |
| W_S | 20 | Senate allocation |
| W_D | 30 | Chamber allocation |
| alpha | 0.5 | Equal-jurisdiction share of the governor component |

Require nonnegative office weights summing to 100, and 0 <= alpha <= 1. Keep the user's original office weights as the baseline; the redesign does not claim that a different arbitrary weighting is empirically superior.

- p is 1 for the party holding the presidency and 0 for other parties, under the modern presidential model.
- N_G, N_S, and N_D are the authorized numbers of offices for the relevant institutional configuration. Do not hardcode modern totals into historical periods.
- K_t contains the jurisdictions included in the governor component. Their population shares must use the same geography and reference date.
- t_0 is the population reference adopted for that term. Freeze it within the term. Log a baseline change separately from an office transfer.
- alpha = 1 gives equal governors; alpha = 0 gives population weighting. Population is a scale proxy, not a direct measurement of fiscal or constitutional authority.
- Preserve the four contributions as a vector alongside the total. In equal-governor mode, party X's tooltip can show Presidency 30.000 + Governors 4.444 + Senate 2.469 + Chamber 4.094, with a total displayed as 41.01. Calculate with full precision and round only for display.

The formula remains additive because its population and office weights are assigned to offices before aggregation by party.

**2. Accounting and missing data**

Assign every included office to exactly one party or residual category at each snapshot. Use separate categories for nonpartisan holders, vacancies, and unknown affiliations. The total across parties AND residual categories is 100; party totals alone can be lower.

For a governor with unknown affiliation, retain that jurisdiction's full weighted contribution in Unknown. When a chamber's size itself is unknown, report the affected index as unavailable instead of inventing a denominator. Missing population data must be resolved or explicitly modeled before using population weighting; do not silently redistribute the missing share.

Show source quality and coverage separately. Do not multiply a party's score by confidence: that would change its apparent representation solely because documentation is poor. An uncertain affiliation belongs in Unknown, with any possible party attribution recorded as a separate uncertainty scenario.

Treat an acting officeholder and a substantive holder according to a documented occupancy convention. Never count both simultaneously for the same office. Preserve the raw records so another convention can be evaluated.

**3. Time and identity**

Provide two views from the same dated ledger:

| View | Rule |
| --- | --- |
| Term baseline | One documented common date after the relevant inaugurations; include continuing senators and affiliation as of that date. |
| Event history | Update on effective dates of office transfers, party switches, mergers, splits, succession, and institutional changes. |

Keep election date, inauguration date, affiliation date, and source publication date distinct. Where event timing is known only to a year, show that uncertainty; do not invent a day. A historical party keeps its stable identity across documented renaming. Reused acronyms do not automatically establish continuity.

An optional term-average score is sum(duration × PPI) / term duration. Use it only over a complete interval with a consistent model and report it separately from point-in-time ribbon width. Durations must reflect actual dates.

**4. Coalitions and voting thresholds**

Coalition PPI is the sum over a unique set of member parties. Coalition components are summed separately as well. Collapsing a coalition replaces its displayed members; expanding restores them. Never add a coalition to the grand total while also counting its members.

Show chamber seat counts and threshold margins beside coalition totals. For the illustrative configuration N_D = 513 and N_S = 81:

| Indicator | Chamber | Senate |
| --- | ---: | ---: |
| Absolute majority of full membership | 257 | 41 |
| Constitutional amendment threshold | 308 | 49 |

Compute these thresholds from the applicable rules and membership totals for each period. Amendments require three fifths in two rounds in each chamber. Ordinary deliberations generally use a majority of votes with an absolute-majority attendance quorum; do not label 257 and 41 as universal ordinary-bill vote requirements. [2]

Threshold indicators describe arithmetic capacity under the chosen loyalty assumption, not a guaranteed vote outcome. A score above 50 does not imply a majority in either chamber. Do not add threshold bonuses to PPI: they would break merger additivity.

**5. Historical scope**

Store an institutional model ID with every snapshot. Apply the four-office formula only where those role mappings are justified. A changed chamber size requires new denominators; a changed constitutional role requires an explicit model review.

For the Empire, retain the monarch and cabinet leadership as distinct actors in the authority strip. The Constitution of 1824 assigned the Moderating Power to the emperor, including appointment of senators and dissolution of the Chamber. A modern presidency proxy is not an adequate description of that structure. [3]

For monarchy, authoritarian, transitional, or suspended-legislature periods, publish the applicable office mapping and any era-specific weights. Until a defensible model is specified, show sourced office counts and historical connections with PPI marked unavailable. Do not silently transfer an absent legislature's allocation to remaining institutions. Mark all model boundaries visibly, and restrict numerical change comparisons to compatible models. A shared 0-to-100 scale is not evidence of equal historical meaning.

**6. Graph rules**

| Visual element | Rule |
| --- | --- |
| Horizontal position | Calendar time, with labeled zoom levels and explicit compressed intervals if used. |
| Ribbon thickness | PPI on a common linear scale within a comparable model. Do not apply logarithms or square roots. |
| Ribbon color | Sourced ideology for the relevant period. Keep party identity in labels and IDs; color similarity does not imply common ancestry. |
| Party ordering | Presidential party first; highest Senate count among remaining parties second; highest governor count among remaining parties third; highest deputy count among remaining parties fourth. |
| Unfilled priority | Skip a priority if no eligible party holds that office type. A nonpartisan head of state remains visible in the authority strip. |
| Remaining parties | Descending PPI. Resolve ties by prior displayed order, then stable party ID. Use the same tie rule inside each priority selection. |
| Zero-score parties | A separate aligned strip of labels and fixed-width presence lines, explicitly outside the quantitative score area. |
| Small positive scores | Preserve proportional width; use a larger invisible hit area or a leader label for selection. |
| Leaders | Head of state and head of government in the top authority strip; party leaders on selection and at readable zoom levels. |
| Source quality | An icon or line pattern with a legend; do not alter score width. |

The ranking is a priority sequence with de-duplication, not a weighted sort. Re-evaluate it at the selected baseline or event snapshots. Curved centerlines can ease crossings, but the data remain stepwise at event boundaries; do not imply gradual score transfer before an event occurred.

Record economic orientation, social orientation, regime stance, and ideology labels separately when the evidence supports them. Choose one declared dimension or sourced family for the default color legend. Use text or patterns for additional dimensions and disputed classifications. Do not force every historical party into a single contemporary left-to-right category.

Include every documented party active at the selected date, including parties without scored offices. Record legal status and organizational continuity separately: prohibition does not automatically prove organizational dissolution. Mark catalogue gaps instead of claiming unsupported completeness.

**7. Connections and conservation**

- A rename continues the same ribbon if organizational continuity is documented.
- A merger joins the predecessor identities; score is conserved at the same instant only if the included offices and model are unchanged.
- A split allocates each office's contribution to its documented successor, including the specific jurisdictions for governors. Do not divide by a generic percentage unless the records support it.
- A party-switch link records the specific office contribution transferred on the effective date.
- An electoral gain or loss changes ribbon width at the election's effective office transition. It does not establish organizational ancestry between losing and winning parties.
- A lineage link with unknown office transfers stays an unweighted relationship. Do not fabricate a quantitative Sankey flow from two endpoint totals.
- Simultaneous events require a documented event order or a single combined transition, rather than an invented intermediate state.

**8. Weight sensitivity**

Offer the baseline plus a transparent sensitivity comparison. Recompute all snapshots with the same selected parameter set.

Use W_P in {25, 30, 35}, W_G in {15, 20, 25}, W_S in {15, 20, 25}, and W_D in {25, 30, 35}, retaining only combinations summing to 100. This gives 19 weight combinations. Evaluate alpha in {0, 0.5, 1} for 57 scenarios in total.

Report each party's minimum and maximum score and its unconstrained score rank across those scenarios. Distinguish score ranking from the user's visual priority order. Call these sensitivity ranges, not confidence intervals or probabilities. These parameter limits are proposed design choices; they require no claim of statistical calibration. Weight and aggregation sensitivity are standard composite-indicator diagnostics. [1]

**9. Worked synthetic example**

These parties and population shares are invented solely to check the design. Defaults are W = (30, 20, 20, 30), alpha = 0.5, and office totals = (27, 81, 513).

| Party | Presidency | Governors | Senators | Deputies | Share of population in governed states | PPI |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| X | 1 | 6 | 10 | 70 | 24% | 41.18 |
| Y | 0 | 3 | 25 | 150 | 12% | 17.26 |
| Z | 0 | 18 | 46 | 293 | 64% | 41.56 |
| Total | 1 | 27 | 81 | 513 | 100% | 100.00 |

X + Y has 58.44 PPI, 220 deputies, and 35 senators. It falls short of an absolute majority in both chambers despite exceeding half of the modeled index. This is why component counts and thresholds remain visible.

With alpha = 1, party X reproduces the original equal-governor calculation: 41.007147498... PPI, displayed as 41.01.

**10. Minimum implementation record**

Retain stable party and office IDs; office type and jurisdiction; holder and affiliation; effective start and end; institutional model ID and denominators; population reference and geography; party status and leader intervals; event type and participants; source URL and locator; source publication and retrieval dates; and known, disputed, or unknown status. Keep coalition membership as dated links, not another copy of the same offices.

Validate unique office occupancy, exhaustive accounting, valid parameter ranges, governor population coverage, dated party existence, and merger/split conservation where their assumptions apply. Reject incompatible model comparisons. Preserve full precision internally and disclose display-rounding differences.

**Sources checked on 2026-10-17**

1. OECD/European Union/EC-JRC (2008). *Handbook on Constructing Composite Indicators: Methodology and User Guide*. Sections on weighting and sensitivity. [DOI: 10.1787/9789264043466-en](https://doi.org/10.1787/9789264043466-en).
2. Brazil (1988, consolidated text). *Constituição da República Federativa do Brasil*, articles 46, 47, 60, and 69. [Official text](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm).
3. Brazil (1824). *Constituição Política do Império do Brazil*, articles 98 and 101. [Official text](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao24.htm).
