import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Users,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const DashboardOverview = () => {
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  const dashboardContent = {
    admin: {
      heading: "Platform Overview",
      description: "Monitor users, tasks and overall workspace activity.",
      cards: [
        {
          title: "Total Tasks",
          value: "—",
          description: "All workspace tasks",
          icon: ClipboardList,
          color: "bg-indigo-50 text-indigo-600",
        },
        {
          title: "Active Tasks",
          value: "—",
          description: "Tasks in progress",
          icon: Clock3,
          color: "bg-amber-50 text-amber-600",
        },
        {
          title: "Completed Tasks",
          value: "—",
          description: "Successfully completed",
          icon: CheckCircle2,
          color: "bg-emerald-50 text-emerald-600",
        },
        {
          title: "Total Users",
          value: "—",
          description: "Registered team members",
          icon: Users,
          color: "bg-sky-50 text-sky-600",
        },
      ],
    },

    manager: {
      heading: "Team Overview",
      description: "Manage your team's tasks and monitor their progress.",
      cards: [
        {
          title: "My Tasks",
          value: "—",
          description: "Tasks created by you",
          icon: ClipboardList,
          color: "bg-indigo-50 text-indigo-600",
        },
        {
          title: "In Progress",
          value: "—",
          description: "Tasks being worked on",
          icon: Clock3,
          color: "bg-amber-50 text-amber-600",
        },
        {
          title: "Completed",
          value: "—",
          description: "Completed team tasks",
          icon: CheckCircle2,
          color: "bg-emerald-50 text-emerald-600",
        },
        {
          title: "Team Members",
          value: "—",
          description: "Users in your team",
          icon: Users,
          color: "bg-sky-50 text-sky-600",
        },
      ],
    },

    user: {
      heading: "My Workspace",
      description: "Keep track of your assignments and daily progress.",
      cards: [
        {
          title: "Assigned Tasks",
          value: "—",
          description: "Tasks assigned to you",
          icon: ClipboardList,
          color: "bg-indigo-50 text-indigo-600",
        },
        {
          title: "In Progress",
          value: "—",
          description: "Tasks you are working on",
          icon: Clock3,
          color: "bg-amber-50 text-amber-600",
        },
        {
          title: "Completed",
          value: "—",
          description: "Your completed tasks",
          icon: CheckCircle2,
          color: "bg-emerald-50 text-emerald-600",
        },
        {
          title: "Due Dates",
          value: "—",
          description: "Upcoming task deadlines",
          icon: CalendarDays,
          color: "bg-sky-50 text-sky-600",
        },
      ],
    },
  };

  const content = dashboardContent[role] || dashboardContent.user;

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-indigo-600">Welcome back,</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {user?.name || "User"} 👋
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {content.description}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 sm:self-auto">
          <CalendarDays size={17} className="text-indigo-600" />
          <span>Workspace Overview</span>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            {content.heading}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your workspace statistics will appear here.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {content.cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight size={18} className="text-slate-300" />
                </div>

                <p className="mt-6 text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h3>

                <p className="mt-2 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Empty recent activity area */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Stay informed about the latest workspace updates.
            </p>
          </div>

          <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            Activity feed
          </span>
        </div>

        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <ClipboardList size={26} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-700">
            No activity to display yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Task assignments, status changes and other workspace updates will
            appear here once activity tracking is connected.
          </p>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;
