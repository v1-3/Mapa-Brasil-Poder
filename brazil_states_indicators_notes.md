# Brazil state indicators — definitions and sources

Prepared 17 October 2026. The CSV contains all 26 states plus Distrito Federal, with official Portuguese state names and UF codes. The original ten electoral columns are retained. Twenty economic, fiscal and social columns are appended.

## File format and dates

The file is comma-separated UTF-8 CSV, with one header row and 27 records. Numeric fields use decimal points, no thousands separators, and no currency or percent symbols. For a percentage, `14.0` means 14%, not 0.14%. A transfer ratio of `0.0783` means BRL 0.0783 received per BRL 1 recorded as collected.

The year is part of every added column name. GDP is for 2023; poverty and food insecurity are for 2024; receipts, transfers, benefits and employment are for 2025. These are separate snapshots, not observations from one common year. The retained electorate snapshot is 20 July 2026. Money is nominal BRL for the stated year.

## Added columns

| CSV column | Meaning and source |
|---|---|
| `GDP_BRL_2023` | GDP at current prices, BRL. IBGE SIDRA 5938, variable 37, originally reported in BRL thousand and multiplied by 1 000. |
| `GDP_Share_National_Pct_2023` | State GDP / Brazil GDP × 100, rounded to four decimals. Brazil denominator: BRL 10 943 345 439 000. |
| `GDP_Per_Capita_BRL_2023` | Official regional GDP per capita, BRL, from IMB/IBGE Table 8. Uses the population denominator specified in that publication, not the electorate or the 2025 population. |
| `Federal_Revenue_Collected_BRL_2025` | Sum of all federal-revenue categories in Receita Federal's UF file, January–December. Includes RFB-administered receipts and receipts administered by other federal agencies. |
| `RFB_Administered_Revenue_BRL_2025` | Same UF file, excluding the column `ADMINISTRADAS POR OUTROS ÓRGÃOS`. Includes taxes, social-security contributions and other RFB-administered receipts. |
| `Federal_Transfers_Received_BRL_2025` | CGU transfers to recipients located in the UF, January–December. Includes constitutional transfers/royalties and legal, voluntary and specific transfers, across recipient types. |
| `Federal_Transfers_To_Public_Administration_BRL_2025` | Subset with recipient type beginning `Administração Pública`: state/DF, municipal, and the source's generic public-administration category. |
| `Transfers_Per_BRL_Federal_Revenue_2025` | All recorded transfers to the UF / all recorded federal revenue in that UF. Rounded to four decimals. |
| `Public_Admin_Transfers_Per_BRL_RFB_Revenue_2025` | Transfers to public-administration recipients / RFB-administered revenue in that UF. This alternative uses a narrower recipient and revenue scope. Rounded to four decimals. |
| `Poverty_Pct_2024` | Percentage of people below USD 6.85 per day at 2017 purchasing-power parity (PPP), as published in IBGE SIS 2025, Table 2.18, 2024 tab. Includes extreme poverty. |
| `Extreme_Poverty_Pct_2024` | Percentage below USD 2.15 per day at 2017 PPP, from the same table. A subset of poverty, not an additional group. |
| `Social_Program_Direct_Recipients_Pct_2025` | Percentage of residents reporting income from government social programs, including Bolsa Família, BPC and other programs. SIDRA 7426, variable 10925, category 79216. Counts direct income recipients, not everyone in their households. |
| `Retirement_Pension_Recipients_Pct_2025` | Percentage of residents reporting retirement/pension income, the separate published income category in SIDRA 7426, variable 10925, category 49208. It is not classified as social-program income in this file. |
| `Resident_Population_PNAD_2025` | PNAD annual resident population, SIDRA 6786, variable 606, total sex category 6794. Published in thousands, converted to persons; precision remains approximately 1 000 people. |
| `Public_Sector_Employees_2025` | Employed people aged 14+ whose main job is in the public sector, all levels of government. SIDRA 4361, variable 4090, category 31727. Includes military/statutory employees and public employees with or without signed contracts. Published in thousands, converted to persons. |
| `Public_Sector_Employees_Pct_Population_2025` | Public-sector employees / PNAD resident population of all ages × 100, rounded to one decimal. This is a share of population, not a share of employed people. |
| `Any_Food_Insecurity_Pct_Population_2024` | Percentage of residents living in households with any food insecurity: mild, moderate or severe. SIDRA 9552, resident-percentage variable 10117, category 109099. |
| `Moderate_Food_Insecurity_Pct_Population_2024` | Residents in moderately food-insecure households, category 109101. Moderate and severe are separate severity classes. |
| `Severe_Food_Insecurity_Pct_Population_2024` | Residents in severely food-insecure households, category 109102. Used as the hunger-related indicator; it is not a clinical measure of starvation. |
| `Severe_Food_Insecurity_CV_Pct_2024` | IBGE's coefficient of variation for the severe-food-insecurity percentage, variable 10118. This measures sampling uncertainty, not another population group. |

## How to interpret the requested fiscal and social measures

**The fiscal ratios measure recorded transfers relative to recorded receipts.** They are not a complete calculation of how much a state's residents pay in taxes or receive in federal spending. Collection location can differ from the location of the people who ultimately bear a tax, including when companies pay centrally. Federal revenue includes more than narrowly defined taxes. The transfer totals also include royalties and, in the broad measure, recipients outside public administration.

The transfer series does not represent all federal spending in the state. Federal salaries, pensions, direct benefit payments, federal services, procurement and other direct spending are not comprehensively included in this numerator. This is especially relevant when interpreting Distrito Federal. Do not use these ratios alone to label a state a net fiscal donor or recipient.

**The revenue sources do not fully reconcile.** The UF download used here sums to BRL 2 855 803 678 751.48 for 2025; the separate national annual report gives approximately BRL 2 886 875 000 000. The gap is roughly 1.1%. The state figures are retained as published in the UF dataset; the difference has not been allocated to states or hidden by rescaling. The ratios therefore inherit the geographic coverage and accounting limitations of that download.

**No combined “receives government money or works for government” percentage is asserted.** Direct social-program recipients, retirement/pension recipients and public employees can overlap. Adding their percentages would double-count people. The social-program category also does not cover every possible public cash payment: for example, the published income tables group unemployment insurance with other income. Nor does counting one household's direct benefit recipient count every family member supported by that payment. A comprehensive, deduplicated measure would require a separately defined person-level analysis.

**Poverty is income poverty.** The two lines are the 2017-PPP thresholds used by this IBGE release, not current market-exchange-rate dollars. Their approximate national monthly equivalents in the 2024 publication are BRL 694 for poverty and BRL 218 for extreme poverty; the published calculation uses the survey's income and price adjustments. The figures are not the percentage eligible for, or enrolled in, Bolsa Família. SIS excludes residents classified as lodgers/boarders, live-in domestic employees and relatives of domestic employees from this household-income analysis.

**Food insecurity is measured with IBGE's Brazilian Food Insecurity Scale (EBIA).** Severe food insecurity identifies residents of households experiencing the most severe resource-related food-access restrictions during the survey reference period. It does not establish that every resident is currently starving or clinically malnourished. The file deliberately uses percentages of residents, not the different percentages of households. Population surveys principally cover residents of private households and do not fully represent people living on the street or in institutions.

Poverty, food insecurity, benefit receipt and public employment are overlapping measures with different definitions and reference periods. They must not be summed. Survey estimates are rounded to one decimal; the source counts used for the public-employment ratio are already rounded to thousands.

## Official sources and reproducible queries

All sources were accessed on 17 October 2026.

1. **GDP:** [IBGE SIDRA 5938](https://sidra.ibge.gov.br/tabela/5938), [exact GDP and published-share query](https://apisidra.ibge.gov.br/values/t/5938/n1/1/n3/all/v/37,496/p/2023). GDP per capita: [Instituto Mauro Borges/IBGE, PIB Consolidado 2023, Table 8, PDF page 22](https://goias.gov.br/imb/wp-content/uploads/sites/29/2025/11/boletim_046_2025_PIB_regional_consolidado_2023.pdf). Its footnote specifies the population table prepared for the TCU in 2023. Do not substitute the newer population denominator used in a different GDP release.
2. **Federal receipts:** [Receita Federal UF CSV](https://www.gov.br/receitafederal/dados/arrecadacao-estado.csv/@@download/file), [metadata](https://www.gov.br/receitafederal/dados/arrecadacao-estado-metadados.pdf/@@download/file), and [2025 national report for the reconciliation check](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/relatorios/arrecadacao-federal/2025/analisemensal-dez-2025.pdf). Filter `Ano=2025`; each of the 27 UFs has 12 monthly records. Structural blanks in discontinued historical categories contribute zero. Aggregate current categories once, including `RECEITA PREVIDENCIÁRIA`; do not add absent historical subcategories as if they were separate new receipts.
3. **Transfers:** [CGU Portal da Transparência monthly download page](https://portaldatransparencia.gov.br/download-de-dados/transferencias), [data dictionary](https://portaldatransparencia.gov.br/dicionario-de-dados/recursos-transferidos). Download all 12 files using `https://dadosabertos-download.cgu.gov.br/PortalDaTransparencia/saida/transferencias/2025MM_Transferencias.zip`, where `MM` is `01` through `12`. Sum `VALOR TRANSFERIDO` by recipient `UF`; retain negative adjustments. The public-administration subset uses the recipient-type filter described above. Records without a specific valid UF are excluded from state totals rather than allocated speculatively.
4. **Poverty:** [IBGE Síntese de Indicadores Sociais 2025, income tables ZIP](https://ftp.ibge.gov.br/Indicadores_Sociais/Sintese_de_Indicadores_Sociais/Sintese_de_Indicadores_Sociais_2025/Tabelas/xls/2_Distribuicao_Renda_xls.zip), `Tabela 2.18 (Pobr_Geo).xls`, sheet `2024`. Select state rows, not similarly named metropolitan areas. Table 2.23 supplies the corresponding price-adjusted poverty-line values.
5. **Benefit and pension recipients:** [SIDRA 7426](https://sidra.ibge.gov.br/tabela/7426), [2025 query](https://apisidra.ibge.gov.br/values/t/7426/n1/1/n3/all/v/10486,10925,10926/p/2025/c11308/49208,79216). See also [IBGE's 2025 income-results presentation](https://agenciadenoticias.ibge.gov.br/media/com_mediaibge/arquivos/01a76679f450b86e5fff76c6887b0b2b.pdf).
6. **Public employment and population:** [SIDRA 4361 public-employment query](https://apisidra.ibge.gov.br/values/t/4361/n1/1/n3/all/v/4090,4091/p/2025/c11913/31727) and [SIDRA 6786 population query](https://apisidra.ibge.gov.br/values/t/6786/n1/1/n3/all/v/606/p/2025/c2/6794).
7. **Food insecurity:** [SIDRA 9552](https://sidra.ibge.gov.br/tabela/9552), [2024 resident percentages, counts and CVs](https://apisidra.ibge.gov.br/values/t/9552/n3/all/v/10114,10117,10118/p/2024/c1/6795/c12404/109099,109101,109102). Domicile situation is Total (`6795`).

## Validation

- All 27 UFs have every added value; no missing observation is represented by a fabricated zero.
- Original ten electoral columns and row order are preserved.
- GDP across states agrees with the national GDP to within BRL 2 000, reflecting source rounding to thousands. Shares use the published national denominator.
- All 1 999 911 transfer records across the 12 monthly files were aggregated. Valid-UF transfers total BRL 804 845 442 867.10. Unassigned/multiple-UF records were excluded from that state sum.
- Independently retrieved CGU locality totals for Acre, Amapá, Amazonas and São Paulo agree exactly, to the cent, with the bulk-file totals.
- All 324 UF/month revenue records are unique and complete for January–December 2025.
- Poverty, employment and food-insecurity percentages were checked for valid ranges and appropriate denominators. Extreme poverty is below overall poverty in every UF; severe food insecurity is below any food insecurity.
- The CSV's 108 calculated values (four calculations per UF) were recalculated and checked before export. Each record contains 30 fields.
