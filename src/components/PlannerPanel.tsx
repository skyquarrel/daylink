import type { PlannerDay, TimeBlock } from "../types/planner";
import TimeTable from "./TimeTable";

interface Props {
  plannerDay: PlannerDay;
  onChange: (day: PlannerDay) => void;
}

function PlannerPanel({ plannerDay, onChange }: Props) {
  const label = plannerDay.ownerId === "me" ? "내 플래너" : "친구 플래너";

  const updateBlocks = (timeBlocks: TimeBlock[]) => {
    onChange({
      ...plannerDay,
      timeBlocks,
    });
  };

  return (
    <section className="planner-panel">
      <h2>{label}</h2>
      <p>{plannerDay.date}</p>

      <textarea
        className="note-input"
        placeholder="오늘의 노래, 기분, 짧은 메모..."
        value={plannerDay.note}
        onChange={(e) =>
          onChange({
            ...plannerDay,
            note: e.target.value,
          })
        }
      />

      <div className="planner-main">
        <div>
          <h3>To-do</h3>
          <p>다음 단계에서 추가합니다.</p>
        </div>

        <div>
          <h3>Time Table</h3>
          <TimeTable
            ownerId={plannerDay.ownerId}
            date={plannerDay.date}
            blocks={plannerDay.timeBlocks}
            onChange={updateBlocks}
          />
        </div>
      </div>

      <textarea
        className="review-input"
        placeholder="오늘 하루를 어떻게 살아냈나요?"
        value={plannerDay.review}
        onChange={(e) =>
          onChange({
            ...plannerDay,
            review: e.target.value,
          })
        }
      />
    </section>
  );
}

export default PlannerPanel;