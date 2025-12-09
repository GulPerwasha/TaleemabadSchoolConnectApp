# State Machine Spec (Unified Multi-Channel Educator Funnel)

Key: phone = primary key; flow_id = entry tag (app_lp, web_reg, lp_gen, rumi).

States
- new → welcomed → role_captured → value_sent → micro_engaged → lead_partial → lead_complete → registration_prompted → registration_clicked → registration_confirmed → rumi_redirected → inactive → stopped

Entry
- On entry (flow_id set from source tag):
  - Send `welcome`.
  - If role known: send first value block for the flow.
  - If role unknown: either ask role first OR send first value then ask role (A/B configurable).

Value and micro-engagement
- After role captured: send first value block (flow-specific).
- After value_sent: ask suitability / next-step micro question (grade/subject/page).
- Allow up to 2 value drops before re-prompting registration.

Lead capture gate
- Before `registration_prompted`, ensure role + school + city captured; phone auto.
- If missing fields: prompt missing one-by-one (role_selection, city_capture, school_capture).

Registration path
- After lead_complete: send `registration_cta`; set state registration_prompted; schedule nudges (n1, n2, n3).
- On link click (if trackable): state registration_clicked.
- On confirmation webhook/pixel (if available): state registration_confirmed; cancel nudges; optionally send success/thank-you.

Rumi path
- Entry via flow_id=rumi or payload: send rumi_preview + Open Rumi.
- Ensure lead fields captured/confirmed; send Rumi link with params; state rumi_redirected.
- Keep reminders unless user stops.

Inactivity and stop
- Nudges: n1 at 30–60m, n2 at 24h, n3 at 48–72h after registration_prompted.
- After n3 with no response: state inactive.
- Opt-out keywords (stop/unsubscribe/quit): state stopped; cancel timers; send opt_out.

Per-flow first-value blocks
- app_lp: lp_sample (Grade/Subject/Page) + optional training_tip.
- web_reg: starter_pack preview.
- lp_gen: lp_sample generated from provided page/grade/subject; variant_prompt for easier/harder.
- rumi: rumi_preview (short answer) + Open Rumi; secondary more_lp keeps them engaged.

Guards and fallbacks
- Role: buttons + numeric fallback; free-text mapping if needed.
- City: buttons; if city_other then free-text capture.
- School: enforce length >= 3 chars; reprompt if too short.
- Throttle: max_value_drops_before_reprompt = 2.

Events to emit (for analytics/logs)
- entry_received, welcome_sent, role_captured, value_sent(type), micro_action(selected), field_captured(field), registration_prompted, registration_link_clicked, registration_confirmed, rumi_redirected, nudge_sent(n), stop_received.

