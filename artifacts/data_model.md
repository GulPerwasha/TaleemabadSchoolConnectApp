# Data Model (Lean, Sheet/Airtable Friendly)

Lead (primary key: phone)
- phone (string, required, auto from WhatsApp)
- role (enum: teacher/principal/owner; optional until captured)
- name (string, optional)
- school (string, required before registration push)
- city (string, required before registration push)
- grade (string, optional)
- subject (string, optional)
- page (string, optional)
- flow_id (string: app_lp | web_reg | lp_gen | rumi)
- source_tag / utm_content (string)
- utm_campaign (flow_id)
- utm_source (whatsapp), utm_medium (bot) defaults
- consent_opt_out_flag (bool)
- timestamps: first_seen_at, role_captured_at, lead_complete_at, registration_prompted_at, registration_clicked_at, registration_confirmed_at, rumi_redirected_at, last_nudge_at, stopped_at

Session (optional if platform auto-handles state)
- phone
- flow_id
- state (one of state machine)
- missing_fields (array of required fields not yet captured)
- last_block_sent
- last_interaction_at

Event Log (append-only)
- id (auto)
- phone
- flow_id
- type (entry_received | welcome_sent | role_captured | value_sent | micro_action | field_captured | registration_prompted | registration_link_clicked | registration_confirmed | rumi_redirected | nudge_sent | stop_received)
- payload (value_type, nudge_num, link, field_name/value, button_payload)
- timestamp

Handoff Payload (to web form / Rumi)
- phone, role, school, city, flow_id, source_tag/utm_content, utm_campaign, grade, subject, page.

