# Link Builder Rules (Registration & Rumi)

Registration link
- Base: use your live web form URL.
- Append params:
  - utm_source=whatsapp
  - utm_medium=bot
  - utm_campaign={flow_id}
  - utm_content={source_tag}
  - phone={phone}
  - role={role}
  - city={city}
  - school={school}
  - grade={grade}
  - subject={subject}
  - page={page}
- Example:
  https://example.com/register?utm_source=whatsapp&utm_medium=bot&utm_campaign=lp_gen&utm_content=qr_math&page=45&grade=4&subject=Math&phone=923001234567&role=teacher&city=Lahore&school=ABC%20School

Rumi link
- Base: your Rumi entry URL.
- Append params:
  - phone={phone}
  - role={role}
  - city={city}
  - school={school}
  - source={flow_id}
- Example:
  https://example.com/rumi?source=rumi&phone=923001234567&role=teacher&city=Lahore&school=ABC%20School

Notes
- URL-encode all parameter values.
- If the web form supports prefill, map these parameters to form fields; otherwise still pass for attribution.
- Preserve source_tag/utm_content from the entry payload (e.g., QR code label, campaign code).

