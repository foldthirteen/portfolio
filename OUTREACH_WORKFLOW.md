# Outreach Workflow

This repo supports batched CV and cover-letter outreach with short anonymous tracking IDs.

## Tracking ID

Each outreach pack gets one ID:

```text
<base36>
```

Examples:

```text
k7p
3q9
```

The ID is not a person, company, or email address. It maps locally to the application documents.

## ID Allocation

Prefer linear allocation when a bot is creating outreach packs directly:

```text
001, 002, 003, ... 009, 00a, 00b, ... 00z, 010, 011, ...
```

Use lowercase base36 (`0-9`, `a-z`) and always keep the ID to three characters. Batch automation should allocate the next available ID from `covers/outreach-ledger.json`. The browser generator does the same when it has folder access; without folder access, it increments from the last ID saved in that browser.

Allocation rules:

- Read `covers/outreach-ledger.json` if it exists.
- Find the highest three-character base36 `outreach_id`.
- Increment by one and left-pad to three characters.
- If the ledger is missing or empty, start at `001`.
- Never reuse an ID for a different application pack.
- If regenerating the same pack, reuse its existing ID.

Example helper logic:

```js
const nextId = (ids) => {
  const used = ids
    .filter((id) => /^[0-9a-z]{3}$/.test(id))
    .map((id) => parseInt(id, 36));
  const next = (used.length ? Math.max(...used) + 1 : 1);
  return next.toString(36).padStart(3, "0");
};
```

## Link Format

Every CV and cover letter in the same outreach pack must use the same tracked portfolio link.

Default portfolio:

```text
https://foldthirteen.github.io/portfolio/#o=3q9
```

AI portfolio:

```text
https://foldthirteen.github.io/portfolio/?v=ai#o=k7p&jd=rtl-ai
```

Do not use raw names, emails, phone numbers, or company names in the tracking URL.

## Batch Folder Structure

Generated outreach work should live under:

```text
covers/
  batches/
    YYYY-MM-DD/
      html/
      pdf/
  reference/
    untagged-cvs/
  archive/
    legacy-pre-outreach-2026-04-26/
  outreach-ledger.json
```

`covers/` is ignored by git. The local ledger and generated PDFs do not need commits.

## Ledger Schema

`covers/outreach-ledger.json` should be a JSON array. Each outreach pack should have one entry:

```json
{
  "outreach_id": "001",
  "date": "2026-04-26",
  "job_descriptor": "rtl-ai-engineer",
  "role_heading": "RTL AI Engineer",
  "variant": "ai",
  "cv_file": "covers/batches/2026-04-26/pdf/001-rtl-ai-engineer-cv.pdf",
  "cover_letter_file": "covers/batches/2026-04-26/pdf/001-rtl-ai-engineer-cover-letter.pdf",
  "source_html": "covers/batches/2026-04-26/html/2026-04-26-rtl-ai-engineer.html",
  "portfolio_link": "https://foldthirteen.github.io/portfolio/?v=ai#o=001&jd=rtl-ai-engineer",
  "status": "draft",
  "notes": "",
  "updated_at": "2026-04-26T00:00:00.000Z"
}
```

Keep recipient emails, application notes, and private context in the ledger if needed. Do not publish or commit the ledger.

## Generator Behavior

The cover-letter generator creates a linear three-character tracking ID if one is missing and writes the tracked portfolio link into the generated cover letter.

When Chrome has folder access, it saves:

```text
covers/batches/YYYY-MM-DD/html/<generated-cover-letter>.html
covers/outreach-ledger.json
```

The ledger entry includes the expected PDF path for the cover letter, but the PDF itself still needs to be printed or exported into the matching `pdf/` folder.

The matching PDF should be saved manually into:

```text
covers/batches/YYYY-MM-DD/pdf/
```

## Bot Rules

When creating or updating an outreach pack:

- Generate or reuse exactly one outreach ID for that pack.
- For batch work, allocate IDs linearly from `covers/outreach-ledger.json`.
- Use the same outreach ID in every CV, cover letter, and portfolio link sent for that pack.
- If the pack is AI-focused, use `?v=ai#o=<id>`.
- If the pack is default/general, use `#o=<id>`.
- Use `jd=<short-label>` when you want the opportunity to be readable inside Clarity.
- For a per-application CV PDF, open the CV page with the same hash before printing, for example `cv-ai.html#o=k7p&jd=rtl-ai`. The CV page will propagate those values into its printed portfolio link.
- Update the local ledger with the role/document context.
- Name batch PDFs with the ID first, for example `001-rtl-ai-engineer-cv.pdf` and `001-rtl-ai-engineer-cover-letter.pdf`.
- Do not commit per-recipient private mapping data.
- Keep clean reference CVs in `covers/reference/untagged-cvs/` untouched.
- Move pre-tracking loose files to `covers/archive/` rather than mixing them into current batches.

## Direct Bot Generation

When a bot creates documents directly instead of using the browser generator:

1. Create or reuse `covers/batches/YYYY-MM-DD/html/` and `covers/batches/YYYY-MM-DD/pdf/`.
2. Allocate the next outreach ID from the ledger.
3. Choose `variant` (`ai` or `default`) and `job_descriptor`.
4. Build the tracked portfolio URL.
5. Update every visible portfolio link in the CV and cover letter to the tracked URL.
6. Render/export PDFs into the batch `pdf/` folder.
7. Save any HTML/source outputs into the batch `html/` folder.
8. Add or update the matching ledger entry.
9. Verify the produced PDF text or source HTML contains `#o=<id>` and, when applicable, `jd=<job_descriptor>`.

## Clarity

The portfolio reads `#o=<id>` or `?o=<id>` and sends this Clarity tag:

```text
outreach_id = <id>
```

If the link also includes `jd=<short-label>`, the portfolio sends:

```text
job_descriptor = <short-label>
```

Clarity also receives normal portfolio behavior events such as project views, service opens, portfolio filters, contact intent, and CV page views.

With opaque three-character IDs, Clarity intentionally does not know the recipient or document set. Use `covers/outreach-ledger.json` to map the ID back to the application. `job_descriptor` is intentionally a short opportunity hint for quick Clarity review, not a place for names, emails, salary notes, or private details.
