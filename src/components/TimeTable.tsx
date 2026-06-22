import { useState } from "react";
import { formatTime } from "../utils/time";

const HOURS = 24;
const SLOTS_PER_HOUR = 6;
const SLOT_MINUTES = 10;

interface TimeBlock {
  id: string;
  title: string;
  startSlot: number;
  endSlot: number;
  color: string;
}

function TimeTable() {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);

  const getSlotNumber = (hourIndex: number, slotIndex: number) => {
    return hourIndex * SLOTS_PER_HOUR + slotIndex;
  };

  const slotToTime = (slotNumber: number) => {
    return formatTime(slotNumber * SLOT_MINUTES);
  };

  const handleMouseDown = (hourIndex: number, slotIndex: number) => {
    const slotNumber = getSlotNumber(hourIndex, slotIndex);
    setDragStart(slotNumber);
    setDragEnd(slotNumber);
  };

  const handleMouseEnter = (hourIndex: number, slotIndex: number) => {
    if (dragStart === null) return;

    const slotNumber = getSlotNumber(hourIndex, slotIndex);
    setDragEnd(slotNumber);
  };

  const handleMouseUp = () => {
    if (dragStart === null || dragEnd === null) return;

    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd) + 1;

    const newBlock: TimeBlock = {
      id: crypto.randomUUID(),
      title: "새 기록",
      startSlot: start,
      endSlot: end,
      color: "#c9b8ff",
    };

    setBlocks((prev) => [...prev, newBlock]);

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

  const getBlockForSlot = (slotNumber: number) => {
    return blocks.find(
      (block) => slotNumber >= block.startSlot && slotNumber < block.endSlot
    );
  };

  const isBlockStart = (slotNumber: number, block: TimeBlock) => {
    return slotNumber === block.startSlot;
  };

  return (
    <div className="horizontal-time-table" onMouseUp={handleMouseUp}>
      {Array.from({ length: HOURS }, (_, hourIndex) => (
        <div key={hourIndex} className="horizontal-hour-row">
          <div className="horizontal-time-label">
            {formatTime(hourIndex * 60)}
          </div>

          <div className="horizontal-slot-group">
            {Array.from({ length: SLOTS_PER_HOUR }, (_, slotIndex) => {
              const slotNumber = getSlotNumber(hourIndex, slotIndex);
              const block = getBlockForSlot(slotNumber);

              return (
                <div
                  key={slotIndex}
                  className={[
                    "horizontal-slot",
                    isSelected(hourIndex, slotIndex) ? "selected" : "",
                    block ? "has-block" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={block ? { backgroundColor: block.color } : undefined}
                  onMouseDown={() => handleMouseDown(hourIndex, slotIndex)}
                  onMouseEnter={() => handleMouseEnter(hourIndex, slotIndex)}
                >
                  {block && isBlockStart(slotNumber, block) && (
                    <div className="slot-block-label">
                      <strong>{block.title}</strong>
                      <span>
                        {slotToTime(block.startSlot)} -{" "}
                        {slotToTime(block.endSlot)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TimeTable;