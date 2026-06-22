export type OwnerId = "me" | "friend";

export interface TimeBlock {
  id: string;
  ownerId: OwnerId;
  date: string;
  title: string;
  memo: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface PlannerDay {
  ownerId: OwnerId;
  date: string;
  note: string;
  timeBlocks: TimeBlock[];
  review: string;
}