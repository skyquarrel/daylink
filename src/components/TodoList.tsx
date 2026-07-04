import { useState } from "react";
import type { TodoItem } from "../types/planner";

interface Props {
  todos: TodoItem[];
  onChange: (todos: TodoItem[]) => void;
  readOnly?: boolean;
}

function TodoList({ todos, onChange, readOnly = false }: Props) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const addTodo = () => {
    if (readOnly) return;
    if (newTitle.trim() === "") return;

    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: newDescription,
      completed: false,
      isDescriptionOpen: newDescription.trim() !== "",
    };

    onChange([...todos, newTodo]);
    setNewTitle("");
    setNewDescription("");
    setIsAdding(false);
  };

  const toggleCompleted = (id: string) => {
    if (readOnly) return;

    onChange(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const toggleDescription = (id: string) => {
    onChange(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, isDescriptionOpen: !todo.isDescriptionOpen }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    if (readOnly) return;
    onChange(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo: TodoItem) => {
    if (readOnly) return;

    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = (id: string) => {
    if (readOnly) return;
    if (editTitle.trim() === "") return;

    onChange(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              title: editTitle,
              description: editDescription,
              isDescriptionOpen: editDescription.trim() !== "",
            }
          : todo
      )
    );

    cancelEdit();
  };

  return (
    <div className="todo-list">
      <div className="todo-items">
        {todos.length === 0 && (
          <p className="todo-empty">아직 할 일이 없습니다.</p>
        )}

        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <div className="todo-edit-form">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="할 일 제목"
                />

                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="할 일에 대한 설명"
                />

                <div className="todo-form-buttons">
                  <button type="button" onClick={() => saveEdit(todo.id)}>
                    저장
                  </button>

                  <button type="button" onClick={cancelEdit}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="todo-row">
                  <label className="todo-title-area">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      disabled={readOnly}
                      onChange={() => toggleCompleted(todo.id)}
                    />

                    <span
                      className={
                        todo.completed ? "todo-title done" : "todo-title"
                      }
                    >
                      {todo.title}
                    </span>
                  </label>

                  <div className="todo-actions">
                    {todo.description.trim() !== "" && (
                      <button
                        type="button"
                        className="todo-toggle-button"
                        onClick={() => toggleDescription(todo.id)}
                      >
                        {todo.isDescriptionOpen
                          ? "▲ 설명숨기기"
                          : "▼ 설명보기"}
                      </button>
                    )}

                    {!readOnly && (
                      <>
                        <button
                          type="button"
                          className="todo-edit-button"
                          onClick={() => startEdit(todo)}
                        >
                          수정
                        </button>

                        <button
                          type="button"
                          className="todo-delete-button"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {todo.description.trim() !== "" && todo.isDescriptionOpen && (
                  <p className="todo-description">{todo.description}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {!readOnly &&
        (isAdding ? (
          <div className="todo-form">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="할 일 제목"
            />

            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="할 일에 대한 설명"
            />

            <div className="todo-form-buttons">
              <button type="button" onClick={addTodo}>
                추가
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle("");
                  setNewDescription("");
                }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="todo-add-open-button"
            onClick={() => setIsAdding(true)}
          >
            + 할 일 추가
          </button>
        ))}
    </div>
  );
}

export default TodoList;