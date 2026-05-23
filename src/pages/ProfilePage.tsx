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

      // should keep local auth state in sync so the new avatar shows immediately
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
      <section className="p-6">
        <h1 className="text-3xl font-bold">Profile</h1>

        <p className="mt-4">
          You need to{" "}
          <Link to="/login" className="underline">
            log in
          </Link>{" "}
          to view your profile.
        </p>
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
    <section className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold">Your profile</h1>

      <div className="mt-4 rounded border bg-white p-4">
        <button
          type="button"
          onClick={() => setShowAvatarEditor((current) => !current)}
          className="group relative mb-4 block"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${user?.name}'s profile picture`}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-stone-300 text-sm text-stone-600">
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
              className="w-full rounded border p-3"
            />

            {avatarMessage && <p className="text-sm">{avatarMessage}</p>}

            <button
              type="submit"
              disabled={isUpdatingAvatar}
              className="rounded bg-stone-900 px-4 py-2 text-white"
            >
              {isUpdatingAvatar ? "Updating..." : "Update picture"}
            </button>
          </form>
        )}

        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {user?.venueManager ? "Venue Manager" : "Customer"}
        </p>
      </div>

      <div className="mt-6 rounded border bg-white p-4">
        <h2 className="mb-4 text-xl font-bold">
          {user?.venueManager ? "Manager profile" : "Upcoming bookings"}
        </h2>

        {user?.venueManager ? (
          <p className="text-stone-600">
            Manage your venues from the manager dashboard.
          </p>
        ) : bookings.length > 0 ? (
          <ul className="space-y-3">
            {bookings.map((booking) => (
              <li key={booking.id} className="rounded bg-stone-100 p-4">
                <p>
                  <strong>Venue:</strong>{" "}
                  {booking.venue?.name || "Venue unavailable"}
                </p>

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

                {booking.venue?.id && (
                  <Link
                    to={`/venues/${booking.venue.id}`}
                    className="mt-2 inline-block underline"
                  >
                    View venue
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-stone-600">
            You do not have any upcoming bookings yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;