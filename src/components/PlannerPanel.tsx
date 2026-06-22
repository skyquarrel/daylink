import type { PlannerDay, TodoItem, TimeBlock } from "../types/planner";
import TimeTable from "./TimeTable";
import TodoList from "./TodoList";

interface Props {
  plannerDay: PlannerDay;
  onChange: (day: PlannerDay) => void;
}

function PlannerPanel({ plannerDay, onChange }: Props) {
  const label = plannerDay.ownerId === "me" ? "내 플래너" : "친구 플래너";

  const updateTodos = (todos: TodoItem[]) => {
    onChange({
      ...plannerDay,
      todos,
    });
  };

  const updateTimeBlocks = (timeBlocks: TimeBlock[]) => {
    onChange({
      ...plannerDay,
      timeBlocks,
    });
  };

  return (
    <section className="planner-panel">
      <header className="planner-header">
        <p>{label}</p>
        <h2>{plannerDay.date}</h2>
      </header>

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
        <div className="todo-area">
          <h3>To-do</h3>
          <TodoList todos={plannerDay.todos} onChange={updateTodos} />
        </div>

        <div className="time-area">
          <h3>Time Table</h3>
          <TimeTable
            ownerId={plannerDay.ownerId}
            date={plannerDay.date}
            blocks={plannerDay.timeBlocks}
            onChange={updateTimeBlocks}
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