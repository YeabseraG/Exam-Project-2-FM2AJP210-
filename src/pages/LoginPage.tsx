import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!formData.email.endsWith("@stud.noroff.no")) {
      setError("Please use your stud.noroff.no email.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);

      const user = {
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        venueManager: response.data.venueManager,
      };

      login(response.data.accessToken, user);

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.toLowerCase().includes("invalid")
        ) {
          setError("Incorrect email or password.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-7xl items-center px-6 py-10">
      <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-2">
        <div className="bg-[#174e4f] px-8 py-14 text-white lg:px-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f6d7c3]">
            Welcome back
          </p>

          <h1 className="text-5xl font-extrabold leading-tight">
            Continue your Holidaze journey.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-100">
            Log in to manage bookings, update your profile, or continue planning your next stay.
          </p>
        </div>

        <div className="px-8 py-14 lg:px-12">
          <h2 className="text-3xl font-bold text-stone-800">
            Login
          </h2>

          <p className="mt-2 text-stone-600">
            Use your Noroff student email to access your account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#174e4f] p-3 font-semibold text-white! transition hover:bg-[#123b3c]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-600">
            No account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#174e4f] underline"
            >
              Register here
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;