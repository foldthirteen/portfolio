"use strict";

const OUTPUT_DIR_NAME = "covers";
const DB_NAME = "coverLetterGenerator";
const DB_VERSION = 1;
const DB_STORE = "handles";
const HANDLE_KEY = "base-directory";
const STORAGE_KEYS = {
  roleDetails: "cover-letter-generator.role-details",
  roleHeading: "cover-letter-generator.role-heading",
  letterContent: "cover-letter-generator.letter-content",
  letterDate: "cover-letter-generator.letter-date"
};

const PROFILE = {
  name: "Ben Visser",
  title: "Engineering & Design",
  location: "Auckland, New Zealand",
  phone: "0226810558",
  email: "foldthirteen@gmail.com",
  websiteLabel: "foldthirteen.github.io/portfolio",
  websiteUrl: "https://foldthirteen.github.io/portfolio/"
};

const GENERIC_ROLE_LINES = new Set([
  "about the role",
  "the role",
  "role overview",
  "job overview",
  "overview",
  "summary",
  "about us",
  "about the company",
  "company overview",
  "responsibilities",
  "key responsibilities",
  "what you will do",
  "what you'll do",
  "about this role"
]);

const SALUTATION_PATTERNS = [/^dear\b/i, /^kia ora\b/i, /^hello\b/i, /^hi\b/i, /^to whom\b/i];
const SIGNOFF_PATTERNS = [/^kind regards[,]?$/i, /^regards[,]?$/i, /^best regards[,]?$/i, /^sincerely[,]?$/i, /^many thanks[,]?$/i, /^nga mihi[,]?$/i, /^cheers[,]?$/i];

const elements = {
  connectionStatus: document.querySelector("[data-connection-status]"),
  connectButton: document.querySelector('[data-action="connect-folder"]'),
  form: document.querySelector("[data-generator-form]"),
  roleDetails: document.querySelector("[data-role-details]"),
  roleHeading: document.querySelector("[data-role-heading]"),
  letterDate: document.querySelector("[data-letter-date]"),
  letterContent: document.querySelector("[data-letter-content]"),
  filenamePreview: document.querySelector("[data-filename-preview]"),
  outputPath: document.querySelector("[data-output-path]"),
  statusMessage: document.querySelector("[data-status-message]"),
  previewTitle: document.querySelector("[data-preview-title]"),
  previewFrame: document.querySelector("[data-preview-frame]"),
  generateButton: document.querySelector('[data-action="generate"]'),
  viewButton: document.querySelector('[data-action="view"]'),
  downloadButton: document.querySelector('[data-action="download"]'),
  printButtons: document.querySelectorAll('[data-action="print"]')
};

const state = {
  baseHandle: null,
  outputHandle: null,
  outputPathLabel: "",
  generatedHtml: "",
  generatedFileName: "",
  generatedTitle: "",
  currentBlobUrl: "",
  previewReady: false,
  previewStale: false,
  roleHeadingEdited: false
};

init().catch((error) => {
  console.error(error);
  setStatus("Something went wrong while loading the generator.", "error");
});

window.addEventListener("beforeunload", () => {
  if (state.currentBlobUrl) {
    URL.revokeObjectURL(state.currentBlobUrl);
  }
});

async function init() {
  hydrateDefaults();
  restoreDraft();
  syncRoleHeadingFromDetails(true);
  updateDerivedOutputs();
  renderEmptyPreview();
  bindEvents();
  renderConnectionState();
  await restoreSavedFolder();
}

function bindEvents() {
  elements.connectButton.addEventListener("click", async () => {
    await connectOutputFolder();
  });

  elements.roleDetails.addEventListener("input", () => {
    persistField(STORAGE_KEYS.roleDetails, elements.roleDetails.value);
    syncRoleHeadingFromDetails(false);
    markPreviewStale();
  });

  elements.roleHeading.addEventListener("input", () => {
    state.roleHeadingEdited = isRoleHeadingCustom();
    persistField(STORAGE_KEYS.roleHeading, elements.roleHeading.value);
    updateDerivedOutputs();
    markPreviewStale();
  });

  elements.roleHeading.addEventListener("blur", () => {
    if (!elements.roleHeading.value.trim()) {
      state.roleHeadingEdited = false;
      syncRoleHeadingFromDetails(true);
      persistField(STORAGE_KEYS.roleHeading, elements.roleHeading.value);
    }
  });

  elements.letterDate.addEventListener("input", () => {
    persistField(STORAGE_KEYS.letterDate, elements.letterDate.value);
    updateDerivedOutputs();
    markPreviewStale();
  });

  elements.letterContent.addEventListener("input", () => {
    persistField(STORAGE_KEYS.letterContent, elements.letterContent.value);
    markPreviewStale();
  });

  elements.generateButton.addEventListener("click", async () => {
    await generateLetter();
  });

  elements.viewButton.addEventListener("click", () => {
    openPreviewInNewTab();
  });

  elements.downloadButton.addEventListener("click", () => {
    downloadLetter();
  });

  elements.printButtons.forEach((button) => {
    button.addEventListener("click", () => {
      printPreview();
    });
  });

  elements.previewFrame.addEventListener("load", () => {
    state.previewReady = Boolean(state.generatedHtml) && !state.previewStale;
    updateActionState();
  });
}

function hydrateDefaults() {
  if (!elements.letterDate.value) {
    elements.letterDate.value = getLocalIsoDate();
  }
}

function restoreDraft() {
  elements.roleDetails.value = localStorage.getItem(STORAGE_KEYS.roleDetails) || "";
  elements.roleHeading.value = localStorage.getItem(STORAGE_KEYS.roleHeading) || "";
  elements.letterContent.value = localStorage.getItem(STORAGE_KEYS.letterContent) || "";
  elements.letterDate.value = localStorage.getItem(STORAGE_KEYS.letterDate) || elements.letterDate.value || getLocalIsoDate();
  state.roleHeadingEdited = isRoleHeadingCustom();
}

function persistField(key, value) {
  localStorage.setItem(key, value);
}

function isRoleHeadingCustom() {
  const manualHeading = elements.roleHeading.value.trim();
  if (!manualHeading) {
    return false;
  }
  return manualHeading !== deriveRoleHeading(elements.roleDetails.value);
}

function syncRoleHeadingFromDetails(force) {
  if (!force && state.roleHeadingEdited && elements.roleHeading.value.trim()) {
    updateDerivedOutputs();
    return;
  }

  const derivedHeading = deriveRoleHeading(elements.roleDetails.value);
  elements.roleHeading.value = derivedHeading;
  persistField(STORAGE_KEYS.roleHeading, elements.roleHeading.value);
  state.roleHeadingEdited = false;
  updateDerivedOutputs();
}

function updateDerivedOutputs() {
  const roleHeading = getResolvedRoleHeading();
  const fileName = buildFileName(elements.letterDate.value, roleHeading);
  elements.filenamePreview.textContent = fileName;
  elements.previewTitle.textContent = roleHeading ? `Preview: ${roleHeading}` : "Cover letter preview";

  if (!state.generatedFileName || state.previewStale) {
    if (state.outputPathLabel) {
      elements.outputPath.textContent = `${state.outputPathLabel}/${fileName}`;
    } else {
      elements.outputPath.textContent = "Preview only. In Chrome, choose your portfolio folder or covers/ to save automatically.";
    }
  }
}

function renderConnectionState(mode = "default") {
  if (!supportsFileSystemAccess()) {
    elements.connectionStatus.textContent = "Safari can preview and download here, but Chrome is needed for one-click saves into covers/.";
    elements.connectButton.disabled = true;
    elements.connectButton.textContent = "Use Chrome For Auto-Save";
    return;
  }

  if (mode === "connected" && state.outputPathLabel) {
    elements.connectionStatus.textContent = `Connected to ${state.outputPathLabel}.`;
    elements.connectButton.disabled = false;
    elements.connectButton.textContent = "Change Output Folder";
    if (!state.generatedFileName) {
      elements.outputPath.textContent = `${state.outputPathLabel}/${elements.filenamePreview.textContent}`;
    }
    return;
  }

  if (mode === "needs-reauthorization") {
    elements.connectionStatus.textContent = "A saved folder was found, but Chrome needs permission again before it can write into covers/.";
    elements.connectButton.disabled = false;
    elements.connectButton.textContent = "Reconnect Output Folder";
    return;
  }

  elements.connectionStatus.textContent = "In Chrome, choose your portfolio folder or the covers folder for one-click saves.";
  elements.connectButton.disabled = false;
  elements.connectButton.textContent = "Choose Output Folder";
}

function renderEmptyPreview() {
  elements.previewFrame.srcdoc = buildEmptyPreviewHtml();
  elements.previewTitle.textContent = "Cover letter preview";
}

async function restoreSavedFolder() {
  if (!supportsFileSystemAccess()) {
    return;
  }

  let savedHandle;
  try {
    savedHandle = await loadDirectoryHandle();
  } catch (error) {
    console.warn("Unable to restore saved folder handle.", error);
    return;
  }

  if (!savedHandle) {
    return;
  }

  const permissionState = await savedHandle.queryPermission({ mode: "readwrite" });
  if (permissionState !== "granted") {
    state.baseHandle = null;
    state.outputHandle = null;
    state.outputPathLabel = "";
    renderConnectionState("needs-reauthorization");
    return;
  }

  try {
    const resolved = await resolveOutputDirectory(savedHandle, true);
    state.baseHandle = savedHandle;
    state.outputHandle = resolved.outputHandle;
    state.outputPathLabel = resolved.outputPathLabel;
    renderConnectionState("connected");
  } catch (error) {
    console.warn("Unable to restore the output directory.", error);
    renderConnectionState("needs-reauthorization");
  }
}

async function connectOutputFolder() {
  if (!supportsFileSystemAccess()) {
    setStatus("Direct folder writes are not available in this browser. Use Download HTML instead.", "error");
    return false;
  }

  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    const granted = await ensurePermission(handle);

    if (!granted) {
      setStatus("Folder permission was not granted.", "error");
      return false;
    }

    const resolved = await resolveOutputDirectory(handle, true);
    state.baseHandle = handle;
    state.outputHandle = resolved.outputHandle;
    state.outputPathLabel = resolved.outputPathLabel;
    renderConnectionState("connected");

    try {
      await saveDirectoryHandle(handle);
    } catch (error) {
      console.warn("Unable to persist the folder handle for later sessions.", error);
    }

    setStatus(`Ready to save letters into ${state.outputPathLabel}.`, "success");
    return true;
  } catch (error) {
    if (error && error.name === "AbortError") {
      setStatus("Folder selection was cancelled.", "error");
      return false;
    }

    console.error(error);
    setStatus("The output folder could not be connected.", "error");
    return false;
  }
}

async function ensurePermission(handle) {
  const options = { mode: "readwrite" };
  if (await handle.queryPermission(options) === "granted") {
    return true;
  }
  return (await handle.requestPermission(options)) === "granted";
}

async function resolveOutputDirectory(baseHandle, createIfMissing) {
  if (baseHandle.name === OUTPUT_DIR_NAME) {
    return {
      outputHandle: baseHandle,
      outputPathLabel: OUTPUT_DIR_NAME
    };
  }

  const outputHandle = await baseHandle.getDirectoryHandle(OUTPUT_DIR_NAME, { create: createIfMissing });
  return {
    outputHandle,
    outputPathLabel: `${baseHandle.name}/${OUTPUT_DIR_NAME}`
  };
}

async function generateLetter() {
  const roleHeading = elements.roleHeading.value.trim();
  const letterContent = elements.letterContent.value.trim();
  const roleDetails = elements.roleDetails.value.trim();

  if (!letterContent) {
    setStatus("Paste the cover letter content before generating.", "error");
    elements.letterContent.focus();
    return;
  }

  if (!roleHeading && !roleDetails) {
    setStatus("Paste the role details or add a role heading first.", "error");
    elements.roleDetails.focus();
    return;
  }

  const documentData = buildLetterDocument();
  state.generatedHtml = documentData.html;
  state.generatedFileName = documentData.fileName;
  state.generatedTitle = documentData.title;
  state.previewStale = false;
  state.previewReady = false;

  setPreviewHtml(documentData.html);
  setBlobUrl(documentData.html);
  elements.outputPath.textContent = state.outputPathLabel
    ? `${state.outputPathLabel}/${documentData.fileName}`
    : "Preview ready. In Chrome, choose your portfolio folder or covers/ to save automatically.";

  if (state.outputHandle) {
    try {
      await writeGeneratedFile(documentData.fileName, documentData.html);
      setStatus(`Saved ${documentData.fileName} to ${state.outputPathLabel}.`, "success");
    } catch (error) {
      console.error(error);
      if (error && error.name === "NotAllowedError") {
        state.baseHandle = null;
        state.outputHandle = null;
        renderConnectionState("needs-reauthorization");
      }
      setStatus("The preview was generated, but saving to the folder failed. You can still download the HTML.", "error");
    }
  } else {
    setStatus("Preview ready. In Chrome, choose your portfolio folder or covers/ for one-click saves, or use Download HTML.", "success");
  }

  updateActionState();
}

function buildLetterDocument() {
  const roleHeading = getResolvedRoleHeading() || "Cover Letter";
  const fileName = buildFileName(elements.letterDate.value, roleHeading);
  const title = `${PROFILE.name} - Cover Letter - ${roleHeading}`;
  const html = buildCoverLetterHtml({
    title,
    roleHeading,
    dateLabel: formatLetterDate(elements.letterDate.value),
    letterContent: elements.letterContent.value
  });

  return {
    fileName,
    html,
    title
  };
}

async function writeGeneratedFile(fileName, html) {
  const fileHandle = await state.outputHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(html);
  await writable.close();
}

function setPreviewHtml(html) {
  elements.previewFrame.srcdoc = html;
}

function setBlobUrl(html) {
  if (state.currentBlobUrl) {
    URL.revokeObjectURL(state.currentBlobUrl);
  }
  state.currentBlobUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
}

function openPreviewInNewTab() {
  if (!canUseGeneratedLetter()) {
    return;
  }

  const previewWindow = window.open(state.currentBlobUrl, "_blank", "noopener,noreferrer");
  if (!previewWindow) {
    setStatus("The preview tab was blocked by the browser. Allow pop-ups for this page and try again.", "error");
  }
}

function printPreview() {
  if (!canUseGeneratedLetter()) {
    return;
  }

  const previewWindow = elements.previewFrame.contentWindow;
  if (!previewWindow) {
    setStatus("The preview is not ready to print yet.", "error");
    return;
  }

  previewWindow.focus();
  previewWindow.print();
}

function downloadLetter() {
  if (!canUseGeneratedLetter()) {
    return;
  }

  const downloadLink = document.createElement("a");
  downloadLink.href = state.currentBlobUrl;
  downloadLink.download = state.generatedFileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
}

function canUseGeneratedLetter() {
  if (!state.generatedHtml || state.previewStale) {
    setStatus("Generate the letter first so the preview and file stay in sync.", "error");
    return false;
  }
  return true;
}

function markPreviewStale() {
  updateDerivedOutputs();
  if (!state.generatedHtml) {
    updateActionState();
    return;
  }

  state.previewStale = true;
  state.previewReady = false;
  setStatus("Inputs changed. Generate again to refresh the preview and saved file.", "info");
  updateActionState();
}

function updateActionState() {
  const ready = Boolean(state.generatedHtml) && state.previewReady && !state.previewStale;
  elements.viewButton.disabled = !ready;
  elements.downloadButton.disabled = !ready;
  elements.printButtons.forEach((button) => {
    button.disabled = !ready;
  });
}

function getResolvedRoleHeading() {
  return elements.roleHeading.value.trim() || deriveRoleHeading(elements.roleDetails.value) || "Cover Letter";
}

function deriveRoleHeading(roleDetails) {
  const lines = normalizeText(roleDetails)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return "";
  }

  for (const line of lines) {
    const structuredMatch = line.match(/^(job title|role|position|title)\s*[:\-]\s*(.+)$/i);
    if (structuredMatch && structuredMatch[2]) {
      return clampHeading(structuredMatch[2]);
    }
  }

  for (const line of lines) {
    const lowered = line.toLowerCase().replace(/[:\-]+$/, "");
    if (!GENERIC_ROLE_LINES.has(lowered)) {
      return clampHeading(line.replace(/^[*\-\u2022]+\s*/, ""));
    }
  }

  return clampHeading(lines[0]);
}

function clampHeading(text) {
  return text.trim().slice(0, 90).trim();
}

function buildFileName(dateValue, roleHeading) {
  const dateStem = dateValue || getLocalIsoDate();
  const slug = slugify(roleHeading) || "cover-letter";
  return `${dateStem}-${slug}.html`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

function formatLetterDate(dateValue) {
  const isoDate = dateValue || getLocalIsoDate();
  const parsedDate = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(parsedDate);
}

function getLocalIsoDate() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 10);
}

function buildCoverLetterHtml({ title, roleHeading, dateLabel, letterContent }) {
  const letterParts = parseLetterContent(letterContent);
  const titleHtml = escapeHtml(title);
  const roleHeadingHtml = escapeHtml(roleHeading);
  const dateHtml = escapeHtml(dateLabel);
  const salutationHtml = renderParagraph("cl-salutation", letterParts.salutation);
  const bodyParagraphs = letterParts.bodyParagraphs.map((paragraph) => renderParagraph("cl-para", paragraph)).join("\n        ");
  const signoffHtml = renderParagraph("cl-sign__farewell", letterParts.farewell);
  const signoffNameHtml = renderParagraph("cl-sign__name", letterParts.name);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleHtml}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ff-display: "Space Grotesk", Georgia, sans-serif;
      --ff-body: "Crimson Pro", Georgia, serif;
      --color-bg: #ffffff;
      --color-text: #111111;
      --color-muted: #505050;
      --color-rule: #c0c0c0;
      --fs-name: clamp(2rem, 5vw, 2.6rem);
      --fs-label: clamp(0.58rem, 1.2vw, 0.72rem);
      --fs-head: clamp(0.62rem, 1.3vw, 0.76rem);
      --fs-body: clamp(0.75rem, 1.38vw, 0.87rem);
      --fs-small: clamp(0.56rem, 1.05vw, 0.66rem);
    }

    html { font-size: 16px; }

    body {
      margin: 0;
      padding: 48px 16px;
      background: #e8e8e8;
      color: var(--color-text);
      font-family: var(--ff-body);
      line-height: 1.5;
    }

    .cv-toolbar {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      height: 44px;
      padding: 0 20px;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-rule);
    }

    .cv-toolbar__label {
      font-family: var(--ff-display);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-muted);
    }

    .cv-toolbar__btn {
      font-family: var(--ff-display);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text);
      border: 1px solid var(--color-text);
      border-radius: 3px;
      background: none;
      padding: 5px 12px;
      cursor: pointer;
    }

    .cv-page {
      display: flex;
      flex-direction: column;
      min-height: 257mm;
      max-width: 794px;
      margin: 0 auto;
      padding: 28px 32px 32px;
      background: var(--color-bg);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }

    .cv-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid var(--color-text);
    }

    .cv-header__right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
    }

    .cv-header__name {
      font-family: var(--ff-display);
      font-size: var(--fs-name);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .cv-header__title {
      font-family: var(--ff-display);
      font-size: var(--fs-label);
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      text-align: right;
    }

    .cv-header__contact {
      font-size: var(--fs-small);
      color: var(--color-muted);
      text-align: right;
      letter-spacing: 0.02em;
    }

    .cv-header__contact a {
      color: inherit;
      text-decoration: underline;
    }

    .cl-content {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding-top: 16px;
    }

    .cl-meta__date {
      margin-bottom: 12px;
      font-family: var(--ff-display);
      font-size: var(--fs-small);
      color: var(--color-muted);
      letter-spacing: 0.04em;
    }

    .cl-meta__role {
      padding-bottom: 4px;
      border-bottom: 1px solid var(--color-rule);
      font-family: var(--ff-display);
      font-size: var(--fs-head);
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text);
    }

    .cl-body {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 14px;
    }

    .cl-salutation,
    .cl-para,
    .cl-sign__farewell,
    .cl-sign__name {
      font-size: var(--fs-body);
    }

    .cl-salutation {
      color: var(--color-text);
    }

    .cl-para {
      color: var(--color-muted);
      line-height: 1.62;
    }

    .cl-sign {
      margin-top: auto;
      padding-top: 18px;
      color: var(--color-muted);
      line-height: 1.8;
    }

    .cl-sign__name {
      margin-top: 2px;
      font-family: var(--ff-display);
      font-weight: 700;
      color: var(--color-text);
    }

    @media print {
      .cv-toolbar { display: none; }
      html, body { height: 100%; margin: 0; padding: 0; background: none; }
      .cv-page { min-height: 270mm; max-width: none; margin: 0; padding: 0; box-shadow: none; }
      @page { size: A4; margin: 12mm 15mm; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }

    @media (max-width: 640px) {
      body { padding: 8px; }
      .cv-page { min-height: 0; padding: 16px; }
      .cv-header { align-items: start; flex-direction: column; }
      .cv-header__right { align-items: start; }
      .cv-header__title, .cv-header__contact { text-align: left; }
      .cv-toolbar__label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
  </style>
</head>
<body>
  <nav class="cv-toolbar">
    <span class="cv-toolbar__label">${titleHtml}</span>
    <button class="cv-toolbar__btn" type="button" onclick="window.print()">Print / Save as PDF</button>
  </nav>

  <div class="cv-page">
    <header class="cv-header">
      <h1 class="cv-header__name">${escapeHtml(PROFILE.name)}</h1>
      <div class="cv-header__right">
        <span class="cv-header__title">${escapeHtml(PROFILE.title)}</span>
        <p class="cv-header__contact">${escapeHtml(PROFILE.location)} &nbsp;&middot;&nbsp; ${escapeHtml(PROFILE.phone)} &nbsp;&middot;&nbsp; ${escapeHtml(PROFILE.email)} &nbsp;&middot;&nbsp; <a href="${escapeAttribute(PROFILE.websiteUrl)}">${escapeHtml(PROFILE.websiteLabel)}</a></p>
      </div>
    </header>

    <div class="cl-content">
      <div class="cl-meta">
        <p class="cl-meta__date">${dateHtml}</p>
        <p class="cl-meta__role">${roleHeadingHtml}</p>
      </div>

      <div class="cl-body">
        ${salutationHtml}
        ${bodyParagraphs}
      </div>

      <div class="cl-sign">
        ${signoffHtml}
        ${signoffNameHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function parseLetterContent(rawText) {
  const paragraphs = normalizeText(rawText)
    .split(/\n\s*\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  let salutation = "Dear Hiring Team,";
  let farewell = "Kind regards,";
  let name = PROFILE.name;

  if (paragraphs.length && isSalutation(paragraphs[0])) {
    salutation = paragraphs.shift();
  }

  if (paragraphs.length >= 2) {
    const possibleFarewell = paragraphs[paragraphs.length - 2];
    const possibleName = paragraphs[paragraphs.length - 1];

    if (isSignoff(possibleFarewell) && isNameLine(possibleName)) {
      farewell = possibleFarewell;
      name = possibleName;
      paragraphs.splice(-2, 2);
    }
  }

  if (paragraphs.length) {
    const lastParagraphLines = paragraphs[paragraphs.length - 1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lastParagraphLines.length >= 2 && isSignoff(lastParagraphLines[0]) && isNameLine(lastParagraphLines[1])) {
      farewell = lastParagraphLines[0];
      name = lastParagraphLines[1];
      const remainingLines = lastParagraphLines.slice(2).join("\n");

      if (remainingLines) {
        paragraphs[paragraphs.length - 1] = remainingLines;
      } else {
        paragraphs.pop();
      }
    }
  }

  return {
    salutation,
    bodyParagraphs: paragraphs,
    farewell,
    name
  };
}

function isSalutation(text) {
  return SALUTATION_PATTERNS.some((pattern) => pattern.test(text.trim()));
}

function isSignoff(text) {
  return SIGNOFF_PATTERNS.some((pattern) => pattern.test(text.trim()));
}

function isNameLine(text) {
  const value = text.trim();
  if (!value || value.length > 48 || /[.!?]/.test(value)) {
    return false;
  }

  const words = value.split(/\s+/);
  return words.length >= 1 && words.length <= 5;
}

function renderParagraph(className, text) {
  return `<p class="${className}">${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
}

function buildEmptyPreviewHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      color-scheme: light;
      font-family: "Space Grotesk", sans-serif;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 32px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.95)),
        #f4efe6;
      color: #1a1815;
    }

    article {
      max-width: 32rem;
      padding: 28px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.86);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      text-align: center;
    }

    p {
      margin: 0;
      line-height: 1.6;
      font-family: "Crimson Pro", Georgia, serif;
      font-size: 1.05rem;
      color: #5f584e;
    }

    strong {
      display: block;
      margin-bottom: 10px;
      font-family: "Space Grotesk", sans-serif;
      font-size: 0.78rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #9a6b25;
    }
  </style>
</head>
<body>
  <article>
    <strong>Live Preview</strong>
    <p>Generate a letter to see the finished HTML page here, then open it in a new tab or print it straight to PDF.</p>
  </article>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function normalizeText(value) {
  return String(value || "").replace(/\r\n?/g, "\n");
}

function setStatus(message, tone) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.dataset.tone = tone;
}

function supportsFileSystemAccess() {
  return "showDirectoryPicker" in window;
}

async function openHandleDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) {
        request.result.createObjectStore(DB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveDirectoryHandle(handle) {
  const db = await openHandleDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_STORE, "readwrite");
    transaction.objectStore(DB_STORE).put(handle, HANDLE_KEY);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function loadDirectoryHandle() {
  const db = await openHandleDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_STORE, "readonly");
    const request = transaction.objectStore(DB_STORE).get(HANDLE_KEY);

    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}
