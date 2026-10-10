'use client';

import {
  type Announcements,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ActivityContent } from '@storyforge/shared';
import { useId, useState } from 'react';
import { Button } from '@/components/ui';
import type { ActivityResult } from './types';

type Activity = Extract<ActivityContent, { type: 'SEQUENCE' }>;
type Item = Activity['items'][number];

/** A start order that is never already correct. */
function startOrder(items: readonly Item[]): Item[] {
  const mixed = [
    ...items.filter((_, i) => i % 2 === 1),
    ...items.filter((_, i) => i % 2 === 0),
  ].toReversed();
  return mixed.every((item, i) => item.id === items[i]?.id) ? items.toReversed() : mixed;
}

/**
 * Put the cards in order (the story mountain, DESIGN.md §10): drag a card, use its handle with the
 * keyboard (Space, arrows, Space), or press the move buttons. "Check" marks the cards in the right
 * place until the next move.
 */
export function Sequence({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const [order, setOrder] = useState(() => startOrder(activity.items));
  const [attempts, setAttempts] = useState(0);
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  // A stable id keeps dnd-kit's accessibility ids the same on the server and in the browser.
  const dndId = useId();
  const isMountain = activity.labels?.length === 5;
  const textOf = (id: string | number) => order.find((i) => i.id === id)?.text ?? 'the card';
  const placeOf = (id: string | number) => {
    const index = order.findIndex((i) => i.id === id);
    const label = activity.labels?.[index];
    return `place ${index + 1}${label ? ` (${label})` : ''}`;
  };
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up "${textOf(active.id)}". Use the arrow keys to move it.`,
    onDragOver: ({ active, over }) =>
      over ? `"${textOf(active.id)}" is over ${placeOf(over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over ? `Dropped "${textOf(active.id)}" at ${placeOf(over.id)}.` : 'Dropped.',
    onDragCancel: ({ active }) => `Moving "${textOf(active.id)}" was cancelled.`,
  };

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length) return;
    setOrder((prev) => arrayMove(prev, from, to));
    setMarked(new Set());
    setMessage(null);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = order.findIndex((i) => i.id === active.id);
    const to = order.findIndex((i) => i.id === over.id);
    if (from >= 0 && to >= 0) move(from, to);
  }

  function check() {
    setAttempts((n) => n + 1);
    const right = order.filter((item, i) => activity.items[i]?.id === item.id);
    setMarked(new Set(right.map((i) => i.id)));
    if (right.length === order.length) {
      setSolved(true);
      setMessage(null);
      return;
    }
    setMessage(
      `${right.length} of ${order.length} are in the right place (marked ✓). Move the others and check again.`,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg">{activity.instructions}</p>
      {isMountain && <StoryMountain />}
      <p className="text-sm text-muted">
        Drag a card by its handle, or use the ↑ ↓ buttons. With a keyboard: focus a handle, press
        Space, move with the arrow keys, and press Space again.
      </p>

      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        accessibility={{ announcements }}
      >
        <SortableContext items={order.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <ol className="flex flex-col gap-2" aria-label="Your order">
            {order.map((item, index) => (
              <SequenceCard
                key={item.id}
                item={item}
                index={index}
                total={order.length}
                label={activity.labels?.[index]}
                right={solved || marked.has(item.id)}
                solved={solved}
                onMove={move}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      <div aria-live="polite">
        {solved && (
          <div className="rounded-xl border border-ok bg-card px-4 py-3">
            <p>
              <strong className="text-ok">✓ Perfect order!</strong> {activity.explanation}
            </p>
          </div>
        )}
        {message && <p className="rounded-xl border border-warn bg-card px-4 py-3">{message}</p>}
      </div>

      {solved ? (
        <Button className="self-start" onClick={() => onDone({ correct: true, attempts })}>
          Done
        </Button>
      ) : (
        <Button className="self-start" onClick={check}>
          Check
        </Button>
      )}
    </div>
  );
}

function SequenceCard({
  item,
  index,
  total,
  label,
  right,
  solved,
  onMove,
}: {
  item: Item;
  index: number;
  total: number;
  label: string | undefined;
  /** Shown with a ✓ after "Check". */
  right: boolean;
  solved: boolean;
  onMove: (from: number, to: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: solved,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl border bg-card p-2 ${
        right ? 'border-ok' : 'border-border'
      } ${isDragging ? 'z-10 shadow-lg' : ''}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={solved}
        aria-label={`Drag "${item.text}"`}
        className="cursor-grab rounded px-2 py-1 text-muted focus-visible:outline-3 focus-visible:outline-brand disabled:cursor-default"
      >
        ⠿
      </button>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold text-muted">
          {index + 1}
          {label ? ` · ${label}` : ''}
        </span>
        <span>
          {right && <span aria-label="In the right place">✓ </span>}
          {item.text}
        </span>
      </div>
      {!solved && (
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            aria-label={`Move "${item.text}" up`}
            className="rounded border border-border px-2 text-sm focus-visible:outline-3 focus-visible:outline-brand disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1}
            aria-label={`Move "${item.text}" down`}
            className="rounded border border-border px-2 text-sm focus-visible:outline-3 focus-visible:outline-brand disabled:opacity-40"
          >
            ↓
          </button>
        </div>
      )}
    </li>
  );
}

/** The story mountain shape with its five numbered stages (decorative; the list has the labels). */
function StoryMountain() {
  const points = [
    [20, 90],
    [95, 62],
    [170, 14],
    [245, 62],
    [320, 90],
  ] as const;
  return (
    <svg viewBox="0 0 340 105" className="w-full max-w-md text-brand" aria-hidden="true">
      <polyline
        points="5,100 20,90 95,62 170,14 245,62 320,90 335,100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {points.map(([x, y], i) => (
        <g key={x}>
          <circle cx={x} cy={y} r="10" fill="currentColor" />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
