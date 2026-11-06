import { NavLink } from "react-router-dom";

import {
  CheckSquare,
  LayoutDashboard,
  ClipboardList,
  Users,
  UserRound,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";

const navigationByRole = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "All Tasks", path: "/admin/tasks", icon: ClipboardList },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Managers", path: "/admin/managers", icon: UserRound },
  ],

  manager: [
    { label: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { label: "My Tasks", path: "/manager/tasks", icon: ClipboardList },
    { label: "My Team", path: "/manager/team", icon: Users },
  ],

  user: [
    { label: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
    { label: "My Tasks", path: "/user/tasks", icon: ClipboardList },
  ],
};

const Sidebar = ({ role, open, onClose }) => {
  const normalizedRole = role?.toLowerCase();
  const navigation = navigationByRole[normalizedRole] || [];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[265px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[82px] items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <CheckSquare size={24} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                TaskFlow
              </h1>
              <p className="text-[10px] font-semibold tracking-[2px] text-slate-400">
                WORKSPACE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="my-8 border-t border-slate-100" />

          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
            General
          </p>

          <div className="space-y-2">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400"
            >
              <Settings size={19} />
              Settings
              <span className="ml-auto text-[10px]">Soon</span>
            </button>

            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400"
            >
              <HelpCircle size={19} />
              Help Center
              <span className="ml-auto text-[10px]">Soon</span>
            </button>
          </div>
        </div>

        {/* Bottom card */}
        <div className="border-t border-slate-100 p-5">
          <div className="rounded-2xl bg-indigo-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <ZapIcon />
              <span className="text-sm font-bold text-indigo-900">
                Stay productive
              </span>
            </div>

            <p className="text-xs leading-5 text-indigo-700">
              Keep your tasks organized and make progress every day.
            </p>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-400">
            © 2026 TaskFlow
          </p>
        </div>
      </aside>
    </>
  );
};

const ZapIcon = () => (
  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
    <CheckSquare size={15} />
  </span>
);

export default Sidebar;
