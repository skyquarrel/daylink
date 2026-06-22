import { useEffect, useState } from "react";
import type { PlannerDay } from "../types/planner";
import PlannerPanel from "./PlannerPanel";

const STORAGE_KEY = "daylink-planner-days";

const today = new Date().toISOString().slice(0, 10);

const initialDays: PlannerDay[] = [
  {
    ownerId: "me",
    date: today,
    note: "",
    todos: [],
    timeBlocks: [],
    review: "",
  },
  {
    ownerId: "friend",
    date: today,
    note: "",
    todos: [],
    timeBlocks: [],
    review: "",
  },
];

function PlannerPage() {
  const [days, setDays] = useState<PlannerDay[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialDays;
    }

    try {
      return JSON.parse(saved) as PlannerDay[];
    } catch {
      return initialDays;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  }, [days]);

  const updateDay = (updatedDay: PlannerDay) => {
    setDays((prev) =>
      prev.map((day) =>
        day.ownerId === updatedDay.ownerId ? updatedDay : day
      )
    );
  };

  return (
    <main className="planner-page">
      <h1 className="app-title">DayLink</h1>

      <div className="planner-layout">
        {days.map((day) => (
          <PlannerPanel
            key={day.ownerId}
            plannerDay={day}
            onChange={updateDay}
          />
        ))}
      </div>
    </main>
  );
}

export default PlannerPage;