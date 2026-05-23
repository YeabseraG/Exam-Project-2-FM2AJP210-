import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!formData.email.endsWith("@stud.noroff.no")) {
      setError("Email must be a valid @stud.noroff.no address.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
      setError(
        "Name can only contain letters, numbers, and underscores.",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      await registerUser(formData);

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Registration failed");
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
            Join Holidaze
          </p>

          <h1 className="text-5xl font-extrabold leading-tight">
            Start planning better stays.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-100">
            Create a customer account to book venues, or register as a venue
            manager to list and manage your own holiday stays.
          </p>
        </div>

        <div className="px-8 py-14 lg:px-12">
          <h2 className="text-3xl font-bold text-stone-800">
            Create account
          </h2>

          <p className="mt-2 text-stone-600">
            Use your Noroff student email to register.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block font-semibold text-stone-700">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
              />
            </div>

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

            <label className="flex items-start gap-3 rounded-2xl bg-[#fffaf3] p-4 text-stone-700">
              <input
                type="checkbox"
                name="venueManager"
                checked={formData.venueManager}
                onChange={handleChange}
                className="mt-1"
              />

              <span>
                <span className="block font-semibold">
                  Register as Venue Manager
                </span>
                <span className="text-sm text-stone-600">
                  Choose this if you want to create, edit and manage venues.
                </span>
              </span>
            </label>

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
              {loading ? "Registering..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#174e4f] underline"
            >
              Log in here
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;