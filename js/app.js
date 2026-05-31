/**
 * app.js — Wires controls to theory engine and fretboard renderer.
 */

document.addEventListener("DOMContentLoaded", () => {
  const {
    NOTES, NOTE_DISPLAY, STANDARD_TUNING, SCALES,
    noteIndex, noteName, getScaleNoteSet, getScaleNoteInfo, getBoxPositions
  } = window.BluesTheory;

  const { renderFretboard } = window.BluesFretboard;

  // ── DOM refs ────────────────────────────────────────────────────────────
  const keySelect      = document.getElementById("key-select");
  const scaleToggle    = document.getElementById("scale-toggle");
  const scaleLabelMin  = document.getElementById("label-minor");
  const scaleLabelMaj  = document.getElementById("label-major");
  const noteBadges     = document.getElementById("note-badges");
  const formulaBadge   = document.getElementById("formula-display");
  const boxesContainer = document.getElementById("boxes-container");
  const fullBoardWrap  = document.getElementById("fullboard-wrap");
  const toggleFullBtn  = document.getElementById("toggle-full");

  // ── Populate key dropdown ──────────────────────────────────────────────
  NOTES.forEach(note => {
    const opt = document.createElement("option");
    opt.value = note;
    opt.textContent = NOTE_DISPLAY[note] || note;
    if (note === "A") opt.selected = true;
    keySelect.appendChild(opt);
  });

  // ── State ──────────────────────────────────────────────────────────────
  let currentRoot  = "A";
  let currentScale = "minorBlues";  // or "majorBlues"
  let showFull     = false;

  // ── Render everything ──────────────────────────────────────────────────
  function render() {
    const rootIdx    = noteIndex(currentRoot);
    const scaleDef   = SCALES[currentScale];
    const scaleSet   = getScaleNoteSet(rootIdx, scaleDef.intervals);
    const blueNoteIdx = ((rootIdx + scaleDef.blueInterval) % 12 + 12) % 12;
    const noteInfos  = getScaleNoteInfo(rootIdx, currentScale);

    // ── Note badge strip ───────────────────────────────────────────────
    noteBadges.innerHTML = "";
    noteInfos.forEach(n => {
      const badge = document.createElement("div");
      badge.className = "note-badge";
      if (n.isRoot) badge.classList.add("root");
      if (n.isBlue) badge.classList.add("blue");

      const nameSpan = document.createElement("span");
      nameSpan.className = "badge-name";
      nameSpan.textContent = n.name;

      const degSpan = document.createElement("span");
      degSpan.className = "badge-degree";
      degSpan.textContent = n.degree;

      badge.appendChild(nameSpan);
      badge.appendChild(degSpan);
      noteBadges.appendChild(badge);
    });

    // Formula text
    formulaBadge.textContent = scaleDef.formula;

    // ── 5 Box positions ────────────────────────────────────────────────
    boxesContainer.innerHTML = "";
    const boxes = getBoxPositions(rootIdx);

    boxes.forEach((box, i) => {
      const card = document.createElement("div");
      card.className = "box-card";

      const header = document.createElement("div");
      header.className = "box-header";

      const title = document.createElement("h3");
      title.textContent = `${box.label}`;

      const range = document.createElement("span");
      range.className = "fret-range";
      range.textContent = `Frets ${box.fretStart}–${box.fretEnd}`;

      header.appendChild(title);
      header.appendChild(range);
      card.appendChild(header);

      const fbContainer = document.createElement("div");
      fbContainer.className = "fretboard-container";
      card.appendChild(fbContainer);

      renderFretboard(fbContainer, {
        fretStart:   box.fretStart,
        fretEnd:     box.fretEnd,
        scaleNoteSet: scaleSet,
        rootNoteIdx: rootIdx,
        blueNoteIdx: blueNoteIdx,
        tuning:      STANDARD_TUNING
      });

      boxesContainer.appendChild(card);
    });

    // ── Full fretboard (frets 0–12) ────────────────────────────────────
    if (showFull) {
      fullBoardWrap.innerHTML = "";
      const fullLabel = document.createElement("h3");
      fullLabel.className = "full-label";
      fullLabel.textContent = "Full Fretboard (Frets 1–12)";
      fullBoardWrap.appendChild(fullLabel);

      const fbFull = document.createElement("div");
      fbFull.className = "fretboard-container full";
      fullBoardWrap.appendChild(fbFull);

      renderFretboard(fbFull, {
        fretStart:   1,
        fretEnd:     12,
        scaleNoteSet: scaleSet,
        rootNoteIdx: rootIdx,
        blueNoteIdx: blueNoteIdx,
        tuning:      STANDARD_TUNING
      });
    } else {
      fullBoardWrap.innerHTML = "";
    }
  }

  // ── Event listeners ────────────────────────────────────────────────────
  keySelect.addEventListener("change", e => {
    currentRoot = e.target.value;
    render();
  });

  scaleToggle.addEventListener("change", e => {
    currentScale = e.target.checked ? "majorBlues" : "minorBlues";
    scaleLabelMin.classList.toggle("active", !e.target.checked);
    scaleLabelMaj.classList.toggle("active",  e.target.checked);
    render();
  });

  toggleFullBtn.addEventListener("click", () => {
    showFull = !showFull;
    toggleFullBtn.textContent = showFull
      ? "Hide Full Fretboard"
      : "Show Full Fretboard";
    render();
  });

  // ── Initial render ─────────────────────────────────────────────────────
  scaleLabelMin.classList.add("active");
  render();
});
