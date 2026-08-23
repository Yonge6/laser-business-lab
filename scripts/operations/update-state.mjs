import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const opportunityIds = [
  "personalized-tumblers",
  "laser-leather-patches",
  "heat-press-tote-bags",
  "layered-wood-wall-art",
  "3d-desk-organizers",
  "3d-geometric-planters",
  "acrylic-wedding-signs",
];

const lenses = ["review", "demand", "price", "validation", "production", "equipment", "risk"];
const timezone = "Asia/Shanghai";
const startWeek = "2026-08-17";
const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../content/operations/state.json");

function shanghaiDate() {
  if (process.env.OPERATIONS_DATE) return process.env.OPERATIONS_DATE;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function utcDate(date) {
  return new Date(`${date}T12:00:00.000Z`);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function mondayFor(date) {
  const current = utcDate(date);
  const weekday = current.getUTCDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  current.setUTCDate(current.getUTCDate() + mondayOffset);
  return isoDate(current);
}

function weeksSinceStart(weekStarted) {
  return Math.max(0, Math.floor((utcDate(weekStarted) - utcDate(startWeek)) / 604_800_000));
}

const runDate = shanghaiDate();
if (!/^\d{4}-\d{2}-\d{2}$/.test(runDate)) throw new Error(`Invalid OPERATIONS_DATE: ${runDate}`);

const weekStarted = mondayFor(runDate);
const sequence = weeksSinceStart(weekStarted);
const activeOpportunityId = opportunityIds[sequence % opportunityIds.length];
const activeLens = lenses[utcDate(runDate).getUTCDay()];
const previous = JSON.parse(await readFile(filePath, "utf8"));
const history = Array.isArray(previous.history)
  ? previous.history.filter((item) => item.weekStarted < weekStarted)
  : [];
history.push({ weekStarted, opportunityId: activeOpportunityId });
history.sort((a, b) => a.weekStarted.localeCompare(b.weekStarted));

const next = {
  version: 1,
  timezone,
  lastRunDate: runDate,
  weekStarted,
  activeOpportunityId,
  activeLens,
  sequence,
  history: history.slice(-12),
};

await writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
console.log(`Maker operations updated: ${runDate} / ${activeOpportunityId} / ${activeLens}`);
