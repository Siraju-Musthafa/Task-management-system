import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
  const { user } = useAuth();

  const dashboard =
    user?.role?.toLowerCase() === "admin"
      ? "/admin/dashboard"
      : user?.role?.toLowerCase() === "manager"
        ? "/manager/dashboard"
        : "/user/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>

        <p className="mt-4 text-slate-600">
          You don't have permission to access this page.
        </p>

        <Link
          to={dashboard}
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
