import operationsArchive from "@/content/operations/archive.json";
import { getRadarBriefing, type OperationsState } from "@/lib/operations/radar";

type OperationsArchive = {
  version: number;
  entries: OperationsState[];
};

export type RadarArchiveSummary = {
  date: string;
  href: string;
  title: string;
  titleZh: string;
  label: string;
  labelZh: string;
  answer: string;
  answerZh: string;
  score: number;
};

const archive = operationsArchive as OperationsArchive;

export function getRadarArchiveDates() {
  return archive.entries.map((entry) => entry.lastRunDate).sort((a, b) => b.localeCompare(a));
}

export function getArchivedRadarBriefing(date: string) {
  const state = archive.entries.find((entry) => entry.lastRunDate === date);
  return state ? getRadarBriefing(state, `/radar/${date}`) : null;
}

export function getRadarArchiveSummaries(excludeDate?: string): RadarArchiveSummary[] {
  return getRadarArchiveDates()
    .filter((date) => date !== excludeDate)
    .map((date) => {
      const briefing = getArchivedRadarBriefing(date);
      if (!briefing) throw new Error(`Missing Radar archive entry: ${date}`);
      return {
        date,
        href: `/radar/${date}`,
        title: briefing.daily.headline,
        titleZh: briefing.daily.headlineZh,
        label: briefing.daily.label,
        labelZh: briefing.daily.labelZh,
        answer: briefing.daily.answer,
        answerZh: briefing.daily.answerZh,
        score: briefing.opportunity.score,
      };
    });
}
