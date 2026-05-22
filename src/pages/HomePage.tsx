import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getVenues } from "../api/venues";
import type { Venue } from "../types/venue";

function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenues() {
      try {
        const response = await getVenues();
        setVenues(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load venues.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadVenues();
  }, []);

  if (loading) {
    return <p className="p-6">Loading venues...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <section className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Holidaze</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Link
            key={venue.id}
            to={`/venues/${venue.id}`}
            className="rounded border bg-white p-4 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            {venue.media?.[0]?.url ? (
              <img
                src={venue.media[0].url}
                alt={venue.media[0].alt || venue.name}
                className="mb-4 h-48 w-full rounded object-cover"
              />
            ) : (
              <div className="mb-4 flex h-48 w-full items-center justify-center rounded bg-stone-200 text-stone-500">
                No image available
              </div>
            )}

            <h2 className="text-xl font-bold">{venue.name}</h2>

            <p className="mt-2 line-clamp-3 text-sm text-stone-600">
              {venue.description}
            </p>

            <div className="mt-4 space-y-1 text-sm">
              <p>
                <strong>Price:</strong> ${venue.price}
              </p>

              <p>
                <strong>Guests:</strong> {venue.maxGuests}
              </p>

              <p>
                <strong>Rating:</strong> {venue.rating}
              </p>

              <p>
                <strong>Location:</strong> {venue.location?.city},{" "}
                {venue.location?.country}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default HomePage;