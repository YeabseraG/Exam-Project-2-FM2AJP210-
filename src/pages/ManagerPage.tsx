import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProfileVenues } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
import type { Venue } from "../types/venue";

function ManagerPage() {
  const { user, isLoggedIn } = useAuth();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  if (!isLoggedIn) {
    return (
      <section className="p-6">
        <h1 className="text-3xl font-bold">
          Manager dashboard
        </h1>

        <p className="mt-4">
          You need to{" "}
          <Link
            to="/login"
            className="underline"
          >
            log in
          </Link>{" "}
          as a venue manager.
        </p>
      </section>
    );
  }

  if (!user?.venueManager) {
    return (
      <section className="p-6">
        <h1 className="text-3xl font-bold">
          Manager dashboard
        </h1>

        <p className="mt-4">
          This page is only available for venue
          managers.
        </p>
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

  if (errorMessage) {
    return (
      <p className="p-6 text-red-600">
        {errorMessage}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Manager dashboard
          </h1>

          <p className="mt-2 text-stone-600">
            Manage the venues you have listed on
            Holidaze.
          </p>
        </div>

        <Link
          to="/manager/venues/new"
          className="rounded bg-stone-900 px-4 py-2 text-white"
        >
          Create venue
        </Link>
      </div>

      {venues.length === 0 ? (
        <p className="rounded border bg-white p-4 text-stone-600">
          You have not created any venues yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {venues.map((venue) => {
            const bookingCount =
              venue.bookings?.length ?? 0;

            return (
              <article
                key={venue.id}
                className="rounded border bg-white p-4 shadow"
              >
                <h2 className="text-xl font-bold">
                  {venue.name}
                </h2>

                <p className="mt-2 text-sm text-stone-600">
                  {venue.description}
                </p>

                <div className="mt-4 text-sm">
                  <p>
                    <strong>Price:</strong> $
                    {venue.price}
                  </p>

                  <p>
                    <strong>Guests:</strong>{" "}
                    {venue.maxGuests}
                  </p>

                  <p>
                    <strong>Bookings:</strong>{" "}
                    {bookingCount}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/venues/${venue.id}`}
                    className="underline"
                  >
                    View
                  </Link>

                  <Link
                    to={`/manager/venues/${venue.id}/edit`}
                    className="underline"
                  >
                    Edit
                  </Link>
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