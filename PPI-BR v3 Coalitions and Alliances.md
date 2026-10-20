# PPI-BR v3: Coalitions and Alliances

Party Political Power Index for Brazil, extending v2 with a coalition and alliance layer.

Version 2 treated each party as an independent actor. In Brazil, power often comes from bloc membership: federations, formal parliamentary blocs, the government base, the opposition, and the fluid Centrão. This version adds a coalition layer on top of the v2 pools.

## Brazilian structure the layer is built on

| Alliance type | Binding? | How to model it |
| --- | --- | --- |
| **Federações partidárias** (e.g., PT-PCdoB-PV, PSOL-Rede, PSDB-Cidadania) | Hard. They must act as one bloc in Congress for at least 4 years | Merge into a single actor before any calculation |
| **Blocos parlamentares** (formal blocs in each house) | Semi-hard. They affect committee seats and leadership | Treat as high-cohesion unions |
| **Government base** | Soft. Tied to ministries, with variable loyalty | Measured by actual voting, not nominal membership |
| **Opposition / Centrão / thematic blocs** (agribusiness, evangelical, "bullets"...) | Soft and fluid | Probabilistic unions |

Electoral coalitions for proportional races (*coligações*) have been banned since 2020, so formal alliances now matter mostly after the election, which is why this layer uses measured behavior.

## Step 1: Measure alliances empirically

Build an **affinity matrix** from roll-call votes over a rolling window (e.g., the last 12 months):

```latex
a_{pq} = \frac{\text{votes where } p \text{ and } q \text{ voted the same way}}{\text{votes where both voted}} \in [0,1]
```

A bloc B (a set of parties) has a **cohesion score**, the seat-weighted average of pairwise affinity among its members:

```latex
c_B = \frac{\sum_{p \ne q \in B} d_p d_q\, a_{pq}}{\sum_{p \ne q \in B} d_p d_q}
```

A party's **loyalty to the government** is f\_p, the share of votes aligned with the government's orientation. A party holding ministries but voting against the government has a low f\_p, and the model sees that.

## Step 2: Replace Shapley-Shubik with the Owen value

Shapley-Shubik assumes every ordering of parties is equally likely, as if there were no alliances. The **Owen value** is the standard extension for players grouped into a priori unions: orderings keep each union's members together, so the index shows how an alliance changes everyone's pivot power, including the outsiders'.

```latex
C_p = (1-\lambda)\frac{d_p}{513} + \lambda \sum_q \pi_q\, \text{Ow}^{(q)}_p
```

The same applies to the Senate, with the same thresholds and π\_q weights as v2.

**Fluid alliances.** For soft blocs, treat each bloc as holding with probability c\_B and splitting otherwise:

```latex
\text{Ow}_p = \sum_{s} P(s)\,\text{Ow}_p^{(s)}
```

where s ranges over scenarios (bloc holds or breaks). For many blocs, estimate this by Monte Carlo.

**Toy example.** Three parties with 200, 150, and 163 seats, and a 257-seat quorum. Call them A, B, C.

- No alliances (Shapley): any two parties form a majority, so each gets **1/3**.
- A and B form a binding alliance: together they have 350 and always decide, so Owen gives **A = 0.50, B = 0.50, C = 0**.
- The A-B alliance holds 70% of the time (c = 0.7): **A = 0.45, B = 0.45, C = 0.10**.

C's power falls from 33% to 10% because of an alliance it isn't part of. Seat counts alone would never show that.

## Step 3: Loyalty-weighted governability

In v2, Γ used the nominal size of the governing coalition. Now it uses delivered votes:

```latex
\Gamma = \min\!\left(1,\; \frac{\sum_{p \in \text{Gov}} f_p\, d_p}{257}\right)
```

A nominal 330-seat base with 60% average loyalty delivers about 198 votes, so Γ ≈ 0.77. The executive pool then shifts toward Congress by that gap through E\*\_p = ΓE\_p + (1−Γ)C\_p.

## Step 4: Coalition-level power and synergy

Compute the PPI of a bloc as a single actor, using its pooled seats, offices, and posts, discounted by cohesion:

```latex
PPI_B^{\text{joint}} = c_B \cdot PPI(\text{pooled holdings}) + (1-c_B)\sum_{p\in B} PPI_p
```

Then measure the **synergy**, the power the alliance creates (or destroys) beyond the sum of its parts:

```latex
\text{Syn}_B = PPI_B^{\text{joint}} - \sum_{p \in B} PPI_p
```

Synergy is large when pooling pushes the bloc across a threshold (257, 308, 342, or the 206 blocking minority) and near zero when it doesn't.

**Splitting the bloc's power among members.** Each member gets a share σ\_{p|B}, its Shapley value inside the bloc's own game. This rewards the member whose defection would sink the bloc, not just the one with the most seats.

```latex
PPI^{\text{coal}}_p = PPI_p + \sum_{B \ni p} m_{pB}\,\sigma_{p|B}\,\text{Syn}_B
```

where m\_{pB} ∈ \[0,1\] is how fully p belongs to bloc B (1 for federation members, lower for fringe or fickle allies, with Σ\_B m\_{pB} ≤ 1 so a party can't be fully in two blocs).

## Step 5: Renormalize

Synergies can be positive or negative, so the scores no longer sum to 1. Restore that:

```latex
PPI^*_p = \frac{PPI^{\text{coal}}_p}{\sum_q PPI^{\text{coal}}_q}
```

This keeps the index a true share of 100% and keeps parties comparable.

## New diagnostics

| Metric | Formula / meaning |
| --- | --- |
| **Bloc power** | PPI\_B^joint, plus which thresholds it clears (majority, 3/5, 2/3, blocking minority) |
| **Kingmaker score** | Σ\_q π\_q Ow\_p, the pivot power of party p inside the bloc structure |
| **Defection cost** | PPI\_B − PPI\_{B∖p}, the power a bloc loses if p leaves |
| **Defection price** | The ministries or amendments that would keep a swing party in, estimated from its defection cost |
| **Centrão premium** | Owen-based power minus seat-share power for the swing bloc |
| **Effective number of blocs** | 1 / Σ PPI\_B², comparing fragmentation of parties vs. of blocs |

The defection cost and price metrics capture the transactional politics of *presidencialismo de coalizão*: a 40-seat party can have a lot of power if the governing bloc is 20 votes short of 308.

## Calibration and limits

- **Time dependence.** Alliances shift with each government, election cycle, and big vote (the Chamber presidency election, for instance, reshuffles blocs). Recompute a\_pq on a rolling window, and consider a faster window for the Chamber than the Senate.
- **Issue dependence.** One affinity matrix can hide that blocs differ on economic, social, and fiscal votes. A fuller model would keep a separate a\_pq per issue area and weight each by its importance.
- **Party switching.** Federations and the loss of seats after switching (*infidelidade partidária*) limit this somewhat, but individual deputies still defect. A per-party defection rate can reduce the effective d\_p.
- **Judgment parameters.** c\_B thresholds, the scenario probabilities, and the weights remain calibration choices. Backtest against known outcomes (which reforms passed, which bloc votes held) to tune them.
