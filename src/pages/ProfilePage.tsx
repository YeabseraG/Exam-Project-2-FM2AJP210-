import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProfile, updateProfile } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
import type { Booking } from "../types/booking";

function ProfilePage() {
  const { user, isLoggedIn, login } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || "");
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("");

  useEffect(() => {
    if (!user?.name) {
      setLoading(false);
      return;
    }

    const profileName = user.name;

    async function loadProfile() {
      try {
        const response = await getProfile(profileName);
        setBookings(response.data.bookings || []);
        setAvatarUrl(response.data.avatar?.url || "");
      } catch {
        setError(
          "Could not load your profile right now. Please refresh the page or try again later.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user?.name]);

  async function handleAvatarSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.name) return;

    if (!avatarUrl) {
      setAvatarMessage("Please enter an image URL.");
      return;
    }

    setIsUpdatingAvatar(true);
    setAvatarMessage("");

    try {
      await updateProfile(user.name, {
        avatar: {
          url: avatarUrl,
          alt: `${user.name}'s profile picture`,
        },
      });

      const token = localStorage.getItem("token") || "";

      login(token, {
        ...user,
        avatar: {
          url: avatarUrl,
          alt: `${user.name}'s profile picture`,
        },
      });

      setAvatarMessage("Profile picture updated.");
      setShowAvatarEditor(false);
    } catch {
      setAvatarMessage(
        "Could not update your profile picture. Please check the image URL.",
      );
    } finally {
      setIsUpdatingAvatar(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl items-center px-6 py-10">
        <div className="w-full rounded-3xl bg-white p-10 shadow-sm">
          <div className="rounded-3xl bg-[#174e4f] px-8 py-10 text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
              Profile access
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Your Holidaze profile
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              Log in to manage bookings, update your account and access your
              venue dashboard.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-[#174e4f]! transition hover:bg-stone-100"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 rounded-3xl bg-[#174e4f] px-8 py-10 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
          Your account
        </p>

        <h1 className="text-5xl font-extrabold leading-tight">
          Welcome back, {user?.name}
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-stone-100">
          Manage your account, update your profile picture and keep track of
          your bookings.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => setShowAvatarEditor((current) => !current)}
          className="group relative mb-4 block"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${user?.name}'s profile picture`}
              className="h-28 w-28 rounded-full border-4 border-[#fffaf3] object-cover shadow-md"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-stone-300 text-sm text-stone-600 shadow-md">
              No image
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition group-hover:opacity-100">
            <span className="text-sm font-medium text-white">Edit</span>
          </div>
        </button>

        {showAvatarEditor && (
          <form onSubmit={handleAvatarSubmit} className="mb-4 space-y-3">
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-3 outline-none transition focus:border-[#174e4f]"
            />

            {avatarMessage && <p className="text-sm">{avatarMessage}</p>}

            <button
              type="submit"
              disabled={isUpdatingAvatar}
              className="rounded-2xl bg-[#174e4f] px-5 py-2.5 font-semibold text-white! transition hover:bg-[#123b3c]"
            >
              {isUpdatingAvatar ? "Updating..." : "Update picture"}
            </button>
          </form>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#fffaf3] p-4">
            <p className="text-sm text-stone-500">Name</p>

            <p className="mt-1 font-semibold text-stone-800">{user?.name}</p>
          </div>

          <div className="rounded-2xl bg-[#fffaf3] p-4">
            <p className="text-sm text-stone-500">Email</p>

            <p className="mt-1 font-semibold text-stone-800">{user?.email}</p>
          </div>

          <div className="rounded-2xl bg-[#fffaf3] p-4">
            <p className="text-sm text-stone-500">Role</p>

            <p className="mt-1 font-semibold text-stone-800">
              {user?.venueManager ? "Venue Manager" : "Customer"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-stone-800">
          {user?.venueManager ? "Manager profile" : "Upcoming bookings"}
        </h2>

        {user?.venueManager ? (
          <p className="text-stone-600">
            Manage your venues from the{" "}
            <Link
              to="/manager"
              className="font-semibold text-[#174e4f] underline"
            >
              manager dashboard
            </Link>
            .
          </p>
        ) : bookings.length > 0 ? (
          <ul className="space-y-3">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-2xl bg-[#fffaf3] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="text-xl font-bold text-stone-800">
                      {booking.venue?.name || "Venue unavailable"}
                    </p>

                    <div className="mt-3 space-y-1 text-stone-600">
                      <p>
                        <strong>From:</strong>{" "}
                        {new Date(booking.dateFrom).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>To:</strong>{" "}
                        {new Date(booking.dateTo).toLocaleDateString()}
                      </p>

                      <p>
                        <strong>Guests:</strong> {booking.guests}
                      </p>
                    </div>

                    {booking.venue?.id && (
                      <Link
                        to={`/venues/${booking.venue.id}`}
                        className="mt-4 inline-block font-semibold text-[#174e4f] underline"
                      >
                        View venue
                      </Link>
                    )}
                  </div>

                  {booking.venue?.media?.[0]?.url ? (
                    <img
                      src={booking.venue.media[0].url}
                      alt={
                        booking.venue.media[0].alt ||
                        booking.venue.name ||
                        "Booked venue"
                      }
                      className="h-32 w-full rounded-2xl object-cover sm:w-44"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-stone-200 text-sm text-stone-500 sm:w-44">
                      No image
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-[#fffaf3] p-5 text-stone-600">
            You do not have any upcoming bookings yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;