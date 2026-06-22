export type OwnerId = "me" | "friend";

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  isDescriptionOpen: boolean;
}

export interface TimeBlock {
  id: string;
  ownerId: OwnerId;
  date: string;
  title: string;
  memo: string;
  startSlot: number;
  endSlot: number;
  color: string;
}

export interface PlannerDay {
  ownerId: OwnerId;
  date: string;
  note: string;
  todos: TodoItem[];
  timeBlocks: TimeBlock[];
  review: string;
}