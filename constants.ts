
import { TimeSlot, DayOfWeek } from './types';

export const TIME_SLOTS: TimeSlot[] = [
  "08:30 - 11:00",
  "11:00 - 13:30",
  "13:30 - 16:00",
  "16:00 - 18:30"
];

export const DAYS: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday
];

export const MASTER_ROOM_LIST: string[] = [
  ...Array.from({ length: 18 }, (_, i) => `DIA-SN ${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `DIA-SDC ${i + 1}`)
];

/**
 * Normalizes cohort identifiers by stripping all whitespace and forcing uppercase.
 */
export const normalizeCohortID = (id: string): string => {
  return id.replace(/\s+/g, '').toUpperCase();
};

export const FULL_GROUP_CHECKLIST: string[] = [
  // 1. DÉVELOPPEMENT DIGITAL (DEV)
  "DEV101", "DEV102", "DEV103", "DEV104", "DEV105", "DEV106",
  "DEVOAM201", "DEVOAM202", "DEVORVA201", "DEVOWFS201",

  // 2. INFRASTRUCTURE DIGITALE (ID)
  "ID101", "ID102", "ID103", "ID104", "ID105", "ID106",
  "IDOSR201", "IDOIOT201", "IDOCC201", "IDOCC202", "IDOCS201", "IDOCS202",

  // 3. INTELLIGENCE ARTIFICIELLE (IA)
  "IA101", "IA102", "IA103", "IA104",
  "IAODC201", "IAOBD201", "IAOADA201", "IAOADA202",

  // 4. DIGITAL DESIGN (DES)
  "DES101", "DES102",
  "DESOUX201", "DESOUI201"
];

export const ROOM_EXCLUSION_PREFIX = "LSS";
