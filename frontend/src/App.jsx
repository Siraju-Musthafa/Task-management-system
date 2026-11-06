import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Tasks from "./pages/tasks/Tasks";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import UserDashboard from "./pages/user/UserDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

import Loading from "./components/Loading";

// Redirect users according to their role
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

// Home redirect
const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPath(user.role)} replace />;
};

// Application routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tasks" element={<Tasks />} />
        </Route>
      </Route>

      {/* Manager routes */}
      <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/tasks" element={<Tasks />} />
        </Route>
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<Tasks />} />
        </Route>
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
