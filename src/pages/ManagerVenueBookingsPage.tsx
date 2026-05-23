import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getVenueById } from "../api/venues";
import { useAuth } from "../context/AuthContext";
import type { Venue } from "../types/venue";

function ManagerVenueBookingsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadVenue() {
      if (!id) {
        setErrorMessage("This venue link is missing an ID.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getVenueById(id);

        setVenue(response.data);
      } catch {
        setErrorMessage("Could not load the bookings for this venue.");
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (!isLoggedIn) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl items-center px-6 py-10">
        <div className="w-full rounded-3xl bg-white p-10 shadow-sm">
          <div className="rounded-3xl bg-[#174e4f] px-8 py-10 text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
              Manager access
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Venue bookings
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              Log in as a venue manager to view bookings for your listings.
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

  if (!user?.venueManager) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl items-center px-6 py-10">
        <div className="w-full rounded-3xl bg-white p-10 shadow-sm">
          <div className="rounded-3xl bg-[#174e4f] px-8 py-10 text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
              Restricted access
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Venue managers only
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              This page is only available for venue managers.
            </p>

            <Link
              to="/profile"
              className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 font-semibold text-[#174e4f]! transition hover:bg-stone-100"
            >
              Go to profile
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return <p className="p-6">Loading bookings...</p>;
  }

  if (errorMessage) {
    return <p className="p-6 text-red-600">{errorMessage}</p>;
  }

  if (!venue) {
    return <p className="p-6">Venue not found.</p>;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/manager"
        className="mb-6 inline-block text-sm font-medium text-[#174e4f] underline"
      >
        Back to dashboard
      </Link>

      <div className="mb-10 rounded-3xl bg-[#174e4f] px-8 py-10 text-white shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
          Venue bookings
        </p>

        <h1 className="text-5xl font-extrabold leading-tight">
          {venue.name}
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-stone-100">
          View booking dates and guest counts for this venue.
        </p>
      </div>

      {venue.bookings && venue.bookings.length > 0 ? (
        <ul className="space-y-4">
          {venue.bookings.map((booking) => (
            <li
              key={booking.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-sm text-stone-500">From</p>
                  <p className="mt-1 font-semibold text-stone-800">
                    {new Date(booking.dateFrom).toLocaleDateString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-sm text-stone-500">To</p>
                  <p className="mt-1 font-semibold text-stone-800">
                    {new Date(booking.dateTo).toLocaleDateString()}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fffaf3] p-4">
                  <p className="text-sm text-stone-500">Guests</p>
                  <p className="mt-1 font-semibold text-stone-800">
                    {booking.guests}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-stone-600">
            This venue does not have any bookings yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default ManagerVenueBookingsPage;