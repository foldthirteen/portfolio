# Outreach Workflow

This repo supports batched CV and cover-letter outreach with short anonymous tracking IDs.

Before generating application documents, read `APPLICATION_WRITING_GUIDE.md`. Tracking correctness is not enough; batches should preserve the canonical CV's proof and make cover letters feel human, specific, and grounded in the employer's real problem.

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

## Writing Standard

Use `APPLICATION_WRITING_GUIDE.md` as the local standard for CV and cover-letter quality.

Default posture:

- Preserve the canonical CV unless there is a clear reason to tailor it.
- Use only the approved one-column CV sources for generated application CVs:
  - `cv-ai.html` for software, AI, systems, data, automation, engineering leadership, and general technical roles.
  - `cv-gamedev.html` only for explicitly game-development, gameplay, Unity, or senior game programmer roles.
- Do not use `cv.html`, `cv-upwork.html`, `variants/data-migration/cv.html`, multi-column CV layouts, or reference PDFs that render with a blank first page as batch CV sources.
- Prefer selecting and reordering existing strong bullets over rewriting.
- Keep metrics, named projects, clients, shipped outcomes, firsts, and turnaround stories.
- Treat cover letters as human, role-specific responses grounded in the employer's real problem, not generic fit summaries.
- For each application, write a short pain and human-angle brief before drafting.
- Draft the cover letter in plain text first when tone matters; generate HTML and PDFs only after the prose passes the voice review in `APPLICATION_WRITING_GUIDE.md`.
- After the pack is complete, run a fresh review pass as if someone else wrote it.
- Review each application before moving on to the next full set of documents.

If a batch process needs a script, add or update a reusable tracked script. Do not create a one-off temporary batch generator and delete it unless the user explicitly asks for disposable automation.

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
- For a per-application CV PDF, start from the approved one-column source and update its visible portfolio link to the tracked URL before printing, for example `cv-ai.html#o=k7p&jd=rtl-ai`.
- Update the local ledger with the role/document context.
- Internal draft/source PDFs may use the outreach ID for local mapping, for example `001-rtl-ai-engineer-cv.pdf`.
- Send-ready PDFs must not expose the outreach ID in the filename. Use clean upload filenames such as `Ben Visser - CV - Game Developer - Blind Squirrel Games.pdf` and `Ben Visser - Cover Letter - Blind Squirrel Games.pdf`.
- Do not commit per-recipient private mapping data.
- Keep clean reference CVs in `covers/reference/untagged-cvs/` untouched.
- Move pre-tracking loose files to `covers/archive/` rather than mixing them into current batches.

## Direct Bot Generation

When a bot creates documents directly instead of using the browser generator:

1. Create or reuse `covers/batches/YYYY-MM-DD/html/` and `covers/batches/YYYY-MM-DD/pdf/`.
2. Allocate the next outreach ID from the ledger.
3. Choose `variant` (`ai` or `default`) and `job_descriptor`.
4. Create the pain and human-angle brief from `APPLICATION_WRITING_GUIDE.md`.
5. Build the tracked portfolio URL.
6. Start from the approved one-column CV source (`cv-ai.html`, or `cv-gamedev.html` only for explicit game roles) and preserve its strongest proof.
7. Draft the cover letter in plain text first, using the current Rico letter as tone calibration where relevant.
8. Review the plain-text cover letter against the detailed voice rules before generating the final document.
9. Generate the cover letter HTML and update every visible portfolio link in the CV and cover letter to the tracked URL.
10. Render/export PDFs into the batch `pdf/` folder.
11. Save any HTML/source outputs into the batch `html/` folder.
12. Create clean send-ready PDF copies without the outreach ID in the filename.
13. Add or update the matching ledger entry, including both internal file paths and send-ready file paths.
14. Verify the produced PDF text or source HTML contains `#o=<id>` and, when applicable, `jd=<job_descriptor>`.
15. Verify the generated CV HTML is not a multi-column source (`grid-template-columns: 62fr 38fr`) and is not titled `Senior Gameplay Engineer` unless the job is explicitly game-development.
16. Verify the exported CV's first page is not blank.
17. Run the writing review gate from `APPLICATION_WRITING_GUIDE.md`.
18. Run the PDF export checks below.
19. Run the fresh review handoff below before delivery.

## Fresh Review Handoff

After the application pack is complete, step out of builder mode and review the finished result cold.

The reviewer mindset is:

```text
Assume the draft may be technically correct but tonally wrong.
Do not defend it.
Check whether it sounds human, specific, senior, and useful.
```

Fresh review must check:

- Whether the cover letter has a clear human angle and real reason for interest.
- Whether the opening sounds grounded rather than generic.
- Whether the employer's problem is understood without being diagnosed too bluntly.
- Whether every proof point helps this specific job.
- Whether anything sounds like AI, marketing copy, or apology.
- Whether the exported PDFs are clean and ready to send.

If the fresh review fails, return to the plain-text cover letter first. Do not continue by only tweaking HTML, formatting, or PDF output.

## PDF Export Checks

Before treating an application pack as ready:

- Confirm the cover letter PDF has no browser-generated header/footer.
- Confirm the sign-off is visible and visually balanced in the exported PDF.
- Use bottom placement for the sign-off only when it makes the whole page feel complete. If it creates a large empty gulf after the final paragraph, let the sign-off sit higher with a natural gap instead.
- Confirm the cover letter page count is acceptable; prefer one page unless the user explicitly approves a longer letter.
- Confirm the CV first page is not blank.
- Confirm the CV and cover letter PDFs both use the same tracked portfolio URL.
- Confirm the source HTML still contains the outreach ID and `jd` label.
- Confirm the send-ready upload filenames do not expose the outreach ID.

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
