export const START_HOUR = 5;
export const TOTAL_MINUTES = 23 * 60;
export const SLOT_MINUTES = 10;
export const SLOT_HEIGHT = 18;

export function formatTime(totalMinutesFromStart: number) {
  const absoluteMinutes = START_HOUR * 60 + totalMinutesFromStart;
  const hour = Math.floor(absoluteMinutes / 60) % 24;
  const minute = absoluteMinutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  let total = hour * 60 + minute - START_HOUR * 60;

  if (total < 0) {
    total += 24 * 60;
  }

  return total;
}

export function yToSnappedMinutes(y: number) {
  const rawSlot = Math.floor(y / SLOT_HEIGHT);
  const snapped = rawSlot * SLOT_MINUTES;

  return Math.max(0, Math.min(snapped, TOTAL_MINUTES));
}

export function blockToStyle(startTime: string, endTime: string) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  return {
    top: `${(start / SLOT_MINUTES) * SLOT_HEIGHT}px`,
    height: `${Math.max(((end - start) / SLOT_MINUTES) * SLOT_HEIGHT, SLOT_HEIGHT)}px`,
  };
}