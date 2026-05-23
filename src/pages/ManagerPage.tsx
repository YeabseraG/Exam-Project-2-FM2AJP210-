import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProfileVenues } from "../api/profiles";
import { deleteVenue } from "../api/venues";
import { useAuth } from "../context/AuthContext";
import type { Venue } from "../types/venue";

function ManagerPage() {
  const { user, isLoggedIn } = useAuth();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [deletingVenueId, setDeletingVenueId] =
    useState("");

  useEffect(() => {
    if (!user?.name) {
      setIsLoading(false);
      return;
    }

    const profileName = user.name;

    async function fetchVenues() {
      try {
        const result =
          await getProfileVenues(profileName);

        setVenues(result.data || []);
      } catch {
        setErrorMessage(
          "Could not load your venues right now.",
        );
      }

      setIsLoading(false);
    }

    fetchVenues();
  }, [user?.name]);

  async function handleDeleteVenue(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this venue? This cannot be undone.",
    );

    if (!confirmed) return;

    setDeletingVenueId(id);
    setErrorMessage("");

    try {
      await deleteVenue(id);

      setVenues((currentVenues) =>
        currentVenues.filter(
          (venue) => venue.id !== id,
        ),
      );
    } catch {
      setErrorMessage(
        "Could not delete this venue right now.",
      );
    } finally {
      setDeletingVenueId("");
    }
  }

  if (!isLoggedIn) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-6xl items-center px-6 py-10">
        <div className="w-full rounded-3xl bg-white p-10 shadow-sm">
          <div className="rounded-3xl bg-[#174e4f] px-8 py-10 text-white">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
              Manager access
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Venue manager dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              Log in as a venue manager to create, edit and manage your Holidaze listings.
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
              Become a venue manager
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              This page is only available for venue managers. Register as a venue manager to create and manage listings.
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
    return (
      <p className="p-6">
        Loading your venues...
      </p>
    );
  }

  if (errorMessage && venues.length === 0) {
    return (
      <p className="p-6 text-red-600">
        {errorMessage}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-3xl bg-[#174e4f] px-8 py-10 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#f6d7c3]">
              Venue management
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Manager dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-stone-100">
              Manage your venues, bookings and listings from one place.
            </p>
          </div>

          <Link
            to="/manager/venues/new"
            className="w-fit rounded-2xl bg-white px-5 py-3 font-semibold text-[#174e4f]! transition hover:bg-stone-100"
          >
            Create venue
          </Link>
        </div>
      </div>

      {errorMessage && (
        <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
          {errorMessage}
        </p>
      )}

      {venues.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-stone-600">
            You have not created any venues yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {venues.map((venue) => {
            const bookingCount =
              venue.bookings?.length ?? 0;

            const isDeleting =
              deletingVenueId === venue.id;

            return (
              <article
                key={venue.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {venue.media?.[0]?.url ? (
                  <img
                    src={venue.media[0].url}
                    alt={
                      venue.media[0].alt ||
                      venue.name
                    }
                    className="h-60 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center bg-stone-200 text-stone-500">
                    No image available
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">
                        {venue.name}
                      </h2>

                      <p className="mt-1 text-sm text-stone-500">
                        {venue.location?.city},{" "}
                        {venue.location?.country}
                      </p>
                    </div>

                    <div className="rounded-full bg-[#174e4f] px-3 py-1 text-sm font-semibold text-white">
                      ★ {venue.rating}
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-stone-600">
                    {venue.description}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#fffaf3] p-4">
                      <p className="text-sm text-stone-500">
                        Price
                      </p>

                      <p className="mt-1 font-semibold text-stone-800">
                        ${venue.price}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fffaf3] p-4">
                      <p className="text-sm text-stone-500">
                        Guests
                      </p>

                      <p className="mt-1 font-semibold text-stone-800">
                        {venue.maxGuests}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fffaf3] p-4">
                      <p className="text-sm text-stone-500">
                        Bookings
                      </p>

                      <p className="mt-1 font-semibold text-stone-800">
                        {bookingCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/venues/${venue.id}`}
                      className="rounded-2xl bg-[#174e4f] px-4 py-2 font-semibold text-white! transition hover:bg-[#123b3c]"
                    >
                      View
                    </Link>

                    <Link
                      to={`/manager/venues/${venue.id}/edit`}
                      className="rounded-2xl border border-stone-300 px-4 py-2 font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                      Edit
                    </Link>

                    <Link
                      to={`/manager/venues/${venue.id}/bookings`}
                      className="rounded-2xl border border-stone-300 px-4 py-2 font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                      Bookings
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteVenue(
                          venue.id,
                        )
                      }
                      disabled={isDeleting}
                      className="rounded-2xl border border-red-200 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50 disabled:border-stone-200 disabled:text-stone-400"
                    >
                      {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ManagerPage;