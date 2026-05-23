import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getVenueById } from "../api/venues";
import type { Venue } from "../types/venue";

function VenueCalendarPage() {
  const { id } = useParams<{ id: string }>();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenue() {
      if (!id) return;

      try {
        const response = await getVenueById(id);
        setVenue(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load availability.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading availability...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!venue) {
    return <p className="p-6">Venue not found.</p>;
  }

  return (
    <section className="mx-auto max-w-4xl p-6">
      <Link
        to={`/venues/${venue.id}`}
        className="mb-6 inline-block text-sm underline"
      >
        Back to venue
      </Link>

      <h1 className="text-3xl font-bold">
        Availability for {venue.name}
      </h1>

      <p className="mt-2 text-stone-600">
        View booked dates before choosing your stay.
      </p>

      <div className="mt-6 rounded border bg-white p-4">
        <h2 className="mb-4 text-xl font-bold">Booked dates</h2>

        {venue.bookings && venue.bookings.length > 0 ? (
          <ul className="space-y-3">
            {venue.bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded bg-stone-100 p-4 text-sm"
              >
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
          <p className="text-stone-600">
            No booked dates yet. This venue is currently fully available.
          </p>
        )}
      </div>
    </section>
  );
}

export default VenueCalendarPage;