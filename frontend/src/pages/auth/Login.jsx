import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const getDashboardPath = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/admin/dashboard";
    case "manager":
      return "/manager/dashboard";
    case "user":
      return "/user/dashboard";
    default:
      return "/login";
  }
};

const Login = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      const loggedInUser = await login(
        formData.email.trim(),
        formData.password,
      );

      const dashboard = getDashboardPath(loggedInUser.role);

      if (dashboard === "/login") {
        setError("Your account has an invalid role.");
        return;
      }

      navigate(dashboard, { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f5fa] px-4 py-8 sm:px-6 lg:px-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative grid w-full max-w-[1120px] overflow-hidden rounded-[26px] border border-white bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)] lg:min-h-[690px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT BRANDING PANEL */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#151b35] p-10 text-white lg:flex xl:p-14">
          {/* Decorative shapes */}
          <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative z-10">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-900/30">
                <CheckSquare size={25} strokeWidth={2.5} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
                <p className="text-[10px] font-semibold tracking-[3px] text-indigo-200">
                  WORKSPACE
                </p>
              </div>
            </div>

            {/* Main heading */}
            <div className="mt-28 max-w-lg xl:mt-32">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-xs font-medium text-indigo-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Your productivity workspace
              </div>

              <h2 className="text-4xl font-bold leading-[1.2] tracking-tight xl:text-[52px]">
                Work smarter.
                <span className="block text-indigo-300">Achieve more.</span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-8 text-slate-300 xl:text-base">
                Bring your team, tasks and daily priorities together. Manage
                projects, track progress and stay focused with one powerful
                workspace.
              </p>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Users size={21} />
                </div>

                <h3 className="text-sm font-semibold">Team collaboration</h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Keep everyone aligned and productive.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Zap size={21} />
                </div>

                <h3 className="text-sm font-semibold">Real-time updates</h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Stay informed about every task.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
            <span>© 2026 TaskFlow</span>
            <span>Built for better teamwork</span>
          </div>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-[400px]">
            {/* Mobile logo */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <CheckSquare size={23} />
              </div>

              <span className="text-2xl font-bold text-slate-900">
                TaskFlow
              </span>
            </div>

            {/* Heading */}
            <div className="mb-9">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-bold tracking-wide text-indigo-700">
                <ShieldCheck size={15} />
                SECURE ACCOUNT ACCESS
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-[38px]">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Sign in to your workspace and continue where you left off.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="h-14 w-full rounded-xl border border-slate-200 bg-[#f8f9fc] pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2.5 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-14 w-full rounded-xl border border-slate-200 bg-[#f8f9fc] pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-9 border-t border-slate-100 pt-7 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 transition hover:text-indigo-800"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Security footer */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <CheckCircle2 size={15} className="text-emerald-500" />
              Secure access to your team's workspace
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
