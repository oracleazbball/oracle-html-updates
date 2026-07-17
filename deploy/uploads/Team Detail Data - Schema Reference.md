# Team Detail Data — Schema Reference

`team_detail_data.json` is an array of 247 objects, one per team (168 Section 7 + 79 qualifier-only). Hand this straight to Claude Design as the data source for the team detail page.

## Top-level fields
- `team`, `state` — identity
- `made_section_7` — true/false. Use this to show a "Qualifier only" badge on teams that didn't advance.
- `bracket`, `bracket_tier` — their pool. Qualifier-only teams show `"Qualifier (pool name)"`.
- `record` — e.g. `"3-1"`
- `overall_rank` / `total_teams` — rank out of all 247, by Rating

## `headline` — cross-bracket safe, show these first/prominently
Every metric here can be validly compared against *any* other team in the dataset, regardless of bracket. This is the "top of the page" section.
- `rating`, `waa`, `adj_rpi`, `adj_sos`, `adj_net`, `adj_off`, `adj_def`, `best_win`

## `bracket_context` — bracket-relative only, put behind a click/expand
These are only meaningful compared to bracket-mates — do not let a UI place these next to another team's bracket_context numbers without a label making that clear.
- `bracket_rank` — e.g. `"3 of 16"`
- `bracket_strength_note` — plain-language line on how tough the bracket is (safe to display directly, e.g. "strong bracket")
- `rpi`, `sos`, `adj_off_plain`, `adj_def_plain`, `adj_net_plain`

## `ppg` / `papg`
Raw scoring, no bracket adjustment either way — fine to show anywhere, just don't imply cross-bracket comparability.

## `schedule`
Full game list (both Section 7 and qualifier games, for teams that played both). Each entry:
- `event` ("Section 7" or "Qualifier"), `date`, `court`
- `opponent`, `opponent_state`
- `team_score`, `opponent_score`, `result`, `margin`
- `forfeit` — true for the 5 forfeited games league-wide. If true, still show it in the schedule (for completeness) but don't use it to imply anything about performance — these were excluded from every rating.

## Notes
- Monument Valley is a special case: `made_section_7` is true, but their `headline` numbers reflect Section 7 only — their qualifier games are in `schedule` but were not used to boost their rating (see project notes on why).
- Rincon University and North are **not present** in this dataset — every one of their games was a forfeit, leaving no real data to rate them on.
