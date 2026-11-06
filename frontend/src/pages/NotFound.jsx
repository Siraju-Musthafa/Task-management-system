import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>

        <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
