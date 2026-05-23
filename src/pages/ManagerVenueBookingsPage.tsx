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

        // Fetching the full venue here should keep the bookings data in one request
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
      <section className="p-6">
        <h1 className="text-3xl font-bold">Venue bookings</h1>

        <p className="mt-4">
          You need to{" "}
          <Link to="/login" className="underline">
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
        <h1 className="text-3xl font-bold">Venue bookings</h1>

        <p className="mt-4">
          This page is only available for venue managers.
        </p>
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
    <section className="mx-auto max-w-4xl p-6">
      <Link to="/manager" className="mb-6 inline-block text-sm underline">
        Back to dashboard
      </Link>

      <h1 className="text-3xl font-bold">Bookings for {venue.name}</h1>

      {venue.bookings && venue.bookings.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {venue.bookings.map((booking) => (
            <li key={booking.id} className="rounded border bg-white p-4">
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded border bg-white p-4 text-stone-600">
          This venue does not have any bookings yet.
        </p>
      )}
    </section>
  );
}

export default ManagerVenueBookingsPage;