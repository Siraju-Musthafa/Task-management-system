import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, Eye, UserRound } from "lucide-react";

const priorityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-orange-50 text-orange-700",
  High: "bg-rose-50 text-rose-700",
};

const TaskCard = ({ task, onView }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "z-50 opacity-40 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 break-words text-sm font-bold text-slate-800">
          {task.title}
        </h3>

        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag task"
          title="Drag task to another status"
          className="shrink-0 cursor-grab rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing"
        >
          <GripVertical size={19} />
        </button>
      </div>

      <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
        {task.description || "No description provided."}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            priorityStyles[task.priority] || "bg-slate-100 text-slate-600"
          }`}
        >
          {task.priority || "Medium"} Priority
        </span>

        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <CalendarDays size={13} />
          {dueDate}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <UserRound size={14} className="shrink-0 text-slate-400" />
          <span className="truncate text-xs text-slate-500">
            {task.assignedTo?.name || "Unassigned"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onView(task)}
          title="View task"
          className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Eye size={16} />
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
