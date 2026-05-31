/**
 * theory.js — Blues scale music theory engine
 * Handles note math, scale formulas, and 5-box position calculation.
 */

const NOTES = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];

// Display labels (enharmonic alternates for ♭ keys)
const NOTE_DISPLAY = {
  "A#": "A#/B♭",
  "C#": "C#/D♭",
  "D#": "D#/E♭",
  "F#": "F#/G♭",
  "G#": "G#/A♭"
};

// Standard guitar tuning, string 6 (low E) to string 1 (high e)
const STANDARD_TUNING = ["E","A","D","G","B","E"];

// Scale intervals (semitones from root)
const SCALES = {
  minorBlues: {
    intervals: [0, 3, 5, 6, 7, 10],
    name: "Minor Blues",
    formula: "1  ♭3  4  ♭5  5  ♭7",
    degreeLabels: ["R", "♭3", "4", "♭5", "5", "♭7"],
    blueInterval: 6   // ♭5 is the "blue note"
  },
  majorBlues: {
    intervals: [0, 2, 3, 4, 7, 9],
    name: "Major Blues",
    formula: "1  2  ♭3  3  5  6",
    degreeLabels: ["R", "2", "♭3", "3", "5", "6"],
    blueInterval: 3   // ♭3 is the "blue note"
  }
};

/** Return note index (0–11) for a given note name */
function noteIndex(name) {
  return NOTES.indexOf(name);
}

/** Note name from index */
function noteName(idx) {
  return NOTES[((idx % 12) + 12) % 12];
}

/** The actual fretted note index at a given string + fret */
function noteAt(stringOpenName, fret) {
  const open = noteIndex(stringOpenName);
  return ((open + fret) % 12 + 12) % 12;
}

/**
 * Returns a Set of note indices that belong to the scale.
 * @param {number} rootIdx  - 0-based index into NOTES[]
 * @param {number[]} intervals - semitone offsets from plan
 */
function getScaleNoteSet(rootIdx, intervals) {
  return new Set(intervals.map(i => ((rootIdx + i) % 12 + 12) % 12));
}

/**
 * Returns ordered array of {name, degree, isRoot, isBlue} for a scale.
 */
function getScaleNoteInfo(rootIdx, scaleKey) {
  const scale = SCALES[scaleKey];
  const blueNoteIdx = ((rootIdx + scale.blueInterval) % 12 + 12) % 12;
  return scale.intervals.map((interval, i) => {
    const idx = ((rootIdx + interval) % 12 + 12) % 12;
    return {
      noteIdx: idx,
      name: noteName(idx),
      degree: scale.degreeLabels[i],
      isRoot: interval === 0,
      isBlue: idx === blueNoteIdx
    };
  });
}

/**
 * Calculate the 5 box positions for a given root + scale type.
 *
 * Strategy: find where the root note appears on string 6 (low E),
 * then generate 5 windows based on classic pentatonic box offsets.
 * Each window is {start, end, label}.
 *
 * Box offsets relative to root fret on string 6:
 *   Box 1: root fret        (e.g. fret 5 for A)
 *   Box 2: root fret + 3
 *   Box 3: root fret + 5
 *   Box 4: root fret + 7
 *   Box 5: root fret + 9  (→ wraps to lower octave if > 12)
 *
 * Window width: 5 frets (fretStart to fretStart+4).
 * We keep everything in frets 0–17.
 */
function getBoxPositions(rootIdx) {
  // Low-E string is "E" (index 4 in NOTES)
  const lowEIdx = noteIndex("E"); // 4
  // Semitones from low-E open to root note
  let rootFretOnLowE = ((rootIdx - lowEIdx + 12) % 12);
  // Use the first occurrence ≥ 1 fret (fret 0 = open, visually messy)
  if (rootFretOnLowE === 0) rootFretOnLowE = 12;

  // Classic box start offsets (relative to root fret)
  const offsets = [0, 3, 5, 7, 9];
  const boxLabels = ["Box 1", "Box 2", "Box 3", "Box 4", "Box 5"];

  return offsets.map((offset, i) => {
    let start = rootFretOnLowE + offset;
    // Wrap into a reasonable range (1–17)
    while (start > 17) start -= 12;
    while (start < 1)  start += 12;
    const end = start + 4;
    return {
      label: boxLabels[i],
      fretStart: start,
      fretEnd: Math.min(end, 22)
    };
  });
}

// Export for use by other modules
window.BluesTheory = {
  NOTES,
  NOTE_DISPLAY,
  STANDARD_TUNING,
  SCALES,
  noteIndex,
  noteName,
  noteAt,
  getScaleNoteSet,
  getScaleNoteInfo,
  getBoxPositions
};
