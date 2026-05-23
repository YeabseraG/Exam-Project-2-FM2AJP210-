import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProfile } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
import type { Booking } from "../types/booking";

function ProfilePage() {
  const { user, isLoggedIn } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch {
        setError("Could not load your profile right now, Please Refresh page or try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user?.name]);

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