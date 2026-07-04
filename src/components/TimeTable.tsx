import { useState } from "react";
import type { OwnerId, TimeBlock } from "../types/planner";
import { formatTime } from "../utils/time";

const HOURS = 24;
const SLOTS_PER_HOUR = 6;
const SLOT_MINUTES = 10;

interface Props {
  ownerId: OwnerId;
  date: string;
  blocks: TimeBlock[];
  onChange: (blocks: TimeBlock[]) => void;
  readOnly?: boolean;
}

function TimeTable({ ownerId, date, blocks, onChange, readOnly = false }: Props) {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);

  const getSlotNumber = (hourIndex: number, slotIndex: number) => {
    return hourIndex * SLOTS_PER_HOUR + slotIndex;
  };

  const slotToTime = (slotNumber: number) => {
    return formatTime(slotNumber * SLOT_MINUTES);
  };

  const getBlockForSlot = (slotNumber: number) => {
    return blocks.find(
      (block) => slotNumber >= block.startSlot && slotNumber < block.endSlot
    );
  };

  const getBlockSegments = (block: TimeBlock) => {
    const segments = [];

    let currentSlot = block.startSlot;

    while (currentSlot < block.endSlot) {
      const row = Math.floor(currentSlot / SLOTS_PER_HOUR);
      const col = currentSlot % SLOTS_PER_HOUR;

      const rowEndSlot = (row + 1) * SLOTS_PER_HOUR;
      const segmentEnd = Math.min(block.endSlot, rowEndSlot);
      const span = segmentEnd - currentSlot;

      segments.push({
        row,
        col,
        span,
        isFirst: currentSlot === block.startSlot,
      });

      currentSlot = segmentEnd;
    }

    return segments;
  };

  const handleMouseDown = (hourIndex: number, slotIndex: number) => {
    if (readOnly) return;

    const slotNumber = getSlotNumber(hourIndex, slotIndex);
    const existingBlock = getBlockForSlot(slotNumber);

    if (existingBlock) {
      setSelectedBlock(existingBlock);
      setDragStart(null);
      setDragEnd(null);
      return;
    }

    setDragStart(slotNumber);
    setDragEnd(slotNumber);
  };

  const handleMouseEnter = (hourIndex: number, slotIndex: number) => {
    if (readOnly) return;
    if (dragStart === null) return;

    setDragEnd(getSlotNumber(hourIndex, slotIndex));
  };

  const handleMouseUp = () => {
    if (readOnly) return;
    if (dragStart === null || dragEnd === null) return;

    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd) + 1;

    const newBlock: TimeBlock = {
      id: crypto.randomUUID(),
      ownerId,
      date,
      title: "새 기록",
      memo: "",
      startSlot: start,
      endSlot: end,
      color: "#c9b8ff",
    };

    onChange([...blocks, newBlock]);
    setSelectedBlock(newBlock);
    setDragStart(null);
    setDragEnd(null);
  };

  const isSelected = (hourIndex: number, slotIndex: number) => {
    if (dragStart === null || dragEnd === null) return false;

    const slotNumber = getSlotNumber(hourIndex, slotIndex);
    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);

    return slotNumber >= start && slotNumber <= end;
  };

  const updateSelectedBlock = (updatedBlock: TimeBlock) => {
    if (readOnly) return;

    onChange(
      blocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );

    setSelectedBlock(updatedBlock);
  };

  const deleteSelectedBlock = () => {
    if (readOnly) return;
    if (!selectedBlock) return;

    onChange(blocks.filter((block) => block.id !== selectedBlock.id));
    setSelectedBlock(null);
  };

  return (
    <>
      <div className="horizontal-time-table" onMouseUp={handleMouseUp}>
        {Array.from({ length: HOURS }, (_, hourIndex) => (
          <div key={hourIndex} className="horizontal-hour-row">
            <div
              className="horizontal-time-label"
              onMouseDown={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.stopPropagation()}
            >
              {formatTime(hourIndex * 60)}
            </div>

            <div className="horizontal-slot-group">
              {Array.from({ length: SLOTS_PER_HOUR }, (_, slotIndex) => (
                <div
                  key={slotIndex}
                  className={[
                    "horizontal-slot",
                    isSelected(hourIndex, slotIndex) ? "selected" : "",
                    readOnly ? "readonly-slot" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseDown={() => handleMouseDown(hourIndex, slotIndex)}
                  onMouseEnter={() => handleMouseEnter(hourIndex, slotIndex)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="time-block-layer">
          {blocks.flatMap((block) =>
            getBlockSegments(block).map((segment, index) => (
              <div
                key={`${block.id}-${index}`}
                className="time-block-bar"
                style={{
                  gridRow: `${segment.row + 1}`,
                  gridColumn: `${segment.col + 2} / span ${segment.span}`,
                  backgroundColor: block.color,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (!readOnly) setSelectedBlock(block);
                }}
              >
                {segment.isFirst && (
                  <>
                    <strong>{block.title}</strong>
                    <span>
                      {slotToTime(block.startSlot)} - {slotToTime(block.endSlot)}
                    </span>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {selectedBlock && !readOnly && (
        <div className="simple-modal-backdrop">
          <div className="simple-modal">
            <h3>기록 수정</h3>

            <label>
              제목
              <input
                value={selectedBlock.title}
                onChange={(e) =>
                  updateSelectedBlock({
                    ...selectedBlock,
                    title: e.target.value,
                  })
                }
              />
            </label>

            <label>
              메모
              <textarea
                value={selectedBlock.memo}
                onChange={(e) =>
                  updateSelectedBlock({
                    ...selectedBlock,
                    memo: e.target.value,
                  })
                }
              />
            </label>

            <label>
              색상
              <input
                type="color"
                value={selectedBlock.color}
                onChange={(e) =>
                  updateSelectedBlock({
                    ...selectedBlock,
                    color: e.target.value,
                  })
                }
              />
            </label>

            <p>
              {slotToTime(selectedBlock.startSlot)} -{" "}
              {slotToTime(selectedBlock.endSlot)}
            </p>

            <div className="simple-modal-buttons">
              <button onClick={() => setSelectedBlock(null)}>닫기</button>
              <button onClick={deleteSelectedBlock}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TimeTable;