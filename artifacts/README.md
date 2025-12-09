# Unified Multi-Channel Educator Funnel (Execution Pack)

Deliverables in this folder:
- message_catalog.csv — all copy blocks, buttons, triggers, variables, repeats.
- bot_config.yaml — flow tags, states, transitions, timers, throttles, UTMs, validation.
- state_machine.md — narrative of states, guards, per-flow first-value blocks.
- data_model.md — lead/session/event schemas and handoff payload.
- link_rules.md — exact registration/Rumi param rules with examples.
- test_plan.md — QA scenarios to validate happy paths, fallbacks, nudges, opt-out.

How to use:
1) Populate meta URLs in bot_config.yaml (registration_url, rumi_url). Swap example.com links in link_rules.md with live URLs.
2) Upload message_catalog.csv into your no-code bot builder (or map rows to its block system). Buttons and payloads are pipe-delimited.
3) Configure states/timers according to state_machine.md and bot_config.yaml (nudge timings 45m/24h/48h; throttle max 2 value drops).
4) Map UTM and prefill parameters per link_rules.md; ensure URL encoding.
5) Set lead required fields: role, school, city, phone(auto). Prompt missing fields before registration_cta.
6) Run QA using test_plan.md; verify opt-out, reminders cancel on confirm, and Rumi redirect carries params.

