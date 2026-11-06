import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  ClipboardList,
  CalendarDays,
  Pencil,
  Trash2,
  Eye,
  X,
  AlertCircle,
} from "lucide-react";

import { LayoutGrid, List } from "lucide-react";
import TaskBoard from "../../components/tasks/TaskBoard";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { connectSocket } from "../../services/socket";
const initialForm = {
  title: "",
  description: "",
  assignedTo: "",
  priority: "Medium",
  dueDate: "",
};

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong.";

const Tasks = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canCreate = role === "admin" || role === "manager";
  const isUser = role === "user";

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

    
  const [viewMode, setViewMode] = useState("table");
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks", {
        params: {
          page,
          limit: 10,
          search: search.trim() || undefined,
          status: status || undefined,
          priority: priority || undefined,
        },
      });

      const data = response.data;

      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority]);

  const fetchUsers = useCallback(async () => {
    if (!canCreate) return;

    try {
      setError("");

      const response = await api.get("/users");

      console.log("Users API response:", response.data);

      const data = response.data;

      const userList = data.users || data.data?.users || data.data || [];

      console.log("Users loaded:", userList);

      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      console.error("Users API error:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        response: err.response?.data,
      });

      setError(getErrorMessage(err));
      setUsers([]);
    }
  }, [canCreate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Listen for real-time task updates
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const socket = connectSocket(token);

    if (!socket) return;

    const handleTaskUpdate = () => {
      console.log("Real-time task update received");

      fetchTasks();
    };

    socket.on("taskAssigned", handleTaskUpdate);
    socket.on("taskUpdated", handleTaskUpdate);
    socket.on("taskStatusChanged", handleTaskUpdate);

    return () => {
      socket.off("taskAssigned", handleTaskUpdate);
      socket.off("taskUpdated", handleTaskUpdate);
      socket.off("taskStatusChanged", handleTaskUpdate);
    };
  }, [fetchTasks]);

  const openCreateModal = () => {
    setSelectedTask(null);
    setForm(initialForm);
    setModalOpen(true);
    setError("");
  };

  const openEditModal = (task) => {
    setSelectedTask(task);

    setForm({
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assignedTo?._id || task.assignedTo || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
    });

    setModalOpen(true);
    setError("");
  };

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (selectedTask) {
        await api.put(`/tasks/${selectedTask._id}`, {
          title: form.title,
          description: form.description,
          assignedTo: form.assignedTo,
          priority: form.priority,
          dueDate: form.dueDate,
        });

        setSuccess("Task updated successfully.");
      } else {
        await api.post("/tasks", form);
        setSuccess("Task created successfully.");
      }

      setModalOpen(false);
      setSelectedTask(null);
      setForm(initialForm);

      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      });

      setSuccess("Task status updated.");
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/tasks/${taskId}`);

      setSuccess("Task deleted successfully.");
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const getStatusStyle = (value) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700",
      "In Progress": "bg-blue-50 text-blue-700",
      Completed: "bg-emerald-50 text-emerald-700",
    };

    return styles[value] || "bg-slate-100 text-slate-600";
  };

  const getPriorityStyle = (value) => {
    const styles = {
      Low: "bg-slate-100 text-slate-600",
      Medium: "bg-orange-50 text-orange-700",
      High: "bg-rose-50 text-rose-700",
    };

    return styles[value] || "bg-slate-100 text-slate-600";
  };

  const pageTitle = isUser ? "My Tasks" : "Task Management";

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>

          <p className="mt-1 text-sm text-slate-500">
            {isUser
              ? "View and update your assigned tasks."
              : "Create, organize and track your team's tasks."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <List size={16} />
              Table
            </button>

            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                viewMode === "board"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid size={16} />
              Board
            </button>
          </div>

          <button
            onClick={fetchTasks}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          {canCreate && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Task
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Tasks table / Kanban board */}
{viewMode === "board" ? (
  <TaskBoard
    tasks={tasks}
    onStatusChange={handleStatusChange}
    onView={setViewTask}
  />
) : (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-12 text-center text-sm text-slate-500"
                  >
                    Loading tasks...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <ClipboardList
                      className="mx-auto mb-3 text-slate-300"
                      size={36}
                    />
                    <p className="font-semibold text-slate-700">
                      No tasks found
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Tasks will appear here when available.
                    </p>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {task.title}
                      </p>
                      <p className="mt-1 max-w-[250px] truncate text-xs text-slate-400">
                        {task.description}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {task.assignedTo?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {task.assignedTo?.email || ""}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays size={15} className="text-slate-400" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {isUser ? (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task._id, e.target.value)
                          }
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold outline-none focus:border-indigo-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      ) : (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(task.status)}`}
                        >
                          {task.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewTask(task)}
                          title="View task"
                          className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye size={17} />
                        </button>

                        {canCreate && (
                          <>
                            <button
                              onClick={() => openEditModal(task)}
                              title="Edit task"
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(task._id)}
                              title="Delete task"
                              className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 size={17} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedTask ? "Edit Task" : "Create New Task"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the task information below.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Task Title
                </label>
                <input
                  required
                  minLength={3}
                  maxLength={150}
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Enter task title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Describe the task..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Assign To
                  </label>
                  <select
                    required
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="">Select user</option>
                    {users
                      .filter((item) => {
                        const userRole = String(item.role || "").toLowerCase();

                        return role === "manager"
                          ? userRole === "user"
                          : ["user", "manager"].includes(userRole);
                      })
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} ({item.role})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Due Date
                </label>
                <input
                  required
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : selectedTask
                      ? "Save Changes"
                      : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View details modal */}
      {viewTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Task Details</h2>
              <button
                onClick={() => setViewTask(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              {viewTask.title}
            </h3>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {viewTask.description}
            </p>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-5 text-sm">
              <p>
                <strong>Assigned to:</strong>{" "}
                {viewTask.assignedTo?.name || "Unknown"}
              </p>
              <p>
                <strong>Created by:</strong>{" "}
                {viewTask.createdBy?.name || "Unknown"}
              </p>
              <p>
                <strong>Priority:</strong> {viewTask.priority}
              </p>
              <p>
                <strong>Status:</strong> {viewTask.status}
              </p>
              <p>
                <strong>Due date:</strong>{" "}
                {new Date(viewTask.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;

export default Tasks;
