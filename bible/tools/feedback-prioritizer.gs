/**
 * REFERENCE COPY, NOT THE LIVE VERSION
 * =============================================================
 * The live prioritizer is v2 and lives in the Crestfall Feedback
 * responses Sheet, under Extensions, Apps Script. It was installed
 * and verified live on 30 Aug 2026 (test row scored 10, hand-set
 * statuses survived a rescore).
 *
 * This file is kept for reference and review only. It is NOT the
 * authority. If this file and the Sheet's script disagree, the
 * Sheet wins and this copy is the stale one. Do not paste this
 * file over the live script to "fix" a difference without checking
 * what changed in v2 first.
 *
 * Links and access rules:
 * bible/decisions/2026-08-30-feedback-pipeline.md
 * =============================================================
 *
 * Crestfall Feedback Prioritizer
 * =============================================================
 * Scores Google Form feedback responses and maintains a sorted
 * "Prioritized" tab for triage.
 *
 * HOW TO INSTALL (paste-in steps, in order)
 * -------------------------------------------------------------
 *  1. Open the Crestfall Feedback responses Sheet in the browser.
 *  2. Menu: Extensions, then Apps Script. A new editor tab opens.
 *  3. Delete whatever is in Code.gs (usually an empty
 *     "function myFunction() {}").
 *  4. Paste this entire file in its place.
 *  5. Click the save icon (or press Ctrl+S / Cmd+S).
 *  6. In the toolbar function picker, choose "rescoreAll", then
 *     click Run. Google will ask you to authorize: choose your
 *     account, click Advanced, then "Go to (project name)", then
 *     Allow. This authorization happens once.
 *     If it shows "App isn't verified", that is expected for your
 *     own script; Advanced then Go to is the way through.
 *  7. Add the on-submit trigger:
 *       a. In the left sidebar click the clock icon (Triggers).
 *       b. Click "Add Trigger" (bottom right).
 *       c. Function to run:            onFormSubmitHandler
 *       d. Deployment:                 Head
 *       e. Event source:               From spreadsheet
 *       f. Event type:                 On form submit
 *       g. Save.
 *     Note: the trigger MUST be added here by hand. A function
 *     named onFormSubmit does not fire automatically on a Sheet;
 *     only an installable trigger does.
 *  8. Reload the Sheet tab. A "Crestfall" menu appears with
 *     "Rescore all" for manual runs.
 *
 * WHAT IT DOES
 * -------------------------------------------------------------
 *  Priority score = (severity 1 to 5) x 2
 *                 + 3 if Type is Bug
 *                 + 1 if submitted within the last 14 days
 *
 *  The "Prioritized" tab is rebuilt on every run, sorted by score
 *  descending, with these columns:
 *    Score | Status | Type | Title | Area | Severity | Date |
 *    Email | Link
 *
 *  STATUS IS YOURS. It is a dropdown (New, In pipeline, Done,
 *  Skip), defaults to New for rows it has never seen, and is
 *  carried across every rescore. The script never overwrites a
 *  status you set by hand.
 *
 *  Column K is a hidden bookkeeping column holding the source row
 *  number. That is how a hand-edited status survives a rebuild.
 *  Do not delete or sort it.
 *
 * ONE HONEST LIMITATION
 * -------------------------------------------------------------
 *  The "+1 if submitted in the last 14 days" point is calculated
 *  at run time, not continuously. An item that ages past 14 days
 *  keeps its old point until the next run. Any new submission
 *  rescores every row, so in normal use it stays current. If the
 *  form goes quiet for a while, use Crestfall, then Rescore all.
 *
 * IF THE SCORES COME OUT WRONG
 * -------------------------------------------------------------
 *  The script finds columns by matching header text, because form
 *  question wording changes. If a column is not found it is
 *  reported in a toast at the end of a manual run. Fix it by
 *  editing HEADER_MATCHES below: add the exact header text from
 *  your Sheet to the relevant list. Matching is case insensitive
 *  and ignores surrounding spaces.
 *
 * Author: Claude (FE lane) for Brian, 30 Aug 2026.
 * Record: bible/decisions/2026-08-30-feedback-pipeline.md
 */

// ============================================================
// CONFIG
// ============================================================

/**
 * Name of the tab the Google Form writes into. Leave as null to
 * use the first sheet that is not the Prioritized tab, which is
 * what a standard form-linked Sheet gives you.
 */
var RESPONSES_SHEET_NAME = null;

/** Name of the tab this script builds and owns. */
var PRIORITIZED_SHEET_NAME = 'Prioritized';

/** Status dropdown values. First entry is the default. */
var STATUS_OPTIONS = ['New', 'In pipeline', 'Done', 'Skip'];

/** Scoring knobs, kept here so they are easy to retune. */
var SEVERITY_WEIGHT = 2;
var BUG_BONUS = 3;
var RECENT_BONUS = 1;
var RECENT_WINDOW_DAYS = 14;

/**
 * Header text to look for, per field. Add your Sheet's exact
 * header text to a list if a column is not being found. Each
 * entry is matched as a substring, case insensitive.
 */
var HEADER_MATCHES = {
  timestamp: ['timestamp', 'date submitted', 'submitted at', 'date'],
  email: ['email', 'email address', 'your email'],
  type: ['type', 'category', 'kind', 'what kind'],
  title: ['title', 'summary', 'headline', 'short description',
          'one line'],
  area: ['area', 'page', 'section', 'where', 'feature'],
  severity: ['severity', 'priority', 'how bad', 'impact', 'urgency']
};

/** Values in the Type column that count as a bug. */
var BUG_VALUES = ['bug', 'defect', 'broken', 'error'];

// ============================================================
// ENTRY POINTS
// ============================================================

/**
 * Simple trigger: adds the menu when the Sheet is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Crestfall')
    .addItem('Rescore all', 'rescoreAll')
    .addToUi();
}

/**
 * Installable trigger target. Wire this up by hand, step 7 above.
 * The event object is not used: a new submission rescores every
 * row so that the recency point stays honest across the sheet.
 */
function onFormSubmitHandler(e) {
  buildPrioritized_(false);
}

/**
 * Menu target for manual runs. Reports what it did, and reports
 * any header it could not find.
 */
function rescoreAll() {
  buildPrioritized_(true);
}

// ============================================================
// CORE
// ============================================================

/**
 * Rebuilds the Prioritized tab from the responses tab.
 * @param {boolean} interactive True when a human clicked the menu,
 *     which allows toasts. Trigger runs stay silent.
 */
function buildPrioritized_(interactive) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responses = getResponsesSheet_(ss);

  if (!responses) {
    if (interactive) {
      ss.toast('No responses tab found.', 'Crestfall', 10);
    }
    return;
  }

  var lastRow = responses.getLastRow();
  var lastCol = responses.getLastColumn();

  if (lastRow < 2 || lastCol < 1) {
    if (interactive) {
      ss.toast('No responses to score yet.', 'Crestfall', 5);
    }
    return;
  }

  var values = responses
    .getRange(1, 1, lastRow, lastCol)
    .getValues();

  var headers = values[0];
  var cols = mapColumns_(headers);

  var target = getOrCreatePrioritized_(ss);
  var savedStatus = readExistingStatus_(target);

  var now = new Date();
  var rows = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];

    if (isBlankRow_(row)) {
      continue;
    }

    var sourceRow = i + 1;
    var severity = parseSeverity_(pick_(row, cols.severity));
    var type = toText_(pick_(row, cols.type));
    var submitted = parseDate_(pick_(row, cols.timestamp));

    rows.push({
      score: computeScore_(severity, type, submitted, now),
      status: savedStatus[sourceRow] || STATUS_OPTIONS[0],
      type: type,
      title: toText_(pick_(row, cols.title)),
      area: toText_(pick_(row, cols.area)),
      severity: severity,
      date: submitted,
      email: toText_(pick_(row, cols.email)),
      sourceRow: sourceRow
    });
  }

  rows.sort(function (a, b) {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    var at = a.date ? a.date.getTime() : 0;
    var bt = b.date ? b.date.getTime() : 0;
    return bt - at;
  });

  writePrioritized_(target, responses, rows);

  if (interactive) {
    var missing = missingFields_(cols);
    var note = 'Scored ' + rows.length + ' responses.';
    if (missing.length) {
      note += ' Columns not found: ' + missing.join(', ') +
              '. See HEADER_MATCHES in the script.';
    }
    ss.toast(note, 'Crestfall', 12);
  }
}

/**
 * Priority formula. Kept in one place on purpose.
 */
function computeScore_(severity, type, submitted, now) {
  var score = severity * SEVERITY_WEIGHT;

  if (isBug_(type)) {
    score += BUG_BONUS;
  }

  if (isRecent_(submitted, now)) {
    score += RECENT_BONUS;
  }

  return score;
}

// ============================================================
// WRITING
// ============================================================

function writePrioritized_(target, responses, rows) {
  var headerRow = ['Score', 'Status', 'Type', 'Title', 'Area',
                   'Severity', 'Date', 'Email', 'Link',
                   'Source row'];

  target.clearContents();
  target.clearFormats();

  ensureWidth_(target, headerRow.length);

  target.getRange(1, 1, target.getMaxRows(),
                  headerRow.length).clearDataValidations();

  target.getRange(1, 1, 1, headerRow.length)
    .setValues([headerRow])
    .setFontWeight('bold');

  target.setFrozenRows(1);

  if (!rows.length) {
    target.hideColumns(headerRow.length);
    return;
  }

  var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
  var gid = responses.getSheetId();

  var body = [];
  var links = [];

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];

    body.push([
      r.score,
      r.status,
      r.type,
      r.title,
      r.area,
      r.severity,
      r.date,
      r.email,
      '',
      r.sourceRow
    ]);

    var url = 'https://docs.google.com/spreadsheets/d/' + ssId +
              '/edit#gid=' + gid + '&range=A' + r.sourceRow;

    links.push(['=HYPERLINK("' + url + '","row ' +
                r.sourceRow + '")']);
  }

  target.getRange(2, 1, body.length, headerRow.length)
    .setValues(body);

  target.getRange(2, 9, links.length, 1).setFormulas(links);

  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .build();

  target.getRange(2, 2, body.length, 1).setDataValidation(rule);

  target.getRange(2, 7, body.length, 1)
    .setNumberFormat('yyyy-mm-dd hh:mm');

  target.hideColumns(headerRow.length);
  target.autoResizeColumns(1, headerRow.length - 1);
}

/**
 * Reads the statuses a human has set, keyed by source row, so a
 * rebuild never loses them.
 */
function readExistingStatus_(target) {
  var saved = {};
  var lastRow = target.getLastRow();

  if (lastRow < 2) {
    return saved;
  }

  if (target.getMaxColumns() < 10) {
    return saved;
  }

  var statuses = target.getRange(2, 2, lastRow - 1, 1).getValues();
  var keys = target.getRange(2, 10, lastRow - 1, 1).getValues();

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i][0];
    var status = statuses[i][0];

    if (key !== '' && key !== null && status !== '') {
      saved[Number(key)] = status;
    }
  }

  return saved;
}

// ============================================================
// SHEET HELPERS
// ============================================================

function getResponsesSheet_(ss) {
  if (RESPONSES_SHEET_NAME) {
    return ss.getSheetByName(RESPONSES_SHEET_NAME);
  }

  var sheets = ss.getSheets();

  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName() !== PRIORITIZED_SHEET_NAME) {
      return sheets[i];
    }
  }

  return null;
}

/**
 * Makes sure the sheet is wide enough for the bookkeeping column
 * before anything addresses column 10.
 */
function ensureWidth_(sheet, needed) {
  var have = sheet.getMaxColumns();

  if (have < needed) {
    sheet.insertColumnsAfter(have, needed - have);
  }
}

function getOrCreatePrioritized_(ss) {
  var sheet = ss.getSheetByName(PRIORITIZED_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(PRIORITIZED_SHEET_NAME);
  }

  return sheet;
}

/**
 * Maps each logical field to a zero-based column index by
 * matching header text. Returns -1 for anything not found.
 */
function mapColumns_(headers) {
  var normalized = [];

  for (var i = 0; i < headers.length; i++) {
    normalized.push(String(headers[i]).toLowerCase().trim());
  }

  var cols = {};

  for (var field in HEADER_MATCHES) {
    if (!HEADER_MATCHES.hasOwnProperty(field)) {
      continue;
    }
    cols[field] = findColumn_(normalized, HEADER_MATCHES[field]);
  }

  return cols;
}

/**
 * Exact header match wins; substring match is the fallback. This
 * stops "date" from stealing the column when a real "Timestamp"
 * header is present.
 */
function findColumn_(normalized, candidates) {
  var i, j;

  for (j = 0; j < candidates.length; j++) {
    for (i = 0; i < normalized.length; i++) {
      if (normalized[i] === candidates[j]) {
        return i;
      }
    }
  }

  for (j = 0; j < candidates.length; j++) {
    for (i = 0; i < normalized.length; i++) {
      if (normalized[i].indexOf(candidates[j]) !== -1) {
        return i;
      }
    }
  }

  return -1;
}

function missingFields_(cols) {
  var missing = [];

  for (var field in cols) {
    if (cols.hasOwnProperty(field) && cols[field] === -1) {
      missing.push(field);
    }
  }

  return missing;
}

// ============================================================
// VALUE HELPERS
// ============================================================

function pick_(row, index) {
  if (index === -1 || index >= row.length) {
    return '';
  }
  return row[index];
}

function toText_(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value;
  }
  return String(value).trim();
}

/**
 * Accepts 3, "3", "3 - Major", "Sev 3", "Major (3)". Falls back
 * to 0 when nothing numeric is present, so an unscored row sinks
 * rather than blocking the run.
 */
function parseSeverity_(value) {
  if (typeof value === 'number' && !isNaN(value)) {
    return clamp_(Math.round(value), 1, 5);
  }

  var text = String(value === null ? '' : value);
  var match = text.match(/\d+/);

  if (!match) {
    return 0;
  }

  return clamp_(parseInt(match[0], 10), 1, 5);
}

function clamp_(n, low, high) {
  if (isNaN(n)) {
    return 0;
  }
  if (n < low) {
    return low;
  }
  if (n > high) {
    return high;
  }
  return n;
}

function isBug_(type) {
  var text = String(type === null ? '' : type).toLowerCase();

  for (var i = 0; i < BUG_VALUES.length; i++) {
    if (text.indexOf(BUG_VALUES[i]) !== -1) {
      return true;
    }
  }

  return false;
}

function parseDate_(value) {
  if (value instanceof Date) {
    return value;
  }

  if (value === '' || value === null || value === undefined) {
    return null;
  }

  var parsed = new Date(value);

  return isNaN(parsed.getTime()) ? null : parsed;
}

function isRecent_(submitted, now) {
  if (!submitted) {
    return false;
  }

  var ms = now.getTime() - submitted.getTime();
  var days = ms / (1000 * 60 * 60 * 24);

  return days >= 0 && days <= RECENT_WINDOW_DAYS;
}

function isBlankRow_(row) {
  for (var i = 0; i < row.length; i++) {
    if (row[i] !== '' && row[i] !== null && row[i] !== undefined) {
      return false;
    }
  }
  return true;
}
