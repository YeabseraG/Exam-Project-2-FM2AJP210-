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
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {venue.media?.[0]?.url ? (
          <img
            src={venue.media[0].url}
            alt={venue.media[0].alt || venue.name}
            className="h-112.5 w-full object-cover"
          />
        ) : (
          <div className="flex h-112.5 w-full items-center justify-center bg-stone-200 text-stone-500">
            No image available
          </div>
        )}

        <div className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#174e4f] px-4 py-1 text-sm font-semibold text-white">
                  ★ {venue.rating}
                </span>

                <span className="rounded-full bg-[#f7f3ea] px-4 py-1 text-sm font-medium text-[#174e4f]">
                  Up to {venue.maxGuests} guests
                </span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-stone-800">
                {venue.name}
              </h1>

              <p className="mt-3 text-lg text-stone-500">
                {venue.location?.city},{" "}
                {venue.location?.country}
              </p>

              <p className="mt-6 text-lg leading-relaxed text-stone-700">
                {venue.description}
              </p>
            </div>

            <div className="rounded-3xl bg-[#174e4f] p-6 text-white shadow-lg lg:min-w-70">
              <p className="text-sm uppercase tracking-[0.2em] text-[#f6d7c3]">
                Starting from
              </p>

              <p className="mt-2 text-5xl font-extrabold">
                ${venue.price}
              </p>

              <p className="mt-1 text-stone-100">
                per night
              </p>

              <Link
                 to={`/venues/${venue.id}/calendar`}
                 className="mt-6 inline-block w-full rounded-2xl bg-white px-5 py-3 text-center font-semibold text-[#174e4f]! transition hover:bg-stone-100"
              >
                 Check availability
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-stone-200 bg-[#fffaf3] p-6">
              <h2 className="mb-4 text-2xl font-bold text-stone-800">
                Venue details
              </h2>

              <div className="space-y-3 text-stone-700">
                <p>
                  <strong>Price:</strong> $
                  {venue.price} / night
                </p>

                <p>
                  <strong>Guests:</strong>{" "}
                  {venue.maxGuests}
                </p>

                <p>
                  <strong>Rating:</strong>{" "}
                  {venue.rating}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {venue.location?.city},{" "}
                  {venue.location?.country}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-[#fffaf3] p-6">
              <h2 className="mb-4 text-2xl font-bold text-stone-800">
                Amenities
              </h2>

              <ul className="grid gap-3 text-stone-700">
                {amenities.map((amenity) => (
                  <li
                    key={amenity.label}
                    className={`rounded-xl px-4 py-3 ${
                      amenity.available
                        ? "bg-white text-stone-800 shadow-sm"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {amenity.available ? "✓" : "—"}{" "}
                    {amenity.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-[#fffaf3] p-6">
              <h2 className="mb-4 text-2xl font-bold text-stone-800">
                Availability preview
              </h2>

              {venue.bookings &&
              venue.bookings.length > 0 ? (
                <>
                  <ul className="space-y-3">
                    {venue.bookings
                      .slice(0, 3)
                      .map((booking) => (
                        <li
                          key={booking.id}
                          className="rounded-2xl bg-white p-4 shadow-sm"
                        >
                          <p className="text-sm text-stone-600">
                            <strong>From:</strong>{" "}
                            {new Date(
                              booking.dateFrom,
                            ).toLocaleDateString()}
                          </p>

                          <p className="mt-1 text-sm text-stone-600">
                            <strong>To:</strong>{" "}
                            {new Date(
                              booking.dateTo,
                            ).toLocaleDateString()}
                          </p>

                          <p className="mt-1 text-sm text-stone-600">
                            <strong>Guests:</strong>{" "}
                            {booking.guests}
                          </p>
                        </li>
                      ))}
                  </ul>

                  <p className="mt-4 text-sm text-stone-500">
                    Showing{" "}
                    {Math.min(
                      3,
                      venue.bookings.length,
                    )}{" "}
                    of {venue.bookings.length} bookings.
                  </p>
                </>
              ) : (
                <p className="rounded-2xl bg-white p-4 text-stone-600 shadow-sm">
                  No booked dates yet. This venue is fully available.
                </p>
              )}

              <Link
                to={`/venues/${venue.id}/calendar`}
                className="mt-6 inline-block rounded-2xl bg-[#174e4f] px-5 py-3 font-semibold text-white! transition hover:bg-[#123b3c]"
              >
                View full availability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VenuePage;