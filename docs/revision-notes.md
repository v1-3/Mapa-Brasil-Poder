# Revision — 25 October 2026

This revision replaces the previous single-file prototype with a bilingual, cited atlas. It corrects confirmed errors while explicitly withholding values that cannot be reconstructed from the supplied reference.

## Confirmed corrections

- Added 240 named national officeholders across 80 annual profiles, identifying acting appointments. Names are checked against the [Chamber gallery](https://www2.camara.leg.br/a-camara/conheca/historia/presidentes), [Senate historical lists](https://www25.senado.leg.br/web/senadores/pos-1930) and presidency records. These profiles use 1 July; they do not list every person who served during a year.
- In July 2016, [Waldir Maranhão (PP)](https://www.camara.leg.br/noticias/487872-waldir-maranhao-diz-que-nao-vai-renunciar/) exercised the Chamber presidency while Eduardo Cunha was suspended. Michel Temer is also marked acting president at that reference.
- Historical PTN is separated from modern Podemos, and reused PDC, PST and PSB names are separated. The 1947 PST line uses its then-current PPB name. PRS allocations after the 1992 registration refusal are removed. These distinctions follow the [TSE party history](https://www.tse.jus.br/servicos-eleitorais/glossario/termos/partido-politico).
- Removed the Popular Party from July 1979 and July 1982; its actual lifespan crosses neither reference. See [FGV’s Partido Popular entry](https://atlas.fgv.br/verbete/6179).
- Added the missing PFL organization in 1985–86. Its share cannot safely be recovered from the legacy PDS allocation, so the affected component distributions are withheld. The [Chamber recognized its parliamentary group in April 1985](https://www2.camara.leg.br/legin/int/atomes/1980-1987/atodamesa-56-2-abril-1985-321744-norma-cd-mesa.html).
- Removed DEM and PSL as separate July 2022 parties following [TSE approval of União Brasil on 8 February](https://www.tse.jus.br/comunicacao/noticias/2022/Fevereiro/tse-aprova-registro-do-partido-uniao-brasil).
- Corrected the 1986 narrative to **22 of 23** governorships won by PMDB, as recorded by the [Chamber](https://www.camara.leg.br/noticias/1140361-40-anos-da-redemocratizacao-crise-economica-e-nova-constituicao-marcam-anos-do-governo-sarney/).
- Distinguished PCB’s registration cancellation in 1947 from the [January 1948 termination of its deputies’ mandates](https://www2.camara.leg.br/legin/fed/resmes_sn/1940-1949/resolucaodamesa-3-10-janeiro-1948-344466-publicacaooriginal-1-cd.html).
- Removed the false allocation of every 1979–82 governorship to the government party. [Chagas Freitas’s official biography](https://www.camara.leg.br/deputados/131180/biografia) records his Rio de Janeiro term.
- In the July 1969 profile, Congress was closed. Names remain for historical identification, but parliamentary groups and presiding offices receive no points. The [Senate’s 1969 annals](https://www.senado.leg.br/publicacoes/anais/pdf-digitalizado/Anais_Republica/1969/1969%20Livro%201.pdf) document the October reopening.

## Calculation and presentation repairs

- Removed unsupported simulation probabilities and intervals. The current calculation is deterministic, with the formula and six weights visible.
- Withdrawn Senate shares copied from Chamber proportions in 1947–1994, and inconsistent recent Senate allocations in 2019–2026. These are not independent evidence of Senate composition.
- Withdrawn governor shares where election inputs were missing (1955–65), merger/transition allocations were inconsistent, or recent election-era values did not establish 2025–26 affiliations.
- Percentages replace fractional “seat” and “governor” equivalents. `null` means unavailable; it is not silently converted to a known zero.
- Every annual bar uses the same 0–100 scale. Unassigned components remain grey instead of being redistributed to make the shown parties look complete. Partial sums are labelled and are not presented as reliable rankings of total power.
- Historical party labels appear next to each officeholder. Catalogue dates mean first/last appearance in these inputs, not a party’s foundation or extinction.
- Added complete Portuguese/English controls, persistent party selection, shareable year/language/party links, CSV downloads, a full annual table, image credits, large separated context cards and a no-JavaScript reading page.

## Remaining limitations

The inherited Chamber, governor and retained Senate shares still lack a complete, auditable ledger of named officeholders on the annual reference date. Some are electoral or voting proxies; source omission is not evidence of zero representation. They are clearly labelled estimates, and all known-invalid values found in this review were removed or corrected rather than replaced with invented precision. The 2026 profile is not current election coverage.

The site includes representative parties and movements outside the numerical series, but is not an exhaustive register of every organization or social movement. Fixed weights do not establish equal institutional autonomy under democracy and dictatorship.
