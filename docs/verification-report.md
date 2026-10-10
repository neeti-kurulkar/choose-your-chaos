# Verification report: "On a serious note"

Checked on **10 October 2026**. Every item shown on the page is in
`src/data/helplines.json` with its source URL(s) and `verified` date. The page
refuses to render any item without both.

**Method.** Organisation sites were fetched directly. Several government sites
(112.gov.in, ncw.nic.in, pib.gov.in) refuse automated requests or render with
JavaScript, so those items were verified from the official pages' text as
returned by a search engine restricted to the government domains listed. A
human spot-check of the 🔶 items is recommended before user testing.

## Verified

| Item | Number / link | Source | Note |
|---|---|---|---|
| 112, Emergency Response Support System 🔶 | 112 | [PIB 188727](https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=188727), [PIB 2116557](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2116557) | Police, fire, ambulance; all states/UTs |
| 181, Women Helpline (WCD) 🔶 | 181 | [PIB 1910101](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1910101) | 24x7; links to police, One Stop Centres, hospitals, legal services; 34 states/UTs (2023) |
| NCW Helpline 🔶 | 14490, 7827170170 | [PIB 2280625](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2280625&reg=3&lang=1) (3 Jul 2026), [PIB 1739451](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1739451) | 14490 is a short code linked to 7827170170; women 18+ |
| 1091, police women helpline 🔶 | 1091 | [Delhi Police](https://traffic.delhipolice.gov.in/en/helpline-number), [NCW helplines](http://www.ncw.nic.in/helplines) | **Varies by state.** india.gov.in lists 1091 as an "Anti-Obscene Calls Cell", so the page says it isn't the same everywhere and points to 112 |
| Women Help Desks in police stations | link only | [MHA scheme page](https://www.mha.gov.in/en/commoncontent/women-help-desks-scheme) | 14,658 desks, 13,743 headed by women officers |
| Zero FIR (BNSS s.173) | — | [MHA Rajya Sabha reply](https://www.mha.gov.in/MHA1/Par2017/pdfs/par2025-pdfs/RS11122025/1182.pdf), [PIB CrPC–BNSS comparison](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/may/doc2024522337501.pdf) | Any station; electronic reporting; free FIR copy |
| NCW online complaint | ncwapps.nic.in/onlinecomplaintsv2/ | [NCW FAQ](https://www.ncw.gov.in/frequently-asked-questions-faqs-for-complaint-registration/), [NCW portal FAQ](https://ncwapps.nic.in/onlinecomplaintsv2/frmFAQs.aspx) | Anonymous complaints not usually taken up |
| National Cyber Crime Reporting Portal | cybercrime.gov.in, 1930 | [cybercrime.gov.in](https://cybercrime.gov.in/) (fetched), [PIB 2085609](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2085609&reg=3&lang=2) | Anonymous option under women/children crime; 1930 is mainly for financial fraud |
| SHe-Box | shebox.wcd.gov.in | [PIB 2049765](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2049765&reg=48&lang=2) | Relaunched 29 Aug 2024; complainant details masked |
| Internal / Local Committee (POSH Act) | — | [PIB 2227013](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2227013&reg=3&lang=1) | 10 or more employees; LC per district; 90-day inquiry. Older PIB text says "more than 10" |
| Sakhi One Stop Centres | via 181 | [PIB 1814091](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1814091) | Police, medical, legal, counselling, short-term shelter |
| Tele-MANAS | 14416, 1800 891 4416 | [PIB 2063830](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2063830&reg=48&lang=2), [PIB 2022057](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2022057&reg=48&lang=2) | Free, 24x7, ~20 languages |
| iCall (TISS) | 9152987821 | [icallhelpline.org](https://icallhelpline.org/) (fetched) | Mon–Sat, 8:00 am–9:00 pm, copied verbatim from the site; free |
| Jagori | +91 88009 96640, +91 11 2669 2700 ext 34/35 | [jagori.org](https://www.jagori.org/) (fetched) | Hours not listed on the site |
| SNEHA | +91 98922 78287 | [snehamumbai.org](https://www.snehamumbai.org/) (fetched) | Crisis line; hours not listed |
| Safecity | webapp.safecity.in | [webapp.safecity.in](https://webapp.safecity.in/) (fetched) | No phone/email on the page |
| Breakthrough India | inbreakthrough.org | [inbreakthrough.org](https://inbreakthrough.org/) (fetched) | Awareness programmes, not a helpline |

## Unverified, needs human check (left off the page)

| Item | Why it was left out |
|---|---|
| **Majlis** (Mumbai, legal support) | majlislaw.com has a certificate error and could not be fetched; services and contact details not confirmed |
| **Sakshi** (Delhi) | No official website found; only a third-party (Oxfam) profile |
| KIRAN mental health helpline | Not checked; Tele-MANAS covers this need |
| NCW WhatsApp number | Some sites say 7827170170 is also on WhatsApp; no official source found, so the page does not say so |
| "Report a wrong number" address | Dummy address support@chooseyourchaos.example (the reserved .example domain can never deliver). Replace in `helplines.json` → `reportWrongNumber` |

## Not included on purpose

- City/state filter: skipped, because only 1091 and the two city NGOs are local.
- No phone numbers appear in the scenario debrief except 112.
