# Analytics Setup

This portfolio uses GA4 plus Microsoft Clarity.

## Microsoft Clarity

- Project ID: `w93s33m3f6`
- Loader: `assets/js/clarity-loader.js`
- Event bridge: `assets/js/analytics.js`

The Clarity loader is shared by the main portfolio and CV pages. It does not send local `file://`, `localhost`, `127.0.0.1`, `0.0.0.0`, or `::1` visits by default, so local testing does not pollute the live project.

Useful query flags:

- `?clarity=off` opts the current browser out and stores that choice in `localStorage`.
- `?clarity=on` clears the opt-out and force-enables Clarity for local testing.

## Clarity Tags

The site sends these custom tags where available:

- `site`
- `page_path`
- `page_type`
- `cv_type`
- `portfolio_variant`
- `traffic_source`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- `cv_id`, `cv_version`
- `outreach_id`, `outreach_channel`
- `job_descriptor`
- `role_track`, `recipient_code`
- `active_section`
- `portfolio_filter`
- `service_area`
- `project_name`, `project_category`, `project_year`, `project_studio`
- `cv_target`
- `project_jump_target`
- `outbound_domain`, `outbound_project`
- `social_platform`
- `contact_channel`
- `contact_form_status`

## Clarity Events

The site sends event names for key behaviour:

- Section changes: `section_view_about`, `section_view_resume`, `section_view_portfolio`, `section_view_contact`
- CV views: `cv_view_general`, `cv_view_ai`, `cv_view_game_developer`, `cv_view_upwork`
- CV link clicks from the Resume section: `cv_click_<cv_target>`
- CV actions: `cv_print_<cv_type>`, `cv_portfolio_click_<cv_type>`
- Project opens: `project_view_<project_name>`
- Project outbound clicks: `project_outbound_<project_name>`
- Portfolio filters: `portfolio_filter_<filter_name>`
- Service card opens: `service_open_<service_name>`
- Project jumps from ticker/service chips: `project_jump_<project_name>`
- Contact intent: `contact_link_email`, `contact_link_phone`, `contact_form_started`, `contact_form_invalid`, `contact_form_success`, `contact_form_error`
- Social clicks: `social_click_<platform>`

## Outreach Tracking

For per-CV outreach, use pseudonymous codes instead of putting a name or email address in the URL. Keep the private mapping in the local outreach ledger.

Recommended compact format:

```text
https://foldthirteen.github.io/portfolio/cv-ai.html#o=k7p
```

Or, if you want the portfolio to open in the AI variant:

```text
https://foldthirteen.github.io/portfolio/?v=ai#o=k7p&jd=rtl-ai
```

The `#o=` value is read by JavaScript and sent to Clarity as `outreach_id`. Optional `jd=` is sent as `job_descriptor`. Hash values are not sent to the web server as part of the HTTP request.

Use opaque IDs:

```text
<base36>
```

Examples:

```text
k7p
3q9
v02
a8m
```

Private mapping example:

```text
outreach_id | document set                                | sent_to            | notes
k7p         | CV AI + cover letter, generated 2026-04-26  | person@example.com | AI engineer role
3q9         | CV default + cover letter                   | person@example.com | general software role
```

Avoid raw emails, names, phone numbers, company names, or confidential employer details in the link itself.

The cover-letter generator can create these IDs automatically as a linear three-character base36 sequence. When Chrome has write access to the output folder, it also updates:

```text
covers/outreach-ledger.json
```

The `covers/` folder is ignored by git, so this private mapping does not require a commit for each CV or cover letter.
