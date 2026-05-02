# Application Writing Guide

This guide is the writing standard for future CV and cover-letter batches.

Source references:

- Work With Indies: "This Resume Landed an Interview at Amazon in <24 Hours"  
  https://www.workwithindies.com/learn/this-resume-landed-an-interview-at-amazon-in-less-than-24-hours
- Work With Indies: "Cover Letters, Love 'em or Leave 'em?"  
  https://www.workwithindies.com/learn/cover-letters-love-em-or-leave-em

Use these as guidance, not text to copy.

## Core Principle

The CV is the evidence artifact. The cover letter is the human response artifact: it should show Ben understands the employer's real problem and has done adjacent useful work before.

Do not regenerate either casually. Start from the strongest existing proof, then select, reorder, and sharpen.

## CV Standard

Default to preserving the canonical CV and its strongest evidence:

- Metrics and large numbers.
- Named products, clients, partners, and shipped work.
- Turnaround stories: hard context plus what changed.
- Firsts: first platform, first team, first pipeline, first adoption, first production use.
- Specific technologies only where they support the achievement.
- 3-4 strong bullets per role rather than broad responsibility lists.

The CV should survive a 30-second scan. Put the most impressive proof high and make it easy to find.

Avoid:

- Rewriting from scratch just because a role is different.
- Replacing concrete proof with tailored but generic phrases.
- Listing duties instead of accomplishments.
- Removing credibility markers such as enterprise clients, funded products, shipped systems, adoption, reliability, and measurable impact.

When tailoring a CV:

1. Choose the correct approved one-column CV source.
2. Identify the job's top 3-5 requirements.
3. Select or reorder existing strong bullets to match those requirements.
4. Add only minimal new wording if a real proof point is missing or hidden.
5. Check that the tailored version is not weaker than the canonical version.

## CV Source Rules

Only the one-column CV HTML files are approved sources for generated application CVs:

- `cv-ai.html` — default for software, AI, systems, data, automation, engineering leadership, and general technical roles.
- `cv-gamedev.html` — only for explicitly game-development, gameplay, Unity, or senior game programmer roles.

Do not use these as batch CV sources:

- `cv.html`
- `cv-upwork.html`
- `variants/data-migration/cv.html`
- any multi-column CV layout
- any reference PDF that renders with a blank first page

The multi-column/public CV pages are portfolio views, not outreach-generation sources. They can lean too game-focused or render with blank/extra first pages when exported. For applications, start from the approved one-column source, apply the tracked portfolio link, and export that.

Before finalising a batch CV:

- Confirm the generated CV HTML does not contain `grid-template-columns: 62fr 38fr`.
- Confirm the generated CV title is not `Senior Gameplay Engineer` unless the job is explicitly game-development.
- Render a first-page thumbnail or otherwise verify page 1 is not blank.
- Confirm the CV and cover letter use the same outreach ID and portfolio URL.

## Cover Letter Standard

A job ad is a signal of pain, but the finished letter should not sound like a diagnosis. Use the pain analysis internally; write externally like a grounded senior engineer who understands the product, the user, and the work.

The detailed cover-letter rules below are the primary voice standard. The older pain-response framing is still useful for analysis, but it should not make the letter sound over-explicit, salesy, or AI-generated.

Use this shape:

1. Validate early: state seniority, relevant domain, or strongest fit in the first few lines.
2. Name the pain: identify what the employer appears to need fixed, built, stabilised, clarified, automated, or led.
3. Show proof: map that pain to one or two concrete Ben examples with outcomes.
4. Solve their needs directly: use a short "you need / I have done" mapping, not a broad biography.
5. Be personable: add one specific reason the role, product, team, or domain matters, without sounding generic.

Strong cover-letter logic:

```text
Your post points to <specific pain>.
I have handled a similar pattern in <specific project/context>.
The useful proof is <metric/outcome/constraint>.
That means I can help with <their likely next step>.
```

Avoid:

- Opening with only "I am applying because this role aligns with..."
- Spending the whole letter describing Ben rather than the employer's problem.
- Reusing the same proof paragraph across roles without changing the pain frame.
- Saying "good fit", "excited", or "passionate" without a specific reason.
- Hiding the strongest validation in the middle or end.

## Detailed Cover Letter Writing Rules

### Goal

Write cover letters that feel grounded, specific, senior, and human.

The letter should make the employer feel:

> This person understands what we are building, has done adjacent work before, and would be useful quickly.

Do not write a generic "I am excited to apply" cover letter.
Do not over-sell.
Do not sound like a marketing brochure.
Do not sound like AI.

### Voice

Use a friendly, crisp, confident tone.

The writing should feel:

- natural
- specific
- mature
- practical
- senior
- lightly personal
- grounded in real work

Avoid:

- hype
- corporate fluff
- exaggerated claims
- generic compliments
- over-polished phrases
- em dashes
- "passionate about"
- "thrilled to apply"
- "fast-paced environment"
- "proven track record"
- "I believe my experience makes me an ideal candidate"

Prefer plain, confident language.

Good:

> Your role stood out because it looks like a product engineering problem as much as a software one.

Bad:

> I am thrilled to apply for this exciting opportunity at your innovative company.

### Core Principle

Do not list experience just because it is impressive.

Only include details that help win this specific job.

If a background detail might make the candidate seem less aligned, reframe it around the transferable strength.

Do not say:

> While my background includes a lot of Unity and VR software...

Instead say:

> A lot of my best work has been in products where the hard part is not just getting the feature built, but making the flow feel clear to the person using it.

Frame around:

- product judgement
- UX sense
- complex workflows
- end-user empathy
- technical architecture
- reliability
- AI systems
- small-team ownership
- ability to ship

### Structure

A good cover letter should usually follow this shape:

1. **Direct opening**: who the candidate is, why this role stood out, and proof the job has been read properly.
2. **Their problem**: identify what appears hard or important about the role, using the company's signals without parroting the ad.
3. **Closest proof**: give one strong example from past work, explain why it is relevant, and focus on outcomes, complexity, and ownership.
4. **Secondary proof**: add another relevant example if useful, such as AI, tooling, web, product, data, architecture, or UX depending on the role.
5. **Why this company**: keep it grounded and explain what makes the domain or product interesting without fake enthusiasm.
6. **Close**: simple and confident, with no needy language or overdone call to action.

### Opening Rules

The first paragraph should not be generic.

It should quickly show:

- the candidate is senior
- the role has been understood
- there is a real reason for interest

Good:

> I’m a senior software engineer based in Auckland with 10+ years of experience building production software across C#, TypeScript, Python, web tools, desktop apps, mobile apps, and AI-assisted workflows.

Good:

> Your role stood out because it looks like a product engineering problem as much as a software one.

Avoid:

> I am writing to express my interest in the Senior Software Engineer position.

### Tailoring Rules

Before writing, identify the employer's real pain.

Look for:

- what they are building
- what is hard about it
- what type of person they need
- what risks they are trying to reduce
- what parts of the candidate's background map cleanly to that

Then tailor the letter around those points.

Do not tailor by keyword stuffing.

Good tailoring sounds like:

> Planning and resource consent work looks like a domain with a lot of hidden complexity. Users are dealing with technical information, process, documentation, review, versioning, and judgement. In that kind of product, small UX decisions matter.

Bad tailoring sounds like:

> I have experience with React, TypeScript, AI, UX, planning workflows, document generation, and scalable architecture.

### Evidence Rules

Use specific proof, but do not dump the whole CV.

Strong evidence includes:

- named projects
- scale
- users/clients
- complexity handled
- technologies only where relevant
- what the candidate personally owned
- why it mattered

Good:

> I led development of a multi-tenant calibration and documentation platform used by 12 New Zealand enterprise clients, including Contact Energy, Mercury, OJI Fibre Solutions, Ecolab, and Dairy Goat Co-operative.

But follow the proof with meaning:

> A lot of the work was about taking something operationally messy and making it usable enough that people could depend on it day to day.

Do not leave proof as a raw list.

### Product Engineering Emphasis

For roles involving UI, UX, workflows, tools, SaaS, internal platforms, or product teams, emphasize:

- watching how users actually work
- noticing where users get lost or frustrated
- simplifying complex workflows
- clear feedback and state
- sensible defaults
- reliability
- responsiveness
- iteration
- polish
- end-to-end ownership

Use language like:

> The hard part is not just getting the feature built, but making the flow feel clear to the person using it.

> I have spent a long time working on software where you need to watch how people actually use the thing, notice where they get lost or frustrated, and keep refining until the experience feels simple, stable, and trustworthy.

### Technical Framing

The candidate has deep technical experience, but the cover letter should not become a stack inventory.

Mention technologies only when they support the point.

Prefer:

> Underneath that, I’m comfortable working with larger architectures, data flows, services, sync, automation, analytics, and the reliability work that keeps a product solid after launch.

Instead of:

> I have experience in C#, Unity, TypeScript, Python, Vue, React, Next.js, AWS, DynamoDB, MongoDB Realm, Unisave, SQL, and Docker.

Technology lists are allowed only if:

- the role is strongly stack-specific
- the stack match is important
- the list stays short

### AI Framing

When mentioning AI, keep it practical.

Avoid sounding like an AI tourist.

Good AI framing:

> More recently, I have been building practical AI systems around structured output, retrieval, browser automation, evaluation loops, and traceable tool calls.

Good:

> I focus on making model behaviour reviewable and useful rather than just impressive in a demo.

Avoid:

> I am passionate about leveraging cutting-edge AI to revolutionize workflows.

### Startup / Small Team Framing

For small companies and startups, emphasize:

- end-to-end ownership
- pragmatic trade-offs
- working close to users
- shaping product and architecture
- comfort with ambiguity
- shipping without needing everything handed over
- improving messy systems

Good:

> I have spent much of my career in or around startups and small product teams, so I’m used to being an end-to-end problem solver.

Good:

> I like working close to the user, close to the product, and close enough to the architecture to make good trade-offs.

### What To Avoid

Avoid saying things that introduce doubt or irrelevant positioning.

Do not say:

- "Although my background is mostly..."
- "While I have not worked directly in..."
- "My background may seem unusual..."
- "I know I do not have..."
- "I am primarily a Unity developer..."

Instead, reframe toward the useful through-line.

Do not apologize for the background.
Do not explain away the background.
Lead with the relevant strength.

### Sentence Style

Keep sentences mostly medium length.

Use contractions sparingly if they sound natural.

Avoid over-stacked clauses.

Avoid too many adjectives.

Prefer concrete nouns and verbs.

Good:

> Rico sounds like the sort of environment where that would be genuinely useful.

Bad:

> Rico represents a uniquely compelling opportunity to synergize my multidisciplinary background with a rapidly scaling, mission-driven technical product team.

### Paragraph Style

Use short paragraphs.

Each paragraph should have a clear job.

Do not make the reader fight through dense blocks.

A cover letter should feel easy to skim while still having substance.

### Sign-Off Layout

The sign-off should feel intentional, not stranded.

Default to balanced page spacing:

- If the letter body is naturally short or medium length, place `Kind regards, Ben Visser` after a comfortable gap below the closing paragraph. Do not force it to the absolute bottom just to fill the page.
- If the letter body nearly fills the page, it is fine to let the sign-off sit low or near the bottom so the page feels complete.
- If the bottom-pinned sign-off leaves a large empty gulf between the final paragraph and `Kind regards`, revise the layout first. Either let the sign-off rise, slightly rebalance paragraph spacing, or tighten the letter.
- Never let the sign-off look detached from the letter, hidden, crowded, or like a footer accidentally pasted onto the page.

During visual review, judge the whole page: the final paragraph, white space, sign-off, and bottom margin should feel calm and balanced.

### Closing

The close should be simple.

Good:

> I’d be very interested in the chance to talk further.

Good:

> Kind regards,  
> Ben Visser

Avoid:

> Thank you very much for your time and consideration. I look forward to the opportunity to discuss how my skills and experience align with your needs.

### Revision Checklist

Before finalising, check:

- Does the first paragraph sound human?
- Does it show the role was actually read?
- Is the letter tailored to their real problem?
- Is every example relevant to this job?
- Is Unity/VR only mentioned if it helps?
- Is the candidate framed as a product-minded senior engineer?
- Does it avoid apologising for the background?
- Does it include proof, not just claims?
- Does it sound confident without trying too hard?
- Does it avoid generic cover letter phrases?
- Does it avoid em dashes?
- Could this plausibly have been written by Ben?

### Ben-Specific Positioning

Use these themes where relevant:

- senior software engineer in Auckland
- 10+ years production software experience
- strong C# background
- TypeScript, Python, Vue, React/Next.js where relevant
- product-minded engineer
- strong feel for UX, interaction, flow, and polish
- experienced with complex workflows and domain logic
- comfortable in startups and small teams
- end-to-end problem solver
- practical AI engineering experience
- structured output, RAG, browser automation, traceable tool calls
- COMSIM as proof of complex operational software
- SkillsVR as proof of authoring tools, AI systems, and interactive product work
- portfolio: https://foldthirteen.github.io/portfolio/

Do not overuse all themes at once. Select the ones that help most for the specific role.

### Final Standard

The finished cover letter should feel like a capable senior engineer saying:

> I understand the kind of product problem you have. I have done adjacent hard things before. I care about the user. I can own messy work and make it clear.

It should not feel like:

> I asked an AI to impress you.

### Current Tone Reference

Use the latest Rico letter as the current strongest reference for tone and structure:

```text
covers/batches/2026-05-01/html/006-rico-senior-software-engineer-cover-letter.html
```

This is not a template to copy. It is a calibration sample for the desired voice: specific, senior, practical, product-minded, and clearly written by Ben.

## Batch Workflow

Batching is fine, but do not let it become one long generation pass.

For each application, create a short pain and human-angle brief before drafting:

```text
outreach_id:
role/company:
variant:
job_descriptor:
likely pain:
human angle:
why this role actually appeals:
must-answer requirements:
best CV evidence to preserve:
best cover-letter proof:
best adjacent proof:
known gap or objection:
what to avoid sounding like:
specific personable hook:
```

Then produce documents in this order:

1. Allocate outreach ID and tracked link.
2. Read the approved one-column CV source.
3. Create the pain and human-angle brief.
4. Tailor the CV only if the pain and human-angle brief justifies it.
5. Draft the cover letter in plain text first.
6. Review the plain-text letter against the detailed voice rules before generating HTML or PDF.
7. Generate the cover letter HTML only after the prose is accepted.
8. Export PDFs and update the ledger.
9. Run the fresh review gate as a separate pass before delivery.

Do not generate five complete CVs and five complete letters before reviewing the first one. That tends to create generic, same-shaped letters.

## Fresh Review Gate

After an application pack is complete, review it as if someone else wrote it.

Do not defend the draft. Do not assume that following the steps made it good. Come in cold and ask whether the finished result would make the employer feel that Ben understands the role, has done adjacent hard work, and would be useful quickly.

Use this gate especially for important applications, product roles, senior roles, and any role where tone matters.

Fresh review questions:

- Does the letter sound like Ben, not like a generic assistant?
- Is there a clear human angle: why this role actually appeals?
- Is the opening grounded and specific?
- Does the letter understand the employer's real problem without diagnosing it too bluntly?
- Is the strongest proof relevant to this specific job?
- Is any impressive background included only because it is impressive?
- Does Unity, VR, games, or AI appear only where it helps the role?
- Does anything sound over-polished, salesy, apologetic, or inflated?
- Does the letter avoid generic cover-letter phrases and em dashes?
- Does the CV preserve Ben's strongest proof?
- Do the exported PDFs look right, with no browser header/footer, visible and well-balanced sign-off, acceptable page count, and matching tracked links?

If the fresh review finds a weak letter, revise the prose first. Do not patch around a weak draft with formatting.

## Review Gate

Before saving a batch as ready, check every application:

- Does the CV still contain Ben's strongest proof?
- Did the CV come from `cv-ai.html` or, for an explicit game role only, `cv-gamedev.html`?
- Did tailoring remove a metric, named project, shipped outcome, or credibility marker?
- Is page 1 of the exported CV non-blank?
- Can the cover letter's first paragraph only apply to this role?
- Does the letter understand the employer's real problem without sounding like a diagnosis?
- Is there a concrete bridge between their product problem and Ben's proof?
- Does the letter include the human angle: why this role genuinely appeals to Ben?
- Does the letter sound like Ben, using the Rico letter as tone calibration?
- Is the strongest evidence above the fold?
- Are gaps handled honestly without sounding apologetic?
- Does the letter avoid generic cover-letter phrases and em dashes?
- Do the CV and cover letter use the same outreach ID and tracked link?
- Does the exported cover letter have no browser header/footer, a visible and well-balanced sign-off, and an acceptable page count?

If the answer is weak, revise before export.

## Multi-Agent Use

When the user explicitly asks for agents, use them for focus and critique:

- One agent can extract the job pain and must-answer requirements.
- One agent can review the drafted CV/letter against this guide.
- The main agent should integrate and finalise; do not let separate agents create disconnected final documents.

Give every agent the same context package:

- This guide.
- The relevant canonical CV variant.
- The job ad or notes.
- The outreach ID, `jd` label, and tracked portfolio link.
- The local portfolio/project evidence that should not be lost.
