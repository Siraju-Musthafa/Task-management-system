import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Bell, ChevronDown, LogOut, Menu, UserCircle, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/admin/dashboard": "Admin Dashboard",
  "/manager/dashboard": "Manager Dashboard",
  "/user/dashboard": "My Dashboard",
  "/admin/tasks": "All Tasks",
  "/admin/users": "User Management",
  "/admin/managers": "Manager Management",
  "/manager/tasks": "My Tasks",
  "/manager/team": "My Team",
  "/user/tasks": "My Tasks",
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pageTitle = pageTitles[location.pathname] || "TaskFlow Workspace";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "U";

  return (
    <header className="relative z-30 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">
            Workspace / Overview
          </p>

          <h2 className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((previous) => !previous);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-indigo-600" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-14 w-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:w-80">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Notifications</h3>

                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="py-8 text-center">
                <Bell size={27} className="mx-auto text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  You're all caught up
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  New task notifications will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-9 w-px bg-slate-200 sm:block" />

        {/* User profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((previous) => !previous);
              setNotificationsOpen(false);
            }}
            aria-expanded={profileOpen}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-[130px] truncate text-sm font-bold text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {user?.role || "Member"}
              </p>
            </div>

            <ChevronDown size={17} className="hidden text-slate-400 sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 p-4">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user?.name}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {user?.email}
                </p>

                <span className="mt-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {user?.role}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
