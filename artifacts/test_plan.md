# QA / Test Scenarios (Minimum)

Happy paths (per flow)
- Flow A app_lp: entry -> welcome -> role teacher -> lp_sample -> training_tip -> lead capture -> registration_cta -> link click -> (optional confirm).
- Flow B web_reg: entry -> welcome -> starter_pack -> lead capture -> registration_cta -> link click -> confirm.
- Flow C lp_gen: entry with page/grade/subject -> lp_sample generated -> variant_prompt -> lead capture -> registration_cta -> link click.
- Flow D rumi: entry -> rumi_preview -> lead capture -> Open Rumi -> rumi_redirected; if not clicked, reminders sent.

Missing fields
- Skip city: bot prompts city_capture then proceeds.
- Skip school: bot prompts school_capture then proceeds.
- Role unknown: bot asks role; numeric fallback accepted.

Extra value requests
- User taps “Get another LP” twice: second LP delivered; then registration prompt shown again; throttle respected.

Variant prompt (Flow C)
- User selects Easier/Harder/Looks good -> bot adjusts message (or logs preference) and reprompts registration.

Nudges and timers
- After registration_prompted and no response: N1 at 30–60m, N2 at 24h, N3 at 48–72h, then stop (inactive).
- Clicking registration_link cancels pending nudges upon confirmation (if webhook available).

Opt-out
- User sends stop/unsubscribe/quit: bot sends opt_out, cancels nudges, no further messages. START resumes.

Rumi redirect
- Rumi link carries params (phone, role, city, school, source). Reminders continue unless stopped or confirmed by Rumi signal (if available).

Data capture/analytics
- Each event logged with type, phone, flow_id, payload; lead table updated with role/school/city and context fields.

Error/fallback handling
- Buttons fail: free-text accepted and mapped (role numeric, city other).
- School name too short (<3 chars): reprompt with hint.
- Unexpected input after stop: ignore until user sends START.

