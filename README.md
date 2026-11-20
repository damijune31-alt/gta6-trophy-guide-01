# Leonida Legend — GTA 6 Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/damijune31-alt/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/damijune31-alt/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An entry for [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01) on [make.fun](https://make.fun/).

## What it is

An offline web app that guides you to the GTA VI platinum on PlayStation 5 — all 55 official trophies (1 Platinum, 2 Gold, 6 Silver, 46 Bronze), each with its official name, description and grade, plus a guide in our own words that cites its sources.

- **Tracker**: checklist saved in the browser (localStorage), with export to a file and import back. Progress bar and per-grade counts (P/G/S/B) up top.
- **Guide pane**: click any trophy to see its full guide, its sources, its PSN target where PSN tracks one, and its roadmap stage — beside the checklist.
- **Filters**: by kind (story, missable, collectibles, activities), by grade, by search, and hide-earned.
- **Spoiler setting**: hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the platinum**: five stages in order — story, strangers & choices, activities & skills, collectibles & counts, cleanup & platinum.
- **Missables flagged**: 12 trophies tied to a single story moment or a setup you can fail, each with what to do. Story chapter and mission trophies cannot be missed.

## Sources

Official names, descriptions and grades: the official PS5 list on [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/). PSN counts and targets: [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi). Every guide is our own words, written from the official description only, and not yet checked in the game — where a place is not pinned down, the guide says so.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

The app is plain static files under `app/` with no build step and fetches nothing over the network. No Rockstar logo or artwork — the look is our own.
