
export type TimeSlot = "08:30 - 11:00" | "11:00 - 13:30" | "13:30 - 16:00" | "16:00 - 18:30";

export interface MondaySlot {
  timeSlot: TimeSlot;
  room: string;
  professor: string;
}

export interface GroupData {
  name: string;
  lastUpdated: number;
  entries: ScheduleEntry[];
  fileUrl?: string;
  mondaySummary?: MondaySlot[];
  status: 'OK' | 'MISSING' | 'UNREADABLE';
  revisionDate?: string;
}

export interface ScheduleEntry {
  groupName: string;
  room: string;
  timeSlot: TimeSlot;
  professor: string;
  day: string; // e.g., "Lundi", "Mardi", etc.
}

export interface MatrixData {
  [room: string]: {
    [time in TimeSlot]?: {
      groupName: string;
      professor: string;
    }
  };
}

export type ProblemPriority = "Important" | "Urgent" | "Plus Urgent";
export type ProblemStatus = "Reported" | "Waiting" | "Handled";

export interface ReportedProblem {
  id: string;
  room: string;
  description: string;
  priority: ProblemPriority;
  status: ProblemStatus;
  timestamp: number;
}

export interface IntegrationReport {
  timestamp: string;
  totalChecked: number;
  okCount: number;
  missingCount: number;
  missingGroups: string[];
  updatedGroups: string[];
}

export enum DayOfWeek {
  Monday = "Lundi",
  Tuesday = "Mardi",
  Wednesday = "Mercredi",
  Thursday = "Jeudi",
  Friday = "Vendredi",
  Saturday = "Samedi"
}
