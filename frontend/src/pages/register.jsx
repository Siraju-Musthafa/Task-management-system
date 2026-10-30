import { useState } from "react";
// import { registerUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setMessage({
      type: "",
      text: "",
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";

    if (!form.email.trim()) return "Email is required";

    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(form);

      // SAVE THE TOKEN HERE
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage({
        type: "success",
        text: "Account created! Redirecting to dashboard...",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        

        {/* Heading */}
        <h2>
          Create Account
        </h2>

        {/* Alert Message */}
        {message.text && (
          <div
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Name
            </label>

            <input
              name="name"
              value={form.name}
              placeholder="Enter your name"
              onChange={handleChange}
              className="h-12 w-full rounded-xl border px-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Enter your email"
              onChange={handleChange}
              className="h-12 w-full rounded-xl border px-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              placeholder="Minimum 6 characters"
              onChange={handleChange}
              className="h-12 w-full rounded-xl border px-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-cyan-600 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-medium text-cyan-600 hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
