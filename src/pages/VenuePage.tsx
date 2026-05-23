import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getVenueById } from "../api/venues";
import type { Venue } from "../types/venue";

function VenuePage() {
  const { id } = useParams<{ id: string }>();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenue() {
      if (!id) {
        setError("This venue link is missing an ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await getVenueById(id);
        setVenue(response.data);
      } catch {
        setError(
          "Could not load this venue right now. Refresh the page or try again later.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading venue...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!venue) {
    return <p className="p-6">Venue not found.</p>;
  }

  const amenities = [
    { label: "Wifi", available: venue.meta?.wifi },
    { label: "Parking", available: venue.meta?.parking },
    { label: "Breakfast", available: venue.meta?.breakfast },
    { label: "Pets allowed", available: venue.meta?.pets },
  ];

  return (
    <section className="mx-auto max-w-5xl p-6">
      {venue.media?.[0]?.url ? (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt || venue.name}
          className="mb-6 h-80 w-full rounded object-cover"
        />
      ) : (
        <div className="mb-6 flex h-80 w-full items-center justify-center rounded bg-stone-200 text-stone-500">
          No image available
        </div>
      )}

      <h1 className="text-4xl font-bold">{venue.name}</h1>

      <p className="mt-4 text-stone-700">{venue.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <h2 className="mb-3 text-xl font-bold">Venue details</h2>

          <p>
            <strong>Price:</strong> ${venue.price} / night
          </p>

          <p>
            <strong>Max guests:</strong> {venue.maxGuests}
          </p>

          <p>
            <strong>Rating:</strong> {venue.rating}
          </p>

          <p>
            <strong>Location:</strong> {venue.location?.city},{" "}
            {venue.location?.country}
          </p>
        </div>

        <div className="rounded border bg-white p-4">
          <h2 className="mb-3 text-xl font-bold">Amenities</h2>

          <ul className="grid gap-2 text-sm">
            {amenities.map((amenity) => (
              <li
                key={amenity.label}
                className={
                  amenity.available ? "text-stone-900" : "text-stone-400"
                }
              >
                {amenity.available ? "✓" : "—"} {amenity.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded border bg-white p-4 md:col-span-2">
          <h2 className="mb-3 text-xl font-bold">Availability preview</h2>

          {venue.bookings && venue.bookings.length > 0 ? (
            <>
              <ul className="space-y-2">
                {venue.bookings.slice(0, 3).map((booking) => (
                  <li
                    key={booking.id}
                    className="rounded bg-stone-100 p-3 text-sm"
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

              <p className="mt-3 text-sm text-stone-600">
                Showing 3 of {venue.bookings.length} bookings.
              </p>

              <Link
                to={`/venues/${venue.id}/calendar`}
                className="mt-4 inline-block rounded bg-stone-900 px-4 py-2 text-white"
              >
                View full availability
              </Link>
            </>
          ) : (
            <>
              <p className="text-stone-600">
                No booked dates yet. This venue is fully available.
              </p>

              <Link
                to={`/venues/${venue.id}/calendar`}
                className="mt-4 inline-block rounded bg-stone-900 px-4 py-2 text-white"
              >
                View availability
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default VenuePage;