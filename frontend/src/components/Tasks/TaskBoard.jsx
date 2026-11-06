import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import TaskCard from "./TaskCard";

const columns = [
  {
    id: "Pending",
    title: "Pending",
    color: "border-amber-400",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: "In Progress",
    title: "In Progress",
    color: "border-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: "Completed",
    title: "Completed",
    color: "border-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
];

const BoardColumn = ({ column, tasks, onView }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      status: column.id,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[400px] rounded-2xl border border-slate-200 border-t-4 bg-slate-50/80 p-4 ${column.color} ${
        isOver ? "bg-indigo-50/70 ring-2 ring-indigo-200" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-slate-800">{column.title}</h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${column.badge}`}
        >
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onView={onView} />
          ))}
        </div>
      </SortableContext>

      {tasks.length === 0 && (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-center">
          <ClipboardList size={30} className="mb-2 text-slate-300" />
          <p className="text-xs text-slate-400">Drop tasks here</p>
        </div>
      )}
    </section>
  );
};

const TaskBoard = ({ tasks, onStatusChange, onView }) => {
  const [movingTaskId, setMovingTaskId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event) => {
    setMovingTaskId(String(event.active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setMovingTaskId(null);

    if (!over) return;

    const activeTask = tasks.find((task) => task._id === String(active.id));

    if (!activeTask) return;

    const overId = String(over.id);

    // Dropping over a column or another task.
    const targetTask = tasks.find((task) => task._id === overId);

    const targetStatus = columns.some((column) => column.id === overId)
      ? overId
      : targetTask?.status;

    if (!targetStatus || activeTask.status === targetStatus) {
      return;
    }

    await onStatusChange(activeTask._id, targetStatus);
  };

  const handleDragCancel = () => {
    setMovingTaskId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Task Board</h2>
          <p className="text-sm text-slate-500">
            Drag a task card into another column to change its status.
          </p>
        </div>

        {movingTaskId && (
          <span className="text-xs font-semibold text-indigo-600">
            Moving task...
          </span>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onView={onView}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default TaskBoard;
