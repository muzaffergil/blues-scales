/**
 * fretboard.js — Renders a guitar fretboard diagram into a DOM container.
 *
 * Usage:
 *   renderFretboard(containerEl, {
 *     fretStart,      // first fret shown (0 = open/nut)
 *     fretEnd,        // last fret shown
 *     scaleNoteSet,   // Set of note indices in the scale
 *     rootNoteIdx,    // note index of the root
 *     blueNoteIdx,    // note index of the blue note
 *     tuning          // array of 6 open-string note names (string6→string1)
 *   });
 */

const { noteAt, STANDARD_TUNING } = window.BluesTheory;

// Inlay dot positions (standard guitar markers)
const INLAY_FRETS = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21]);
const DOUBLE_INLAY = new Set([12, 24]);

function renderFretboard(container, opts) {
  const {
    fretStart = 1,
    fretEnd   = 5,
    scaleNoteSet,
    rootNoteIdx,
    blueNoteIdx,
    tuning = STANDARD_TUNING
  } = opts;

  container.innerHTML = "";

  const numFrets  = fretEnd - fretStart + 1;
  const numStrings = tuning.length; // 6

  // Wrapper
  const board = document.createElement("div");
  board.className = "fretboard";
  board.style.setProperty("--num-frets", numFrets);

  // ── Fret number labels (top row) ──────────────────────────────────────────
  const labelRow = document.createElement("div");
  labelRow.className = "fret-labels";

  // Empty corner cell above string names
  const corner = document.createElement("span");
  corner.className = "fret-label-corner";
  labelRow.appendChild(corner);

  for (let f = fretStart; f <= fretEnd; f++) {
    const lbl = document.createElement("span");
    lbl.className = "fret-label";
    lbl.textContent = f;
    if (INLAY_FRETS.has(f)) lbl.classList.add("inlay-fret");
    if (DOUBLE_INLAY.has(f)) lbl.classList.add("double-inlay-fret");
    labelRow.appendChild(lbl);
  }
  board.appendChild(labelRow);

  // ── String rows ───────────────────────────────────────────────────────────
  // tuning[0] = string 6 (low E) → rendered at top
  for (let s = 0; s < numStrings; s++) {
    const row = document.createElement("div");
    row.className = "string-row";

    // String name label
    const strLabel = document.createElement("div");
    strLabel.className = "string-label";
    const strNum = numStrings - s; // 6,5,4,3,2,1
    strLabel.textContent = strNum;
    strLabel.title = `String ${strNum} (${tuning[s]})`;
    row.appendChild(strLabel);

    // Fret cells
    for (let f = fretStart; f <= fretEnd; f++) {
      const cell = document.createElement("div");
      cell.className = "fret-cell";

      // String line (wire)
      const wire = document.createElement("div");
      wire.className = "string-wire";
      // Thicker wire for lower strings
      const thickness = 1 + (s / (numStrings - 1)) * 2.5;
      wire.style.height = `${thickness}px`;
      cell.appendChild(wire);

      // Fret bar (right edge of cell, except first fret bar is the nut)
      const bar = document.createElement("div");
      bar.className = f === fretStart && fretStart === 1
        ? "fret-bar nut"
        : "fret-bar";
      cell.appendChild(bar);

      // Inlay dot (only on the middle string visually = string 3 or 4)
      if (INLAY_FRETS.has(f) && (s === 2 || s === 3)) {
        if (!(DOUBLE_INLAY.has(f) && s === 3)) {
          const dot = document.createElement("div");
          dot.className = DOUBLE_INLAY.has(f) ? "inlay-dot double" : "inlay-dot";
          cell.appendChild(dot);
        }
      }

      // Note dot
      const nIdx = noteAt(tuning[s], f);
      const inScale = scaleNoteSet.has(nIdx);

      if (inScale) {
        const { noteName } = window.BluesTheory;
        const noteDot = document.createElement("div");
        noteDot.className = "note-dot";

        if (nIdx === rootNoteIdx) {
          noteDot.classList.add("root");
        } else if (nIdx === blueNoteIdx) {
          noteDot.classList.add("blue-note");
        }

        const span = document.createElement("span");
        span.textContent = noteName(nIdx);
        noteDot.appendChild(span);

        // Click to play tone via Web Audio
        noteDot.addEventListener("click", () => playTone(f, s));
        noteDot.title = `${noteName(nIdx)} — string ${numStrings - s}, fret ${f}`;

        cell.appendChild(noteDot);
      }

      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  container.appendChild(board);
}

// ── Web Audio tone playback ───────────────────────────────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/**
 * Play a guitar-like pluck tone for a given fret + string index.
 * Uses Karplus-Strong-ish approximation with OscillatorNode.
 */
function playTone(fret, stringIdx) {
  const ctx = getAudioCtx();

  // Standard tuning open frequencies (Hz), string 6→1
  const openFreqs = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
  const freq = openFreqs[stringIdx] * Math.pow(2, fret / 12);

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  const now  = ctx.currentTime;

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 1.2);
}

window.BluesFretboard = { renderFretboard };
